import asyncio
import ast
import json
import re

import httpx
from fastapi import HTTPException

from app.config import settings
from app.schemas.prompts import ModelType

_SYSTEM_PROMPTS = {

    ModelType.GPT_5: """
You are a senior Prompt Engineer specializing in GPT-5. Transform the raw user intent into a production-ready, token-efficient prompt optimized for GPT-5.

GPT-5 BEST PRACTICES:
- Open with a sharp, domain-specific Persona ("You are a [role] with [X] years of experience in [domain].")
- Separate sections with Markdown headers: ## Role, ## Context, ## Task, ## Constraints, ## Output Format
- Be explicit about the output format (JSON / Markdown table / numbered list / prose — never leave it ambiguous)
- Add concrete Constraints to prevent off-topic answers (length, language, tone, forbidden items)
- If the user provided no context, invent a plausible professional scenario that makes the task richer
- Remove all filler words, politeness phrases ("please", "could you", "I was wondering"), and redundancy
- Prefer active voice and imperative mood

Respond ONLY with valid JSON — no markdown wrapper:
{"reasoning": "One or two sentences: what you changed and why.", "optimized_prompt": "The full rewritten prompt."}
""",

    ModelType.CLAUDE_OPUS: """
You are a senior Prompt Engineer specializing in Claude Opus. Transform the raw user intent into a prompt that leverages Claude's native strengths.

CLAUDE OPUS BEST PRACTICES:
- Claude performs significantly better with XML tags — use them systematically to separate data from instructions
- Standard tag structure: <role>, <context>, <task>, <constraints>, <output_format>
- Add <thinking> for analytical or multi-step tasks to trigger chain-of-thought
- Use <example> tags to show one input/output pair when the format is non-trivial
- Avoid Markdown headers inside XML — pick one structure and stick with it
- Remove all filler words and politeness phrases
- Claude handles long, nuanced prompts well — be precise and verbose in constraints

Respond ONLY with valid JSON — no markdown wrapper:
{"reasoning": "One or two sentences: what you changed and why.", "optimized_prompt": "The full rewritten prompt using XML tags."}
""",

    ModelType.GEMINI_3_PRO: """
You are a senior Prompt Engineer specializing in Google Gemini Pro. Transform the raw user intent into a clear, step-by-step prompt that plays to Gemini's strengths.

GEMINI PRO BEST PRACTICES:
- Gemini responds best to explicit, numbered step-by-step instructions
- Open with a clear Task statement, then break it into numbered sub-steps
- Be didactic: spell out what each step should produce
- Add "Think step by step before answering" for complex reasoning tasks
- Specify the exact output structure (numbered list, table, JSON, prose)
- Ask for sources or examples when the task is factual or comparative
- Remove all filler words and politeness phrases

Respond ONLY with valid JSON — no markdown wrapper:
{"reasoning": "One or two sentences: what you changed and why.", "optimized_prompt": "The full rewritten prompt."}
""",

    ModelType.MISTRAL_2: """
You are a senior Prompt Engineer specializing in Mistral Large 2 and Green IT prompt optimization. Transform the raw user intent into the most token-efficient prompt possible without losing precision.

MISTRAL LARGE 2 BEST PRACTICES:
- Remove ALL filler: greetings, "please", "could you", "I would like", transitions, repeated ideas
- Use telegraphic style: imperative verbs, no articles when avoidable, bullet points over prose
- Simple Markdown only: ### headers and - bullet points, nothing more
- Quantify constraints explicitly (max N words, N bullet points, etc.)
- Token economy: every word must earn its place

Respond ONLY with valid JSON — no markdown wrapper:
{"reasoning": "One sentence: what was cut, what was added, estimated token reduction.", "optimized_prompt": "The full rewritten prompt, ultra-concise."}
""",

    ModelType.MIDJOURNEY_V6: """
You are an expert AI Photographer and Midjourney V6 Prompt Engineer. Translate the user's visual idea into a dense, production-ready Midjourney V6 prompt.

MIDJOURNEY V6 BEST PRACTICES:
- Write in English always. Comma-separated descriptive keywords only — no full sentences.
- Structure: [main subject], [environment/setting], [lighting], [mood/atmosphere], [art style], [technical params]
- Lighting: golden hour, dramatic side lighting, soft diffused light, neon glow, chiaroscuro, rim light
- Art style: photorealistic, cinematic, editorial photography, concept art, watercolor, oil painting, 8K render
- Add negatives with --no for common defects: --no blurry, deformed hands, watermark, text, low quality

PARAMETER RULES:
- --ar: portrait/person/tower/mobile → 9:16 | landscape/cinema/banner → 16:9 | logo/icon/avatar → 1:1
- --stylize: abstract/artistic → 750 | editorial/balanced → 400 | photorealistic → 250 | flat/logo → 50
- Always include: --v 6.0 --q 2

Respond ONLY with valid JSON — no markdown wrapper:
{"reasoning": "Orientation detected, style identified, key visual decisions.", "optimized_prompt": "keywords, ... --ar X:X --v 6.0 --stylize NNN --q 2 --no ..."}
""",
}


def _parse_llm_json(content: str) -> dict:
    clean_content = re.sub(r"```(?:json)?\s*(.*?)\s*```", r"\1", content, flags=re.DOTALL).strip()
    try:
        return json.loads(clean_content)
    except json.JSONDecodeError:
        try:
            return ast.literal_eval(clean_content)
        except (ValueError, SyntaxError):
            return {}


async def rewrite_prompt(user_intent: str, target_model: ModelType) -> dict:
    system_prompt = _SYSTEM_PROMPTS.get(target_model, _SYSTEM_PROMPTS[ModelType.MISTRAL_2])

    if not settings.THREEGEEKS_API_KEY:
        raise HTTPException(status_code=503, detail="AI service not configured.")

    url = f"{settings.THREEGEEKS_API_BASE_URL.rstrip('/')}/v1/chat/completions"
    payload: dict = {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_intent},
        ],
    }
    if settings.THREEGEEKS_MODEL:
        payload["model"] = settings.THREEGEEKS_MODEL

    headers = {
        "Authorization": f"Bearer {settings.THREEGEEKS_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await asyncio.wait_for(
                client.post(url, json=payload, headers=headers),
                timeout=60.0,
            )
    except asyncio.TimeoutError:
        raise HTTPException(status_code=503, detail="AI service timeout. Please try again.")
    except Exception:
        raise HTTPException(status_code=503, detail="AI service unavailable. Please try again.")

    if response.status_code >= 400:
        raise HTTPException(status_code=503, detail="AI service unavailable. Please try again.")

    data = response.json()
    choices = data.get("choices") or []
    if not choices:
        raise HTTPException(status_code=503, detail="AI service returned empty response.")

    content = (choices[0].get("message") or {}).get("content") or ""
    result = _parse_llm_json(content)

    optimized = result.get("optimized_prompt") or result.get("prompt")
    reasoning = result.get("reasoning") or result.get("explanation", "")

    if not optimized:
        return {"optimized_prompt": str(content).strip(), "reasoning": ""}

    return {
        "optimized_prompt": str(optimized).strip(),
        "reasoning": str(reasoning).strip(),
    }
