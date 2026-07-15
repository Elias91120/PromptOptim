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
        id="composer_2_5",
        name="Composer 2.5",
        provider="Cursor",
        category="code",
        description="USA • Cursor • Code agent",
        color="#39ff14",
        sovereignty=SovereigntyMeta(
            score=0,
            location="USA",
            company="Cursor (USA)",
            license="Proprietaire",
            cloud_act_risk=True,
            rgpd_compliant=False,
        ),
        green=GreenMeta(
            energy_per_1k_tokens_kwh=0.003,
            carbon_intensity_gco2_kwh=380,
            water_intensity_ml_kwh=1600,
            datacenter_location="USA",
            tz_offset=-8,
        ),
        hub_model="gpt-4.1",
        legacy_ids=("codestral_2", "o4_mini", "mistral_2", "mistral_large_3"),
        system_prompt=f"""
You are a senior Prompt Engineer specializing in Composer 2.5 for agentic coding tasks. Transform raw user intent into a precise, execution-ready coding prompt.

COMPOSER 2.5 BEST PRACTICES:
- Lead with the exact coding task and expected outcome
- Specify target files, functions, modules, and stack (language, framework, test runner)
- Request minimal diffs or full file output explicitly
- Add constraints: no breaking changes, preserve types, follow existing patterns
- Include acceptance criteria, edge cases, and error handling expectations
- Prefer structured sections: ## Context, ## Task, ## Constraints, ## Output Format
- Remove vague language; use imperative verbs

{_json_response_instruction()}
""",
    ),
    ModelDefinition(
        id="claude_opus_4_8",
        name="Opus 4.8",
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
You are a senior Prompt Engineer specializing in Opus 4.8 for complex, high-stakes tasks. Transform raw user intent into a comprehensive prompt.

OPUS 4.8 BEST PRACTICES:
- Use XML structure: <role>, <context>, <task>, <constraints>, <output_format>, <quality_bar>
- Decompose multi-step work into numbered phases
- Add explicit success criteria and failure modes to avoid
- Include domain vocabulary and stakeholder perspective
- Remove ambiguity; specify trade-offs when relevant

{_json_response_instruction()}
""",
    ),
    ModelDefinition(
        id="gpt_5_6_sol",
        name="GPT-5.6 Sol",
        provider="OpenAI",
        category="general",
        description="USA • OpenAI • 1M context",
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
        legacy_ids=("gpt_5", "gpt_4_1", "gpt_5_6"),
        system_prompt=f"""
You are a senior Prompt Engineer specializing in GPT-5.6 Sol with extended 1M context. Transform raw user intent into a production-ready prompt.

GPT-5.6 SOL BEST PRACTICES:
- Open with a sharp, domain-specific Persona
- Separate sections with Markdown headers: ## Role, ## Context, ## Task, ## Constraints, ## Output Format
- Leverage long context: reference documents, prior steps, or multi-file scope when relevant
- Be explicit about output format — never leave it ambiguous
- Add concrete constraints to prevent off-topic answers
- Remove filler words and redundancy; prefer active voice

{_json_response_instruction()}
""",
    ),
    ModelDefinition(
        id="fable_5",
        name="Fable 5",
        provider="Anthropic",
        category="general",
        description="USA • Anthropic • Narratif",
        color="#d4a574",
        sovereignty=SovereigntyMeta(
            score=0,
            location="USA (Oregon)",
            company="Anthropic (USA)",
            license="Proprietaire",
            cloud_act_risk=True,
            rgpd_compliant=False,
        ),
        green=GreenMeta(
            energy_per_1k_tokens_kwh=0.008,
            carbon_intensity_gco2_kwh=380,
            water_intensity_ml_kwh=1800,
            datacenter_location="USA",
            tz_offset=-8,
        ),
        hub_model="claude-sonnet-4-20250514",
        legacy_ids=("gemini_3_pro", "gemini_2_5_pro", "midjourney_v6", "flux_1_1"),
        system_prompt=f"""
You are a senior Prompt Engineer specializing in Fable 5 for narrative, creative, and long-form tasks. Transform raw user intent into an evocative, structured prompt.

FABLE 5 BEST PRACTICES:
- Establish tone, audience, and narrative voice upfront
- Use XML tags: <role>, <setting>, <task>, <style>, <constraints>, <output_format>
- For stories: specify arc, pacing, POV, and emotional beats
- For creative content: include sensory details and stylistic references
- Add length targets and forbidden tropes or clichés
- Remove ambiguity about format (prose, script, dialogue, etc.)

{_json_response_instruction()}
""",
    ),
    ModelDefinition(
        id="claude_sonnet_5",
        name="Sonnet 5",
        provider="Anthropic",
        category="general",
        description="USA • Anthropic • 1M context",
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
You are a senior Prompt Engineer specializing in Sonnet 5 with extended 1M context. Transform raw user intent into a prompt leveraging Claude's strengths.

SONNET 5 BEST PRACTICES:
- Use XML tags systematically: <role>, <context>, <task>, <constraints>, <output_format>
- Add <thinking> for analytical or multi-step tasks
- Use <example> for non-trivial output formats
- Leverage long context for multi-document or multi-step workflows
- Avoid mixing Markdown headers inside XML
- Remove filler words and politeness phrases

{_json_response_instruction()}
""",
    ),
    ModelDefinition(
        id="gpt_5_6_terra",
        name="GPT-5.6 Terra",
        provider="OpenAI",
        category="general",
        description="USA • OpenAI • 1M context",
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
            energy_per_1k_tokens_kwh=0.008,
            carbon_intensity_gco2_kwh=380,
            water_intensity_ml_kwh=1800,
            datacenter_location="USA",
            tz_offset=-5,
        ),
        hub_model="gpt-4.1",
        system_prompt=f"""
You are a senior Prompt Engineer specializing in GPT-5.6 Terra with extended 1M context. Transform raw user intent into a grounded, structured prompt.

GPT-5.6 TERRA BEST PRACTICES:
- Open with a clear Task statement and domain context
- Use Markdown sections: ## Role, ## Context, ## Task, ## Constraints, ## Output Format
- Emphasize factual grounding, citations, and verifiable claims when relevant
- Specify step-by-step reasoning for analytical tasks
- Add concrete output structure (table, JSON, numbered list, prose)
- Remove filler words; prefer active voice and measurable constraints

{_json_response_instruction()}
""",
    ),
)

_BY_ID: dict[str, ModelDefinition] = {m.id: m for m in MODELS}
_ALIAS_MAP: dict[str, str] = {}
for _model in MODELS:
    for _legacy in _model.legacy_ids:
        _ALIAS_MAP[_legacy] = _model.id

DEFAULT_MODEL_ID = "claude_sonnet_5"


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
