"""Single source of truth for AI target models."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

ModelCategory = Literal["general", "code", "image"]


@dataclass(frozen=True)
class SovereigntyMeta:
    score: int
    location: str
    company: str
    license: str
    cloud_act_risk: bool
    rgpd_compliant: bool


@dataclass(frozen=True)
class GreenMeta:
    energy_per_1k_tokens_kwh: float
    carbon_intensity_gco2_kwh: float
    water_intensity_ml_kwh: float
    datacenter_location: str
    tz_offset: int


@dataclass(frozen=True)
class ModelDefinition:
    id: str
    name: str
    provider: str
    category: ModelCategory
    description: str
    color: str
    sovereignty: SovereigntyMeta
    green: GreenMeta
    system_prompt: str
    hub_model: str | None = None
    legacy_ids: tuple[str, ...] = ()


def _json_response_instruction() -> str:
    return (
        'Respond ONLY with valid JSON — no markdown wrapper:\n'
        '{"reasoning": "One or two sentences: what you changed and why.", '
        '"optimized_prompt": "The full rewritten prompt."}'
    )


MODELS: tuple[ModelDefinition, ...] = (
    ModelDefinition(
        id="mistral_large_3",
        name="Mistral Large 3",
        provider="Mistral AI",
        category="general",
        description="France • Open Source • Souverain",
        color="#ff7e00",
        sovereignty=SovereigntyMeta(
            score=100,
            location="France (UE)",
            company="Mistral AI (Francaise)",
            license="Open Weights / Apache",
            cloud_act_risk=False,
            rgpd_compliant=True,
        ),
        green=GreenMeta(
            energy_per_1k_tokens_kwh=0.002,
            carbon_intensity_gco2_kwh=50,
            water_intensity_ml_kwh=500,
            datacenter_location="France",
            tz_offset=1,
        ),
        hub_model="mistral-large-latest",
        legacy_ids=("mistral_2",),
        system_prompt=f"""
You are a senior Prompt Engineer specializing in Mistral Large 3. Transform raw user intent into a production-ready, token-efficient prompt optimized for Mistral.

MISTRAL LARGE 3 BEST PRACTICES:
- Open with a sharp, domain-specific persona
- Use simple Markdown: ### headers and - bullet points
- Be explicit about output format (JSON / Markdown / list / prose)
- Add concrete constraints (length, language, tone, forbidden items)
- Remove filler words, politeness phrases, and redundancy
- Prefer active voice and imperative mood
- Quantify constraints explicitly (max N words, N bullet points)

{_json_response_instruction()}
""",
    ),
    ModelDefinition(
        id="codestral_2",
        name="Codestral 2",
        provider="Mistral AI",
        category="code",
        description="France • Code • Refactor",
        color="#ff9500",
        sovereignty=SovereigntyMeta(
            score=100,
            location="France (UE)",
            company="Mistral AI (Francaise)",
            license="Open Weights / Apache",
            cloud_act_risk=False,
            rgpd_compliant=True,
        ),
        green=GreenMeta(
            energy_per_1k_tokens_kwh=0.002,
            carbon_intensity_gco2_kwh=50,
            water_intensity_ml_kwh=500,
            datacenter_location="France",
            tz_offset=1,
        ),
        hub_model="codestral-latest",
        system_prompt=f"""
You are a senior Prompt Engineer specializing in Codestral 2 for software development tasks. Transform raw user intent into a precise coding prompt.

CODESTRAL 2 BEST PRACTICES:
- Specify target files, functions, or modules when inferable
- Include stack hints (language, framework, test runner, linter)
- Request minimal diffs or full file output explicitly
- Add constraints: no breaking changes, preserve types, follow existing patterns
- Include acceptance criteria and edge cases to handle
- Prefer structured sections: ## Context, ## Task, ## Constraints, ## Output Format
- Remove vague language; use imperative verbs

{_json_response_instruction()}
""",
    ),
    ModelDefinition(
        id="claude_sonnet_5",
        name="Claude Sonnet 5",
        provider="Anthropic",
        category="general",
        description="USA • Anthropic • Raisonnement",
        color="#cc785c",
        sovereignty=SovereigntyMeta(
            score=0,
            location="USA (Oregon)",
            company="Anthropic (USA)",
            license="Proprietaire",
            cloud_act_risk=True,
            rgpd_compliant=False,
        ),
        green=GreenMeta(
            energy_per_1k_tokens_kwh=0.007,
            carbon_intensity_gco2_kwh=380,
            water_intensity_ml_kwh=1800,
            datacenter_location="USA",
            tz_offset=-8,
        ),
        hub_model="claude-sonnet-4-20250514",
        legacy_ids=("claude_sonnet_4",),
        system_prompt=f"""
