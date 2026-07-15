import asyncio
import ast
import json
import re

import httpx
from fastapi import HTTPException

from app.config import settings
from app.data.models_registry import DEFAULT_MODEL_ID, get_model, resolve_model_id


def _parse_llm_json(content: str) -> dict:
    clean_content = re.sub(r"```(?:json)?\s*(.*?)\s*```", r"\1", content, flags=re.DOTALL).strip()
    try:
        return json.loads(clean_content)
    except json.JSONDecodeError:
        try:
            return ast.literal_eval(clean_content)
        except (ValueError, SyntaxError):
            return {}


async def rewrite_prompt(user_intent: str, target_model: str) -> dict:
    model_id = resolve_model_id(target_model)
    model_def = get_model(model_id)
    system_prompt = model_def.system_prompt

    if not settings.THREEGEEKS_API_KEY:
        raise HTTPException(status_code=503, detail="AI service not configured.")

    url = f"{settings.THREEGEEKS_API_BASE_URL.rstrip('/')}/v1/chat/completions"
    payload: dict = {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_intent},
        ],
    }

    hub_model = settings.THREEGEEKS_MODEL or model_def.hub_model
    if hub_model:
        payload["model"] = hub_model

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


def get_default_model_id() -> str:
    return DEFAULT_MODEL_ID
