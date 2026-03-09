import re


def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^\w\s\+\#\.\-\/]", " ", text)
    return text.strip()