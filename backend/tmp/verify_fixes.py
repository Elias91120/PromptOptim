
import sys
import os
import json

# Add current dir to path
sys.path.append(os.getcwd())

from app.services.llm_engine import rewrite_prompt
from app.schemas.prompts import ModelType

# Mock the Mistral response to test the parsing logic
class MockMessage:
    def __init__(self, content):
        self.content = content

class MockChoice:
    def __init__(self, content):
        self.message = MockMessage(content)

class MockResponse:
    def __init__(self, content):
        self.choices = [MockChoice(content)]

# 1. Test standard JSON
content_json = json.dumps({"reasoning": "Test reasoning", "optimized_prompt": "Clean prompt"})
# 2. Test single quotes (Python style)
content_python = "{'reasoning': 'Test reasoning', 'optimized_prompt': 'Clean prompt via python dict'}"
# 3. Test markdown wrapper
content_md = "```json\n" + content_json + "\n```"

import unittest
from unittest.mock import patch, MagicMock

class TestLLMParsing(unittest.TestCase):
    @patch('app.services.llm_engine._client.chat.complete')
    async def test_parsing(self, mock_complete):
        # This is a bit complex as rewrite_prompt is async and calls asyncio.to_thread
        # We will just test the logic inside if we could, but let's try a simpler approach
        pass

# Actually, let's just test the regex and literal_eval in a simple script
import ast
import re

def test_extract(content):
    clean_content = re.sub(r"```(?:json)?\s*(.*?)\s*```", r"\1", content, flags=re.DOTALL).strip()
    result = {}
    try:
        result = json.loads(clean_content)
    except json.JSONDecodeError:
        try:
            result = ast.literal_eval(clean_content)
        except:
            pass
    return result

print("Testing extraction logic:")
print(f"JSON: {test_extract(content_json)}")
print(f"Python: {test_extract(content_python)}")
print(f"Markdown: {test_extract(content_md)}")

from app.services.impact_calculator import calculate_green_impact

print("\nTesting Impact calculation with long prompt:")
input_text = "short intent"
long_optimized = "extremely " * 500 + "long prompt"
res = calculate_green_impact(input_text, long_optimized, "claude_opus")
print(f"Tokens saved: {res.tokens_saved}")
print(f"CO2 saved: {res.co2_saved_g}g")
