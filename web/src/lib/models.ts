const LEGACY_MODEL_ALIASES: Record<string, string> = {
  mistral_2: "composer_2_5",
  mistral_large_3: "composer_2_5",
  codestral_2: "composer_2_5",
  o4_mini: "composer_2_5",
  claude_sonnet_4: "claude_sonnet_5",
  claude_opus: "claude_opus_4_8",
  claude_opus_4: "claude_opus_4_8",
  gpt_5: "gpt_5_6_sol",
  gpt_4_1: "gpt_5_6_sol",
  gpt_5_6: "gpt_5_6_sol",
  gemini_3_pro: "fable_5",
  gemini_2_5_pro: "fable_5",
  midjourney_v6: "fable_5",
  flux_1_1: "fable_5",
};

const FALLBACK_COLORS = ["#39ff14", "#b86a50", "#74aa9c", "#d4a574", "#cc785c", "#5a9a8c"];

export function resolveModelId(modelId: string): string {
  const normalized = modelId.trim().toLowerCase();
  return LEGACY_MODEL_ALIASES[normalized] ?? normalized;
}

export function getFallbackModelColor(index: number): string {
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}
