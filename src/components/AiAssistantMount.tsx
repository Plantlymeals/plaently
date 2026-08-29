import { lazy, Suspense } from "react";
import { AI_ASSISTANT_ENABLED } from "@/lib/aiAssistantFlag";

// Code-split mount point: while the flag is off, the AI widget (and the
// @ai-sdk/ai bundle it pulls in) is never downloaded at all.
const AiAssistant = lazy(() => import("@/components/AiAssistant"));

export default function AiAssistantMount() {
  if (!AI_ASSISTANT_ENABLED) return null;
  return (
    <Suspense fallback={null}>
      <AiAssistant />
    </Suspense>
  );
}
