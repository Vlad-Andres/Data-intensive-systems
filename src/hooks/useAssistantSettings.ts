"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_MODEL, isAssistantModel, type AssistantModelId } from "@/lib/assistant/claude";
import { apiKeyStatus, subscribeToApiKey, type KeyStatus } from "@/lib/assistant/credentials";
import { createPersistentStore } from "@/lib/store";

const modelStore = createPersistentStore<AssistantModelId>(
  "dis-playground:assistant-model",
  DEFAULT_MODEL,
  (raw) => (isAssistantModel(raw) ? raw : null),
);

export function useAssistantSettings() {
  const keyStatus = useSyncExternalStore<KeyStatus>(subscribeToApiKey, apiKeyStatus, () => "none");
  const model = useSyncExternalStore(modelStore.subscribe, modelStore.getSnapshot, modelStore.getServerSnapshot);

  return { keyStatus, model, setModel: modelStore.set };
}
