"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type Anthropic from "@anthropic-ai/sdk";
import {
  AssistantError,
  streamReply,
  type AssistantErrorKind,
  type AssistantModelId,
} from "@/lib/assistant/claude";
import { readApiKey } from "@/lib/assistant/credentials";
import { buildSystem, formatQuestion, type AssistantSelection } from "@/lib/assistant/prompt";

export type TurnStatus = "thinking" | "streaming" | "done" | "truncated" | "stopped" | "error";

export interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  text: string;
  selection?: AssistantSelection;
  status?: TurnStatus;
  error?: string;
  errorKind?: AssistantErrorKind;
}

const conversations = new Map<string, ChatTurn[]>();

function toMessages(turns: ChatTurn[]): Anthropic.Beta.BetaMessageParam[] {
  return turns.flatMap<Anthropic.Beta.BetaMessageParam>((turn) => {
    if (turn.role === "user") {
      return [{ role: "user", content: formatQuestion(turn.text, turn.selection) }];
    }
    const text = turn.text.trim();
    return text && turn.status !== "error" ? [{ role: "assistant", content: text }] : [];
  });
}

export function useAssistantChat(slug: string, lectureContext: string, model: AssistantModelId) {
  const [turns, setTurns] = useState<ChatTurn[]>(() => conversations.get(slug) ?? []);
  const controller = useRef<AbortController | null>(null);
  const system = useMemo(() => buildSystem(lectureContext), [lectureContext]);

  useEffect(() => {
    conversations.set(slug, turns);
  }, [slug, turns]);

  useEffect(() => {
    const active = controller;
    return () => active.current?.abort();
  }, []);

  const busy = turns.some((turn) => turn.status === "thinking" || turn.status === "streaming");

  const updateTurn = useCallback((id: string, patch: Partial<ChatTurn>) => {
    setTurns((previous) => previous.map((turn) => (turn.id === id ? { ...turn, ...patch } : turn)));
  }, []);

  const send = useCallback(
    async (question: string, selection?: AssistantSelection) => {
      const apiKey = readApiKey();
      if (!apiKey || busy) return;

      const userTurn: ChatTurn = { id: crypto.randomUUID(), role: "user", text: question, selection };
      const assistantTurn: ChatTurn = { id: crypto.randomUUID(), role: "assistant", text: "", status: "thinking" };
      const history = [...turns, userTurn];
      setTurns([...history, assistantTurn]);

      const request = new AbortController();
      controller.current = request;

      try {
        const reply = await streamReply({
          apiKey,
          model,
          system,
          messages: toMessages(history),
          signal: request.signal,
          onThinking: () => updateTurn(assistantTurn.id, { status: "thinking" }),
          onText: (text) => updateTurn(assistantTurn.id, { text, status: "streaming" }),
        });
        updateTurn(assistantTurn.id, { text: reply.text, status: reply.truncated ? "truncated" : "done" });
      } catch (error) {
        const failure =
          error instanceof AssistantError ? error : new AssistantError("other", "Something went wrong.");
        updateTurn(
          assistantTurn.id,
          failure.kind === "aborted"
            ? { status: "stopped" }
            : { status: "error", error: failure.message, errorKind: failure.kind },
        );
      } finally {
        if (controller.current === request) controller.current = null;
      }
    },
    [busy, turns, model, system, updateTurn],
  );

  const stop = useCallback(() => controller.current?.abort(), []);

  const reset = useCallback(() => {
    controller.current?.abort();
    setTurns([]);
  }, []);

  return { turns, busy, send, stop, reset };
}
