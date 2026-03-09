SKILLS = [
    "python", "java", "c", "c++", "c#", "sql", "mysql", "postgresql",
    "html", "css", "javascript", "typescript", "react", "node.js",
    "express", "fastapi", "flask", "django", "mongodb",
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    "data structures", "algorithms", "git", "github", "docker",
    "kubernetes", "linux", "api", "rest api"
]


def extract_skills(text: str):
    text = text.lower()
    found = []

    for skill in SKILLS:
        if skill in text:
            found.append(skill)

    return sorted(list(set(found)))


def compare_skills(resume_skills, jd_skills):
    matched = [skill for skill in jd_skills if skill in resume_skills]
    missing = [skill for skill in jd_skills if skill not in resume_skills]
    return matched, missing