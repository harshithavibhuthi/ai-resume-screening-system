def generate_suggestions(resume_text: str, missing_skills: list):
    suggestions = []
    lower_text = resume_text.lower()

    if missing_skills:
        suggestions.append(
            "Add these missing skills if they are genuinely relevant to your profile: "
            + ", ".join(missing_skills)
        )

    if "project" not in lower_text and "projects" not in lower_text:
        suggestions.append("Add a clear Projects section to highlight your work.")

    if "experience" not in lower_text and "internship" not in lower_text:
        suggestions.append("Add internship or experience details if available.")

    if "skills" not in lower_text:
        suggestions.append("Add a dedicated Technical Skills section.")

    if "%" not in resume_text and "developed" not in lower_text and "improved" not in lower_text:
        suggestions.append("Add measurable achievements and strong action verbs.")

    if not suggestions:
        suggestions.append(
            "Your resume looks reasonably aligned. Improve formatting and quantify impact more clearly."
        )

    return suggestions