You are a senior Prompt Engineer specializing in Claude Sonnet 5. Transform raw user intent into a prompt leveraging Claude's strengths.

CLAUDE SONNET 5 BEST PRACTICES:
- Use XML tags systematically: <role>, <context>, <task>, <constraints>, <output_format>
- Add <thinking> for analytical or multi-step tasks
- Use <example> for non-trivial output formats
- Avoid mixing Markdown headers inside XML
- Remove filler words and politeness phrases
- Be precise and verbose in constraints

{_json_response_instruction()}
""",
    ),
    ModelDefinition(
        id="claude_opus_4_8",
        name="Claude Opus 4.8",
        provider="Anthropic",
        category="general",
        description="USA • Anthropic • Complexe",
        color="#b86a50",
        sovereignty=SovereigntyMeta(
            score=0,
            location="USA (Oregon)",
            company="Anthropic (USA)",
            license="Proprietaire",
            cloud_act_risk=True,
            rgpd_compliant=False,
        ),
        green=GreenMeta(
            energy_per_1k_tokens_kwh=0.009,
            carbon_intensity_gco2_kwh=380,
            water_intensity_ml_kwh=1800,
            datacenter_location="USA",
            tz_offset=-8,
        ),
        hub_model="claude-opus-4-20250514",
        legacy_ids=("claude_opus", "claude_opus_4"),
        system_prompt=f"""
You are a senior Prompt Engineer specializing in Claude Opus 4.8 for complex, high-stakes tasks. Transform raw user intent into a comprehensive prompt.

CLAUDE OPUS 4.8 BEST PRACTICES:
- Use XML structure: <role>, <context>, <task>, <constraints>, <output_format>, <quality_bar>
- Decompose multi-step work into numbered phases
- Add explicit success criteria and failure modes to avoid
- Include domain vocabulary and stakeholder perspective
- Remove ambiguity; specify trade-offs when relevant

{_json_response_instruction()}
""",
    ),
    ModelDefinition(
        id="gpt_5_6",
        name="GPT-5.6",
        provider="OpenAI",
        category="general",
        description="USA • OpenAI • Structure",
        color="#74aa9c",
        sovereignty=SovereigntyMeta(
            score=0,
            location="USA (Virginia)",
            company="OpenAI (USA)",
            license="Proprietaire",
            cloud_act_risk=True,
            rgpd_compliant=False,
        ),
        green=GreenMeta(
            energy_per_1k_tokens_kwh=0.008,
            carbon_intensity_gco2_kwh=380,
            water_intensity_ml_kwh=1800,
            datacenter_location="USA",
            tz_offset=-5,
        ),
        hub_model="gpt-4.1",
        legacy_ids=("gpt_5", "gpt_4_1"),
        system_prompt=f"""
You are a senior Prompt Engineer specializing in GPT-5.6. Transform raw user intent into a production-ready prompt.

GPT-5.6 BEST PRACTICES:
- Open with a sharp, domain-specific Persona
- Separate sections with Markdown headers: ## Role, ## Context, ## Task, ## Constraints, ## Output Format
- Be explicit about output format — never leave it ambiguous
- Add concrete constraints to prevent off-topic answers
- If no context provided, invent a plausible professional scenario
- Remove filler words and redundancy; prefer active voice

{_json_response_instruction()}
""",
    ),
    ModelDefinition(
        id="o4_mini",
        name="o4-mini",
        provider="OpenAI",
        category="code",
        description="USA • OpenAI • Code rapide",
        color="#5a9a8c",
        sovereignty=SovereigntyMeta(
            score=0,
            location="USA (Virginia)",
            company="OpenAI (USA)",
            license="Proprietaire",
            cloud_act_risk=True,
            rgpd_compliant=False,
        ),
        green=GreenMeta(
            energy_per_1k_tokens_kwh=0.004,
            carbon_intensity_gco2_kwh=380,
            water_intensity_ml_kwh=1800,
            datacenter_location="USA",
            tz_offset=-5,
        ),
        hub_model="o4-mini",
        system_prompt=f"""
You are a senior Prompt Engineer specializing in o4-mini for fast coding and reasoning tasks. Transform raw user intent into a concise, high-signal coding prompt.

