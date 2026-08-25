import { useEffect, useState } from "react";
import { useSearchParams } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type State =
  | { kind: "loading" }
  | { kind: "valid" }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${FN_URL}?token=${encodeURIComponent(token)}`, {
          headers: { apikey: ANON_KEY },
        });
        const data = await res.json();
        if (res.ok && data.valid) setState({ kind: "valid" });
        else if (data.reason === "already_unsubscribed") setState({ kind: "already" });
        else setState({ kind: "invalid" });
      } catch {
        setState({ kind: "invalid" });
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    try {
      const res = await fetch(FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON_KEY },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok && data.success) setState({ kind: "success" });
      else if (data.reason === "already_unsubscribed") setState({ kind: "already" });
      else setState({ kind: "error", message: data.error ?? "Something went wrong" });
    } catch (e: any) {
      setState({ kind: "error", message: e?.message ?? "Network error" });
    }
  };

  return (
    <Layout>
      <SEOHead title="Avprenumerera — PLÄNTLY" description="Avsluta prenumerationen på PLÄNTLY-mail." path="/unsubscribe" />
      <section className="py-20">
        <div className="container max-w-md text-center space-y-6">
          <h1 className="font-heading text-3xl font-bold">Avprenumerera</h1>
          {state.kind === "loading" && <p className="text-muted-foreground">Laddar...</p>}
          {state.kind === "valid" && (
            <>
              <p className="text-muted-foreground">Är du säker på att du vill avsluta prenumerationen från PLÄNTLY-mail?</p>
              <Button onClick={confirm} className="rounded-full" size="lg">Bekräfta avprenumeration</Button>
            </>
          )}
          {state.kind === "submitting" && <p className="text-muted-foreground">Bearbetar...</p>}
          {state.kind === "success" && <p className="text-primary">Du är nu avprenumererad. Du kommer inte längre få mail från oss.</p>}
          {state.kind === "already" && <p className="text-muted-foreground">Den här adressen är redan avprenumererad.</p>}
          {state.kind === "invalid" && <p className="text-destructive">Ogiltig eller utgången länk.</p>}
          {state.kind === "error" && <p className="text-destructive">{state.message}</p>}
        </div>
      </section>
    </Layout>
  );
};

export default Unsubscribe;