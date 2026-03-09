from sklearn.metrics.pairwise import cosine_similarity


def compute_similarity(resume_embedding, jd_embedding) -> float:
    score = cosine_similarity([resume_embedding], [jd_embedding])[0][0]
    return float(score)


def similarity_to_percentage(score: float) -> float:
    return round(score * 100, 2)


def calculate_final_score(semantic_score, matched_skills, jd_skills, resume_text):
    skill_score = len(matched_skills) / len(jd_skills) if jd_skills else 0
    keyword_score = skill_score

    completeness = 0
    lower_text = resume_text.lower()

    if "skills" in lower_text:
        completeness += 0.25
    if "education" in lower_text:
        completeness += 0.25
    if "project" in lower_text or "projects" in lower_text:
        completeness += 0.25
    if "experience" in lower_text or "internship" in lower_text:
        completeness += 0.25

    final_score = (
        semantic_score * 0.50 +
        skill_score * 0.25 +
        keyword_score * 0.15 +
        completeness * 0.10
    ) * 100

    return round(final_score, 2)