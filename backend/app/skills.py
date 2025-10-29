def extract_skills(text):
    common_skills = [
        "python", "java", "aws", "azure", "gcp", "machine learning",
        "deep learning", "nlp", "sql", "data analysis", "react",
        "node", "docker", "kubernetes", "spark", "pandas", "fastapi",
        "flask", "tensorflow", "pytorch", "hadoop", "powerbi"
    ]
    return [s for s in common_skills if s in text.lower()]
