import type { Content } from "@google/genai";

export const ASSISTANT_MODEL = "gemini-3.8-flash";
export const ASSISTANT_MODEL_LABEL = "Gemini 3.8 Flash";

export type AssistantErrorKind = "auth" | "rate" | "network" | "aborted" | "blocked" | "other";

export class AssistantError extends Error {
  constructor(
    readonly kind: AssistantErrorKind,
    message: string,
  ) {
    super(message);
  }
}

async function loadSdk() {
  return import("@google/genai");
}

function googleMessage(raw: string) {
  try {
    const body = JSON.parse(raw.slice(raw.indexOf("{")));
    return { message: String(body?.error?.message ?? ""), details: JSON.stringify(body?.error?.details ?? []) };
  } catch {
    return { message: "", details: "" };
  }
}

function toAssistantError(
  sdk: Awaited<ReturnType<typeof loadSdk>>,
  error: unknown,
  signal?: AbortSignal,
): AssistantError {
  if (error instanceof AssistantError) return error;
  if (signal?.aborted || (error instanceof Error && error.name === "AbortError")) {
    return new AssistantError("aborted", "Stopped.");
  }
  if (error instanceof sdk.ApiError) {
    const { message, details } = googleMessage(error.message);
    if (details.includes("API_KEY_INVALID") || /api key not valid/i.test(message)) {
      return new AssistantError("auth", "Google rejected this API key. Reconnect with a valid key.");
    }
    if (error.status === 401 || error.status === 403) {
      return new AssistantError("auth", `This key cannot use ${ASSISTANT_MODEL_LABEL}. ${message}`.trim());
    }
    if (error.status === 429) {
      return new AssistantError(
        "rate",
        "You reached the free-tier limit for now. Wait a minute and try again — the daily allowance resets overnight (Pacific time).",
      );
    }
    if (error.status >= 500) {
      return new AssistantError("other", "Gemini is busy right now. Try again in a moment.");
    }
    return new AssistantError("other", message || `Google returned an error (${error.status}).`);
  }
  if (error instanceof TypeError) {
    return new AssistantError("network", "Could not reach Google's Gemini API. Check your connection.");
  }
  return new AssistantError("other", "Something went wrong while talking to Gemini.");
}

async function createClient(apiKey: string, timeout: number) {
  const sdk = await loadSdk();
  return { sdk, client: new sdk.GoogleGenAI({ apiKey, httpOptions: { timeout } }) };
}

export async function verifyApiKey(apiKey: string) {
  const { sdk, client } = await createClient(apiKey, 20_000);
  try {
    await client.models.get({ model: ASSISTANT_MODEL });
  } catch (error) {
    throw toAssistantError(sdk, error);
  }
}

export interface ReplyRequest {
  apiKey: string;
  system: string;
  contents: Content[];
  signal: AbortSignal;
  onText: (text: string) => void;
}

export interface Reply {
  text: string;
  truncated: boolean;
}

const BLOCKED_REASONS = new Set(["SAFETY", "RECITATION", "BLOCKLIST", "PROHIBITED_CONTENT", "SPII"]);

export async function streamReply(request: ReplyRequest): Promise<Reply> {
  const { sdk, client } = await createClient(request.apiKey, 60_000);
  let text = "";
  let finishReason: string | undefined;

  try {
    const stream = await client.models.generateContentStream({
      model: ASSISTANT_MODEL,
      contents: request.contents,
      config: {
        systemInstruction: request.system,
        thinkingConfig: { thinkingLevel: sdk.ThinkingLevel.LOW },
        maxOutputTokens: 16000,
        abortSignal: request.signal,
      },
    });

    for await (const chunk of stream) {
      if (chunk.promptFeedback?.blockReason) finishReason = "BLOCKLIST";
      finishReason = chunk.candidates?.[0]?.finishReason ?? finishReason;
      if (chunk.text) {
        text += chunk.text;
        request.onText(text);
      }
    }
  } catch (error) {
    throw toAssistantError(sdk, error, request.signal);
  }

  if (!text && finishReason && BLOCKED_REASONS.has(finishReason)) {
    throw new AssistantError("blocked", "Gemini declined to answer this one. Try rephrasing the question.");
  }
  return { text, truncated: finishReason === "MAX_TOKENS" };
}
