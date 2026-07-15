const LEGACY_MODEL_ALIASES: Record<string, string> = {
  mistral_2: "mistral_large_3",
  claude_sonnet_4: "claude_sonnet_5",
  claude_opus: "claude_opus_4_8",
  claude_opus_4: "claude_opus_4_8",
  gpt_5: "gpt_5_6",
  gpt_4_1: "gpt_5_6",
  gemini_3_pro: "gemini_2_5_pro",
  midjourney_v6: "flux_1_1",
};

const FALLBACK_COLORS = ["#39ff14", "#a0ff00", "#ffdd00", "#ff7e00", "#ff1744", "#00ff87", "#4285f4", "#9c5cd4"];

export function resolveModelId(modelId: string): string {
  const normalized = modelId.trim().toLowerCase();
  return LEGACY_MODEL_ALIASES[normalized] ?? normalized;
}

export function getFallbackModelColor(index: number): string {
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}
