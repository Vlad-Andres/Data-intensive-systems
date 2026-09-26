import type Anthropic from "@anthropic-ai/sdk";

export const ASSISTANT_MODEL = "claude-sonnet-5";
export const ASSISTANT_MODEL_LABEL = "Claude Sonnet 5";

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
    return new AssistantError("auth", "This API key is not allowed to use Claude Sonnet 5.");
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
    await client.models.retrieve(ASSISTANT_MODEL);
  } catch (error) {
    throw toAssistantError(sdk, error);
  }
}

export interface ReplyRequest {
  apiKey: string;
  system: Anthropic.TextBlockParam[];
  messages: Anthropic.MessageParam[];
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
  let text = "";

  try {
    const stream = client.messages.stream(
      {
        model: ASSISTANT_MODEL,
        max_tokens: 16000,
        output_config: { effort: "low" },
        system: request.system,
        messages: request.messages,
      },
      { signal: request.signal },
    );

    stream.on("streamEvent", (event) => {
      if (event.type === "content_block_start" && event.content_block.type === "thinking") {
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

    return { text, truncated: message.stop_reason === "max_tokens" };
  } catch (error) {
    throw toAssistantError(sdk, error);
  }
}
