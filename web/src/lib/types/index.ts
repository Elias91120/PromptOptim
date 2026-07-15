export type ModelCategory = "general" | "code" | "image";

export interface SovereigntyInfo {
  score: number;
  location: string;
  company: string;
  license: string;
  cloud_act_risk: boolean;
  rgpd_compliant: boolean;
}

export interface GreenInfo {
  energy_per_1k_tokens_kwh: number;
  carbon_intensity_gco2_kwh: number;
  water_intensity_ml_kwh: number;
  datacenter_location: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  category: ModelCategory;
  description: string;
  color: string;
  sovereignty: SovereigntyInfo;
  green: GreenInfo;
}

export interface Equivalences {
  smartphone_charges: number;
  km_electric_car: number;
  hours_led_bulb: number;
}

export interface GreenData {
  tokens_saved: number;
  energy_saved_kwh: number;
  co2_saved_g: number;
  water_saved_ml: number;
  eco_score: "A" | "B" | "C" | "D" | "E";
  equivalences: Equivalences;
  methodology_source: string;
  timestamp_factor: number;
}

export interface SovereigntyData {
  score: number;
  location: string;
  company: string;
  license: string;
  cloud_act_risk: boolean;
}

export interface PromptResponse {
  original_intent: string;
  optimized_prompt: string;
  target_model: string;
  green_data?: GreenData;
  sovereignty_data?: SovereigntyData;
  ai_reasoning?: string | null;
}

export interface PromptHistoryItem extends PromptResponse {
  id: number;
  created_at: string;
}

export interface UserStats {
  total_prompts: number;
  total_tokens_saved: number;
  total_co2_saved: number;
  model_usage: Record<string, number>;
}

export interface AuthUser {
  email?: string;
  id?: string;
  authenticated: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user?: { email: string; id: string };
}
