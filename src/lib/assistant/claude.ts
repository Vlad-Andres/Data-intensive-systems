import type Anthropic from "@anthropic-ai/sdk";

export const ASSISTANT_MODELS = [
  { id: "claude-opus-5", label: "Claude Opus 5", detail: "Most capable — the default", effort: true, fallbacks: true },
  { id: "claude-sonnet-5", label: "Claude Sonnet 5", detail: "Faster, about 40% of the cost", effort: true, fallbacks: false },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", detail: "Fastest, about 20% of the cost", effort: false, fallbacks: false },
] as const;

export type AssistantModelId = (typeof ASSISTANT_MODELS)[number]["id"];

export const DEFAULT_MODEL: AssistantModelId = "claude-opus-5";

export function isAssistantModel(value: unknown): value is AssistantModelId {
  return ASSISTANT_MODELS.some((model) => model.id === value);
}

export type AssistantErrorKind = "auth" | "rate" | "network" | "aborted" | "refusal" | "other";

export class AssistantError extends Error {
  constructor(
    readonly kind: AssistantErrorKind,
    message: string,
  ) {
    super(message);
  }
}

async function loadSdk() {
  return (await import("@anthropic-ai/sdk")).default;
}

function toAssistantError(sdk: typeof Anthropic, error: unknown): AssistantError {
  if (error instanceof AssistantError) return error;
  if (error instanceof sdk.APIUserAbortError) return new AssistantError("aborted", "Stopped.");
  if (error instanceof sdk.AuthenticationError) {
    return new AssistantError("auth", "Anthropic rejected this API key. Reconnect with a valid key.");
  }
  if (error instanceof sdk.PermissionDeniedError) {
    return new AssistantError("auth", "This API key is not allowed to use the selected model.");
  }
  if (error instanceof sdk.RateLimitError) {
    return new AssistantError("rate", "Rate limit reached for this key. Wait a moment and try again.");
  }
  if (error instanceof sdk.APIConnectionError) {
    return new AssistantError("network", "Could not reach api.anthropic.com. Check your connection.");
  }
  if (error instanceof sdk.APIError) {
    return new AssistantError("other", `Anthropic returned an error (${error.status ?? "unknown"}). Try again.`);
  }
  return new AssistantError("other", "Something went wrong while talking to Claude.");
}

async function createClient(apiKey: string, timeout: number) {
  const sdk = await loadSdk();
  return { sdk, client: new sdk({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 2, timeout }) };
}

export async function verifyApiKey(apiKey: string) {
  const { sdk, client } = await createClient(apiKey, 20_000);
  try {
    await client.models.retrieve(DEFAULT_MODEL);
  } catch (error) {
    throw toAssistantError(sdk, error);
  }
}

export interface ReplyRequest {
  apiKey: string;
  model: AssistantModelId;
  system: Anthropic.Beta.BetaTextBlockParam[];
  messages: Anthropic.Beta.BetaMessageParam[];
  signal: AbortSignal;
  onThinking: () => void;
  onText: (text: string) => void;
}

export interface Reply {
  text: string;
  truncated: boolean;
}

export async function streamReply(request: ReplyRequest): Promise<Reply> {
  const { sdk, client } = await createClient(request.apiKey, 60_000);
  const profile = ASSISTANT_MODELS.find((model) => model.id === request.model) ?? ASSISTANT_MODELS[0];
  let text = "";

  try {
    const stream = client.beta.messages.stream(
      {
        model: request.model,
        max_tokens: 16000,
        system: request.system,
        messages: request.messages,
        ...(profile.effort ? { output_config: { effort: "medium" as const } } : {}),
        ...(profile.fallbacks
          ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
          : {}),
      },
      { signal: request.signal },
    );

    stream.on("streamEvent", (event) => {
      if (event.type !== "content_block_start") return;
      if (event.content_block.type === "thinking") request.onThinking();
      if (event.content_block.type === "fallback") {
        text = "";
        request.onThinking();
      }
    });
    stream.on("text", (delta) => {
      text += delta;
      request.onText(text);
    });

    const message = await stream.finalMessage();
    if (message.stop_reason === "refusal") {
      throw new AssistantError("refusal", "Claude declined to answer this one. Try rephrasing the question.");
    }

    const lastFallback = message.content.findLastIndex((block) => block.type === "fallback");
    const finalText = message.content
      .slice(lastFallback + 1)
      .flatMap((block) => (block.type === "text" ? [block.text] : []))
      .join("");

    return { text: finalText || text, truncated: message.stop_reason === "max_tokens" };
  } catch (error) {
    throw toAssistantError(sdk, error);
  }
}
