import fitz  # PyMuPDF


def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    doc = fitz.open(file_path)

    try:
        for page in doc:
            text += page.get_text("text", sort=True) + "\n"
    finally:
        doc.close()

    return text