from app.services.anonymizer import scrub_pii


def test_scrub_email():
    assert scrub_pii("Contact me at john.doe@example.com") == "Contact me at [EMAIL]"


def test_scrub_url():
    assert scrub_pii("Visit https://www.example.com/page") == "Visit [URL]"


def test_scrub_iban():
    result = scrub_pii("My IBAN is FR7630006000011234567890189")
    assert "[IBAN]" in result


def test_scrub_credit_card():
    result = scrub_pii("Card number 4111 1111 1111 1111")
    assert "[CREDIT_CARD]" in result


def test_scrub_ssn():
    result = scrub_pii("SSN: 1 85 12 75 056 789 12")
    assert "[SSN]" in result


def test_scrub_phone_fr():
    result = scrub_pii("Call me at 06 12 34 56 78")
    assert "[PHONE]" in result


def test_scrub_ip_address():
    result = scrub_pii("Server at 192.168.1.1")
    assert "[IP_ADDRESS]" in result


def test_no_pii_unchanged():
    text = "Write me a professional email about salary negotiation"
    assert scrub_pii(text) == text


def test_multiple_pii_types():
    text = "Email john@test.com or call 0612345678"
    result = scrub_pii(text)
    assert "[EMAIL]" in result
    assert "[PHONE]" in result


def test_returns_string():
    assert isinstance(scrub_pii("hello world"), str)
