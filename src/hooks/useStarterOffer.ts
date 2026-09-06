import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { claimStarterOffer, getStarterOfferCount } from "@/lib/starterOffer.functions";

export const STARTER_OFFER_LIMIT = 500;

export type ClaimState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "issued"; code: string }
  | { status: "sold_out" }
  | { status: "invalid_email" }
  | { status: "error" };

/** Read-only counter of how many of the 500 offer codes are left. */
export function useStarterOfferCount() {
  const fetchCount = useServerFn(getStarterOfferCount);
  const [issued, setIssued] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCount()
      .then((res) => {
        if (!cancelled) setIssued(res.issued);
      })
      .catch(() => {
        if (!cancelled) setIssued(null);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchCount]);

  const remaining = issued === null ? null : Math.max(0, STARTER_OFFER_LIMIT - issued);
  return { issued, remaining, limit: STARTER_OFFER_LIMIT, soldOut: remaining === 0 };
}

export function useStarterOfferClaim() {
  const claim = useServerFn(claimStarterOffer);
  const [state, setState] = useState<ClaimState>({ status: "idle" });

  const submit = useCallback(
    async (email: string): Promise<ClaimState> => {
      setState({ status: "loading" });
      try {
        const res = await claim({ data: { email } });
        let next: ClaimState;
        switch (res.status) {
          case "issued":
            next = { status: "issued", code: res.code };
            break;
          case "sold_out":
            next = { status: "sold_out" };
            break;
          case "invalid_email":
            next = { status: "invalid_email" };
            break;
          default:
            next = { status: "error" };
        }
        setState(next);
        return next;
      } catch (error) {
        console.error("starter offer claim failed", error);
        const next: ClaimState = { status: "error" };
        setState(next);
        return next;
      }
    },
    [claim],
  );

  return { state, submit, reset: () => setState({ status: "idle" }) };
}
