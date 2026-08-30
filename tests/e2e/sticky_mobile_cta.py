"""
E2E-test för StickyMobileCta (Playwright, headless Chromium).

Verifierar:
  1. Startsidan (/), mobil 390px: baren är dold före scroll, synlig efter
     scroll förbi hero, och knappen smooth-scrollar till #paket.
  2. /faq (mobil): baren renderas aldrig, inte ens efter scroll.
  3. /product/starter-pack-12-cups-1 (mobil): baren renderas aldrig.
  4. Startsidan vid 700px respektive 1024px bredd: baren är dold även
     efter scroll (sm:hidden, dvs. endast <640px).

Kör:  python3 tests/e2e/sticky_mobile_cta.py
Kräver att dev-servern svarar på http://localhost:8080.
"""

import asyncio
import re
import sys
from playwright.async_api import async_playwright

BASE = "http://localhost:8080"
BAR = '[data-testid="sticky-mobile-cta"]'
MOBILE = {"width": 390, "height": 710}
FAILURES: list[str] = []


def check(name: str, ok: bool, detail: str = "") -> None:
    print(("PASS" if ok else "FAIL"), "-", name, (f"({detail})" if detail else ""))
    if not ok:
        FAILURES.append(name)


async def bar_display(page) -> str:
    return await page.evaluate(
        """() => {
            const el = document.querySelector('[data-testid="sticky-mobile-cta"]');
            return el ? getComputedStyle(el).display : 'absent';
        }"""
    )


CONSENT_INIT = """
localStorage.setItem('plaently_cookie_consent_v1',
  JSON.stringify({ consent: { analytics: true, marketing: true }, timestamp: Date.now() }));
sessionStorage.setItem('newsletter-dismissed', 'true');
"""


async def new_context(pw, viewport):
    """Ny browsercontext utan störande overlays (cookie-banner, popup)."""
    browser = await pw.chromium.launch(headless=True)
    ctx = await browser.new_context(viewport=viewport)
    await ctx.add_init_script(CONSENT_INIT)
    return browser, ctx


async def open_page(context, path: str):
    """Öppna sidan och vänta in full hydrering + client-only komponenter."""
    page = await context.new_page()
    await page.goto(BASE + path, wait_until="networkidle")
    await page.wait_for_timeout(2000)  # lazy-mount (popupReady) + data-sektioner
    return page


async def scroll_past_hero(page) -> None:
    # Scrolla i två steg så att scroll-eventet säkert triggas även om
    # komponentens lyssnare monteras strax efter första scrollen.
    await page.evaluate("window.scrollTo(0, 1500)")
    await page.wait_for_timeout(500)
    await page.evaluate("window.scrollTo(0, 1499); window.scrollTo(0, 1500)")
    await page.wait_for_timeout(500)


async def test_home_mobile(pw) -> None:
    browser, ctx = await new_context(pw, MOBILE)
    page = await open_page(ctx, "/")

    check("mobil: dold före scroll", (await bar_display(page)) in ("absent", "none"))

    await scroll_past_hero(page)
    # Polla: baren monteras lazy efter hydrering, ge den upp till 5s.
    display = "absent"
    for _ in range(10):
        display = await bar_display(page)
        if display == "flex":
            break
        await page.evaluate("window.scrollTo(0, 1499); window.scrollTo(0, 1500)")
        await page.wait_for_timeout(500)
    check("mobil: synlig efter hero", display == "flex", f"display={display}")

    btn = page.locator('[data-testid="sticky-mobile-cta"]').get_by_role("button", name=re.compile("paket|starter", re.I))
    check("mobil: knapp finns i baren", await btn.count() > 0)

    before = await page.evaluate("window.scrollY")
    if await btn.count() > 0:
        await btn.first.click()
        # Smooth-scroll tar tid — polla tills #paket når viewporttoppen.
        target_top = 99999.0
        for _ in range(40):
            await page.wait_for_timeout(100)
            target_top = await page.evaluate(
                "document.getElementById('paket')?.getBoundingClientRect().top ?? 99999"
            )
            if abs(target_top) <= 80:
                break
        after = await page.evaluate("window.scrollY")
        check(
            "mobil: smooth-scroll till #paket",
            abs(target_top) <= 80 and after > before,
            f"targetTop={target_top:.0f}, scrollY {before}->{after}",
        )
    await browser.close()


async def test_not_on_other_pages(pw) -> None:
    browser, ctx = await new_context(pw, MOBILE)
    for path in ("/faq", "/product/starter-pack-12-cups-1"):
        page = await open_page(ctx, path)
        await scroll_past_hero(page)
        check(f"mobil {path}: baren syns inte", (await bar_display(page)) in ("absent", "none"))
        await page.close()
    await browser.close()


async def test_hidden_above_sm(pw) -> None:
    browser = await pw.chromium.launch(headless=True)
    for width in (700, 1024):
        ctx = await browser.new_context(viewport={"width": width, "height": 800})
        page = await open_page(ctx, "/")
        await scroll_past_hero(page)
        display = await bar_display(page)
        check(f"{width}px: baren dold (sm:hidden)", display in ("absent", "none"), f"display={display}")
        await ctx.close()
        await browser.close()


async def main() -> None:
    async with async_playwright() as pw:
        await test_home_mobile(pw)
        await test_not_on_other_pages(pw)
        await test_hidden_above_sm(pw)

    print()
    if FAILURES:
        print(f"{len(FAILURES)} test misslyckades:", ", ".join(FAILURES))
        sys.exit(1)
    print("Alla StickyMobileCta-tester passerade.")


asyncio.run(main())
