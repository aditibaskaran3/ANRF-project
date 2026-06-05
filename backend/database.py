from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)

db=client["Exam"]

collections = [
    "Assessment",
    "Question",
    "AnswerKey",
    "Rubric",
    "StudentSubmission",
    "StudentAnswer",
    "EvaluationResult",
    "FacultyCorrection"
]

for col in collections:
    if col not in db.list_collection_names():
        db.create_collection(col)

users_collection = db["users"]

# db = client["academic_evaluation_system"]

# assessment_collection = db["assessments"]

# student_submissions_collection = db["student_submissions"]

# student_answers_collection = db["student_answers"]


