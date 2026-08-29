import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  LOVABLE_AIG_RUN_ID_HEADER,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";
import { buildAssistantInstructions, buildProductCatalog } from "@/lib/aiCatalog.server";

const ChatRequest = z.object({
  messages: z.array(z.unknown()).max(40).default([]),
  lang: z.enum(["sv", "en"]).optional().default("sv"),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const parsed = ChatRequest.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Invalid request body" }, { status: 400 });
        }
        const { messages, lang } = parsed.data;

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return Response.json({ error: "AI is not configured" }, { status: 500 });
        }

        const [catalog, modelMessages] = await Promise.all([
          buildProductCatalog(),
          convertToModelMessages(messages as UIMessage[]),
        ]);

        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(apiKey, initialRunId);
        const model = gateway("google/gemini-3.7-flash");

        const result = streamText({
          model,
          instructions: buildAssistantInstructions(catalog, lang),
          messages: modelMessages,
        });

        const response = createUIMessageStreamResponse({
          stream: toUIMessageStream({ stream: result.stream }),
          headers: getLovableAiGatewayResponseHeaders(undefined, {
            ...(initialRunId ? { [LOVABLE_AIG_RUN_ID_HEADER]: initialRunId } : {}),
          }),
        });

        return withLovableAiGatewayRunIdHeader(response, gateway);
      },
    },
  },
});