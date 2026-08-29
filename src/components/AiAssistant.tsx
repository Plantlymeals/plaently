import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, RotateCcw, Send, Sparkles, Square, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function AiAssistant() {
  const { lang, t } = useTranslation();
  const langRef = useRef(lang);
  langRef.current = lang;

  const { messages, sendMessage, status, error, regenerate, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({ lang: langRef.current }),
    }),
  });

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const busy = status === "submitted" || status === "streaming";
  const failed = status === "error";

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    sendMessage({ text: value });
    setInput("");
  };

  const suggestions = [t("ai.suggestion1"), t("ai.suggestion2"), t("ai.suggestion3")];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("ai.close") : t("ai.open")}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-green-600/30 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
      >
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-[90] flex w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">{t("ai.title")}</p>
                <p className="text-[11px] leading-tight text-white/80">{t("ai.subtitle")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("ai.close")}
              className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            className="flex max-h-[22rem] min-h-[16rem] flex-col gap-3 overflow-y-auto bg-muted/40 p-4"
          >
            {messages.length === 0 ? (
              <div className="mt-2 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground">
                {t("ai.greeting")}
              </div>
            ) : (
              messages.map((m) =>
                m.role === "user" ? (
                  <div
                    key={m.id}
                    className="self-end max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                  >
                    {m.parts
                      .filter((p) => p.type === "text")
                      .map((p, i) => (
                        <p key={i} className="whitespace-pre-wrap break-words">
                          {p.text}
                        </p>
                      ))}
                  </div>
                ) : (
                  <div
                    key={m.id}
                    className="self-start max-w-[92%] rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-2.5 text-sm leading-relaxed text-foreground"
                  >
                    {m.parts
                      .filter((p) => p.type === "text")
                      .map((p, i) => (
                        <p key={i} className="whitespace-pre-wrap break-words">
                          {p.text}
                        </p>
                      ))}
                  </div>
                ),
              )
            )}

            {status === "submitted" && (
              <div className="self-start flex items-center gap-2 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t("ai.thinking")}
              </div>
            )}

            {failed && (
              <div className="self-start rounded-2xl rounded-tl-sm border border-destructive/40 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
                <p>{t("ai.error")}</p>
                <button
                  type="button"
                  onClick={() => regenerate()}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
                >
                  <RotateCcw className="h-3 w-3" />
                  {t("ai.retry")}
                </button>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length === 0 && !busy && (
            <div className="flex flex-wrap gap-2 border-t border-border bg-card px-4 pt-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={busy}
              placeholder={t("ai.placeholder")}
              aria-label={t("ai.placeholder")}
              className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
            />
            {busy ? (
              <button
                type="button"
                onClick={() => stop()}
                aria-label={t("ai.stop")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label={t("ai.send")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </form>

          <p className="border-t border-border bg-card px-4 py-1.5 text-center text-[10px] text-muted-foreground">
            {t("ai.poweredBy")}
          </p>
        </div>
      )}
    </>
  );
}