O4-MINI BEST PRACTICES:
- Lead with the exact coding task in one sentence
- Specify language, framework, and file scope
- Request step-by-step reasoning only when complexity requires it
- Include test expectations and error handling requirements
- Prefer bullet constraints over long prose
- Output format: diff, snippet, or full file — always explicit

{_json_response_instruction()}
""",
    ),
    ModelDefinition(
        id="gemini_2_5_pro",
        name="Gemini 2.5 Pro",
        provider="Google",
        category="general",
        description="USA • Google • Step-by-step",
        color="#4285f4",
        sovereignty=SovereigntyMeta(
            score=0,
            location="USA (Iowa)",
            company="Google (USA)",
            license="Proprietaire",
            cloud_act_risk=True,
            rgpd_compliant=False,
        ),
        green=GreenMeta(
            energy_per_1k_tokens_kwh=0.006,
            carbon_intensity_gco2_kwh=380,
            water_intensity_ml_kwh=1800,
            datacenter_location="USA",
            tz_offset=-6,
        ),
        hub_model="gemini-2.5-pro",
        legacy_ids=("gemini_3_pro",),
        system_prompt=f"""
You are a senior Prompt Engineer specializing in Google Gemini 2.5 Pro. Transform raw user intent into a clear, step-by-step prompt.

GEMINI 2.5 PRO BEST PRACTICES:
- Open with a clear Task statement, then numbered sub-steps
- Be didactic: spell out what each step should produce
- Add "Think step by step before answering" for complex reasoning
- Specify exact output structure (numbered list, table, JSON, prose)
- Ask for sources or examples when factual or comparative
- Remove filler words and politeness phrases

{_json_response_instruction()}
""",
    ),
    ModelDefinition(
        id="flux_1_1",
        name="Flux 1.1",
        provider="Black Forest Labs",
        category="image",
        description="EU • Image Gen • Photoreal",
        color="#9c5cd4",
        sovereignty=SovereigntyMeta(
            score=60,
            location="Allemagne (UE)",
            company="Black Forest Labs (EU)",
            license="Proprietaire",
            cloud_act_risk=False,
            rgpd_compliant=True,
        ),
        green=GreenMeta(
            energy_per_1k_tokens_kwh=0.04,
            carbon_intensity_gco2_kwh=120,
            water_intensity_ml_kwh=800,
            datacenter_location="EU",
            tz_offset=1,
        ),
        hub_model=None,
        legacy_ids=("midjourney_v6",),
        system_prompt=f"""
You are an expert AI image prompt engineer specializing in Flux 1.1. Translate the user's visual idea into a dense, production-ready image prompt.

FLUX 1.1 BEST PRACTICES:
- Write in English always. Comma-separated descriptive keywords — concise phrases.
- Structure: [main subject], [environment], [lighting], [mood], [art style], [camera/lens], [technical quality]
- Lighting: golden hour, dramatic side lighting, soft diffused, neon glow, chiaroscuro
- Style: photorealistic, cinematic, editorial, concept art, watercolor, 8K render
- Include negative cues inline: "no blurry, no watermark, no deformed hands"
- Specify aspect ratio intent: portrait 9:16, landscape 16:9, square 1:1

{_json_response_instruction()}
""",
    ),
)

_BY_ID: dict[str, ModelDefinition] = {m.id: m for m in MODELS}
_ALIAS_MAP: dict[str, str] = {}
for _model in MODELS:
    for _legacy in _model.legacy_ids:
        _ALIAS_MAP[_legacy] = _model.id

DEFAULT_MODEL_ID = "mistral_large_3"


def resolve_model_id(model_id: str) -> str:
    """Resolve legacy aliases to canonical model id."""
    normalized = model_id.strip().lower()
    if normalized in _BY_ID:
        return normalized
    if normalized in _ALIAS_MAP:
        return _ALIAS_MAP[normalized]
    raise ValueError(f"Unknown model: {model_id}")


def get_model(model_id: str) -> ModelDefinition:
    return _BY_ID[resolve_model_id(model_id)]


def get_model_or_legacy_meta(model_id: str) -> ModelDefinition:
    """Return model definition, resolving legacy ids for impact calculations."""
    return get_model(model_id)


def list_models() -> list[ModelDefinition]:
    return list(MODELS)


def is_valid_model(model_id: str) -> bool:
    try:
        resolve_model_id(model_id)
        return True
    except ValueError:
        return False
