import { canonicalizeHandle } from "@/lib/productSeo";

export const PL_PILOT_HANDLES = [
  "starter-pack-12-cups-1",
  "plant-based-fusilli-bolognese",
  "plant-based-pasta-carbonara",
  "plant-based-yellow-curry-rice",
  "plant-based-smoky-bbq-lentils",
  "bolognese-box-12-cups",
  "carbonara-box-12-cups",
  "smoky-lentils-box-12-cups",
  "yellow-curry-box-12-cups",
] as const;

export function isPolishPilotHandle(handle: string): boolean {
  return (PL_PILOT_HANDLES as readonly string[]).includes(canonicalizeHandle(handle));
}

export type ApprovedPlCopy = { approved: boolean; html: string };

export const PL_PRODUCT_COPY: Record<string, ApprovedPlCopy> = {
  "plant-based-fusilli-bolognese": {
    approved: true,
    html: `<p>To nie jest zwykły sos pomidorowy — to smakowita podróż prosto ze słońca! Nasz sekret? Hojna porcja czerwonej papryki dodająca głębi i złożoności oraz odrobina oliwy z oliwek extra vergine dla delikatnego, owocowego finiszu. Dołącz do naszej roślinnej podróży w głąb Włoch.</p>
<h3>Wartości odżywcze</h3>
<table>
<thead><tr><th>Wartość odżywcza</th><th>Na kubek (75 g)</th><th>Na 100 g suchej masy</th></tr></thead>
<tbody>
<tr><td>Energia</td><td>263 kcal / 1109 kJ</td><td>350 kcal / 1479 kJ</td></tr>
<tr><td>Tłuszcz</td><td>2,2 g</td><td>2,9 g</td></tr>
<tr><td>w tym kwasy tłuszczowe nasycone</td><td>0,4 g</td><td>0,5 g</td></tr>
<tr><td>Węglowodany</td><td>37,5 g</td><td>50 g</td></tr>
<tr><td>w tym cukry</td><td>7,1 g</td><td>9,4 g</td></tr>
<tr><td>Błonnik</td><td>5,9 g</td><td>7,8 g</td></tr>
<tr><td>Białko</td><td>20,3 g</td><td>27 g</td></tr>
<tr><td>Sól</td><td>2,4 g</td><td>3,2 g</td></tr>
</tbody>
</table>
<h3>Składniki</h3>
<p>Makaron (kasza manna z <strong>pszenicy</strong> durum, izolat białka grochu) 52%, teksturowane białko grochu 21%, pomidor, skrobia ziemniaczana, aromat, cebula, cukier, sól, marchew, czosnek, czerwona papryka, zioła i przyprawy, oliwa z oliwek extra vergine.</p>
<h3>Alergeny</h3>
<p><strong>Zawiera:</strong> pszenicę.</p>
<p><strong>Może zawierać śladowe ilości:</strong> mleka, soi i jaj.</p>
<h3>Przygotowanie</h3>
<p>Potrząśnij zamkniętym kubkiem. Zdejmij pokrywkę, dodaj zalecaną ilość wrzącej wody — około 190 ml — i dokładnie wymieszaj widelcem. Odczekaj 5 minut, ponownie wymieszaj i smacznego!</p>
<p>Masa netto: 75 g · Termin przydatności do spożycia: 12 miesięcy</p>`,
  },
  "plant-based-pasta-carbonara": {
    approved: true,
    html: `<p>To nie jest zwykły ser ze śmietaną — roślinne białko spotyka kremowy makaron! Nasz sekret? Wyrafinowana gra tekstur grochu oraz pikantna nuta czarnego pieprzu i czosnku, która oddaje klasycznego włoskiego ducha. Dołącz do naszej roślinnej podróży w głąb Rzymu — tam, gdzie carbonara spotyka przyszłość.</p>
<h3>Wartości odżywcze</h3>
<table>
<thead><tr><th>Wartość odżywcza</th><th>Na kubek (75 g)</th><th>Na 100 g suchej masy</th></tr></thead>
<tbody>
<tr><td>Energia</td><td>285 kcal / 1202 kJ</td><td>380 kcal / 1602 kJ</td></tr>
<tr><td>Tłuszcz</td><td>6,4 g</td><td>8,5 g</td></tr>
<tr><td>w tym kwasy tłuszczowe nasycone</td><td>0,6 g</td><td>0,8 g</td></tr>
<tr><td>Węglowodany</td><td>34,5 g</td><td>46 g</td></tr>
<tr><td>w tym cukry</td><td>5,0 g</td><td>6,6 g</td></tr>
<tr><td>Błonnik</td><td>4,3 g</td><td>5,8 g</td></tr>
<tr><td>Białko</td><td>20,2 g</td><td>27 g</td></tr>
<tr><td>Sól</td><td>2,9 g</td><td>3,9 g</td></tr>
</tbody>
</table>
<h3>Składniki</h3>
<p>Makaron (kasza manna z <strong>pszenicy</strong> durum, izolat białka grochu) 52%, teksturowane białko grochu 21%, serwatka w proszku (zawiera <strong>mleko</strong>), skrobia ziemniaczana, proszek z oleju słonecznikowego (nieutwardzony olej słonecznikowy wysokooleinowy, syrop glukozowy, białko <strong>mleka</strong>), proszek sera topionego (zawiera <strong>mleko</strong>), aromaty (zawierają <strong>mleko</strong>), sól, czarny pieprz, czosnek, kurkuma.</p>
<h3>Alergeny</h3>
<p><strong>Zawiera:</strong> pszenicę i mleko.</p>
<p><strong>Może zawierać śladowe ilości:</strong> soi i jaj.</p>
<h3>Przygotowanie</h3>
<p>Potrząśnij zamkniętym kubkiem. Zdejmij pokrywkę, dodaj zalecaną ilość wrzącej wody — około 170 ml — i dokładnie wymieszaj widelcem. Odczekaj 5 minut, ponownie wymieszaj i smacznego!</p>
<p>Masa netto: 75 g · Termin przydatności do spożycia: 12 miesięcy</p>`,
  },
  "plant-based-yellow-curry-rice": {
    approved: true,
    html: `<p>Kremowa eksplozja ciepłych, słonecznych aromatów! Nasze roślinne curry powstaje na bazie teksturowanego białka słonecznikowego i delikatnego sosu na bazie mleczka kokosowego, który idealnie równoważy curry i kolendrę. Podawane z ryżem — pełnowartościowy, egzotyczny posiłek gotowy w kilka minut. Podróż do azjatyckiego street foodu zamknięta w kubku.</p>
<h3>Wartości odżywcze</h3>
<table>
<thead><tr><th>Wartość odżywcza</th><th>Na kubek (73 g)</th><th>Na 100 g suchej masy</th></tr></thead>
<tbody>
<tr><td>Energia</td><td>285 kcal / 1195 kJ</td><td>391 kcal / 1648 kJ</td></tr>
<tr><td>Tłuszcz</td><td>6,7 g</td><td>9,2 g</td></tr>
<tr><td>w tym kwasy tłuszczowe nasycone</td><td>3,8 g</td><td>5,2 g</td></tr>
<tr><td>Węglowodany</td><td>32,9 g</td><td>45 g</td></tr>
<tr><td>w tym cukry</td><td>6,5 g</td><td>8,9 g</td></tr>
<tr><td>Błonnik</td><td>6,1 g</td><td>8,3 g</td></tr>
<tr><td>Białko</td><td>20,4 g</td><td>28 g</td></tr>
<tr><td>Sól</td><td>2,3 g</td><td>3,1 g</td></tr>
</tbody>
</table>
<h3>Składniki</h3>
<p>Teksturowane białko słonecznikowe 38,4%, ryż podgotowany 27,4%, skrobia ziemniaczana, mleczko kokosowe (mleczko kokosowe, maltodekstryna, kazeinian sodu (zawiera <strong>mleko</strong>)), białko <strong>mleka</strong>, krem w proszku (syrop glukozowy, tłuszcz roślinny, białko <strong>mleka</strong>, stabilizator: E340, substancja przeciwzbrylająca: E551, emulgator: E471), glukoza, sól, cukier trzcinowy, aromaty naturalne, proszek curry, proszek z koncentratu soku z limonki (maltodekstryna), marchew, cebula, zioła, przyprawy i kolendra.</p>
<h3>Alergeny</h3>
<p><strong>Zawiera:</strong> mleko.</p>
<p><strong>Może zawierać śladowe ilości:</strong> pszenicy, soi i jaj.</p>
<h3>Przygotowanie</h3>
<p>Potrząśnij zamkniętym kubkiem. Zdejmij pokrywkę, dodaj zalecaną ilość wrzącej wody — około 180 ml — i dokładnie wymieszaj widelcem. Odczekaj 5 minut, ponownie wymieszaj i smacznego!</p>
<p>Masa netto: 73 g · Termin przydatności do spożycia: 12 miesięcy</p>`,
  },
  "plant-based-smoky-bbq-lentils": {
    approved: true,
    html: `<p>Wędzone BBQ z zieloną soczewicą — teraz zamknięte w ciepłym kubku! Nasze danie powstaje na hojnej bazie teksturowanego białka słonecznikowego i zielonej soczewicy, ze słodyczą wędzonej papryki, karmelizowanej cebuli i pikantną nutą czosnku. Hołd dla BBQ dla wszystkich, którzy kochają pełne smaku posiłki.</p>
<h3>Wartości odżywcze</h3>
<table>
<thead><tr><th>Wartość odżywcza</th><th>Na kubek (65 g)</th><th>Na 100 g suchej masy</th></tr></thead>
<tbody>
<tr><td>Energia</td><td>228 kcal / 954 kJ</td><td>351 kcal / 1468 kJ</td></tr>
<tr><td>Tłuszcz</td><td>2,9 g</td><td>4,5 g</td></tr>
<tr><td>w tym kwasy tłuszczowe nasycone</td><td>0,4 g</td><td>0,6 g</td></tr>
<tr><td>Węglowodany</td><td>25,4 g</td><td>39 g</td></tr>
<tr><td>w tym cukry</td><td>9,1 g</td><td>14 g</td></tr>
<tr><td>Błonnik</td><td>9,1 g</td><td>14 g</td></tr>
<tr><td>Białko</td><td>20,8 g</td><td>32 g</td></tr>
<tr><td>Sól</td><td>2,0 g</td><td>3,1 g</td></tr>
</tbody>
</table>
<h3>Składniki</h3>
<p>Teksturowane białko słonecznikowe 38,5%, podgotowana zielona soczewica 30,8%, proszek pomidorowy, cukier trzcinowy, skrobia ziemniaczana, czerwona papryka, aromaty, sól, cebula, drożdże, marchew, cukier karmelizowany w proszku (cukier karmelizowany, maltodekstryna), zioła i przyprawy, E262 (dioctan sodu), czosnek.</p>
<h3>Alergeny</h3>
<p><strong>Zawiera:</strong> brak (produkt bezalergenowy).</p>
<p><strong>Może zawierać śladowe ilości:</strong> pszenicy, mleka, soi i jaj.</p>
<h3>Przygotowanie</h3>
<p>Potrząśnij zamkniętym kubkiem. Zdejmij pokrywkę, dodaj zalecaną ilość wrzącej wody — około 180 ml — i dokładnie wymieszaj widelcem. Odczekaj 5 minut, ponownie wymieszaj i smacznego!</p>
<p>Masa netto: 65 g · Termin przydatności do spożycia: 12 miesięcy</p>`,
  },
};

export function getApprovedPlCopy(handle: string | undefined): string | null {
  if (!handle) return null;
  const entry = PL_PRODUCT_COPY[canonicalizeHandle(handle)];
  return entry?.approved ? entry.html : null;
}

export function hasApprovedPlCopy(handle: string | undefined): boolean {
  return getApprovedPlCopy(handle) !== null;
}

export function isPolishPageReady(handle: string | undefined): boolean {
  // Bundles (Starter Pack, the four box pages) render from bundle/box data,
  // not PL_PRODUCT_COPY — only the four single flavours need an approved entry.
  if (!handle) return false;
  const h = canonicalizeHandle(handle);
  const needsApproval = ["plant-based-fusilli-bolognese", "plant-based-pasta-carbonara", "plant-based-yellow-curry-rice", "plant-based-smoky-bbq-lentils"].includes(h);
  return needsApproval ? hasApprovedPlCopy(h) : isPolishPilotHandle(h);
}
