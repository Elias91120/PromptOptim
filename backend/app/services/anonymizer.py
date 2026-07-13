import re

# Pre-compiled regex patterns for PII detection.
# Order matters: more-specific patterns must come before broader ones
# (e.g. IBAN before credit card, SSN before generic digit sequences).
_PATTERNS = [
    (re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"), "[EMAIL]"),
    (re.compile(r"https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[^\s]*"), "[URL]"),
    # IBAN : 2 letters + 2 digits + 11 to 30 alphanumeric chars (total 15-34)
    (re.compile(r"\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b"), "[IBAN]"),
    # French SSN (NIR) : starts with 1 or 2, 13 digits + optional 2-digit key
    (re.compile(r"\b[12]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{3}\s?\d{3}(?:\s?\d{2})?\b"), "[SSN]"),
    # French phone : 06/07/+33/00 33 formats
    (re.compile(r"(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}"), "[PHONE]"),
    # Credit card : standard 4×4 digit groups (Visa, Mastercard, Amex 4-6-5)
    (re.compile(r"\b(?:\d{4}[\s\-]?){3}\d{4}\b"), "[CREDIT_CARD]"),
    # IPv4 : strict octet validation (0-255)
    (re.compile(
        r"\b(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}"
        r"(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\b"
    ), "[IP_ADDRESS]"),
]


def scrub_pii(text: str) -> str:
    """Detect and mask PII in text using pre-compiled regex patterns."""
    if not isinstance(text, str):
        return text
    for pattern, replacement in _PATTERNS:
        text = pattern.sub(replacement, text)
    return text
