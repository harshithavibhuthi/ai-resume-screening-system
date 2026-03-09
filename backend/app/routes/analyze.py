import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.services.pdf_parser import extract_text_from_pdf
from app.services.preprocess import preprocess_text
from app.services.embedder import get_embedding
from app.services.scorer import (
    compute_similarity,
    similarity_to_percentage,
    calculate_final_score,
)
from app.services.skill_extractor import extract_skills, compare_skills
from app.services.suggestions import generate_suggestions

router = APIRouter()


@router.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not resume.filename:
        raise HTTPException(status_code=400, detail="Resume file is missing.")

    if not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file only.")

    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, resume.filename)

    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)

        resume_text = extract_text_from_pdf(temp_file_path)

        if not resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail="No readable text found in the PDF. Please upload a text-based PDF."
            )

        cleaned_resume_text = preprocess_text(resume_text)
        cleaned_jd_text = preprocess_text(job_description)

        resume_embedding = get_embedding(cleaned_resume_text)
        jd_embedding = get_embedding(cleaned_jd_text)

        semantic_score = compute_similarity(resume_embedding, jd_embedding)
        semantic_percentage = similarity_to_percentage(semantic_score)

        resume_skills = extract_skills(cleaned_resume_text)
        jd_skills = extract_skills(cleaned_jd_text)
        matched_skills, missing_skills = compare_skills(resume_skills, jd_skills)

        suggestions = generate_suggestions(resume_text, missing_skills)

        final_ats_score = calculate_final_score(
            semantic_score=semantic_score,
            matched_skills=matched_skills,
            jd_skills=jd_skills,
            resume_text=resume_text,
        )

        return {
            "ats_score": final_ats_score,
            "semantic_score": semantic_percentage,
            "resume_skills": resume_skills,
            "job_skills": jd_skills,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "suggestions": suggestions,
        }

    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)