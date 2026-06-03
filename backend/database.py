from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)

db = client["academic_evaluation_system"]

assessment_collection = db["assessments"]

student_submissions_collection = db["student_submissions"]

student_answers_collection = db["student_answers"]

users_collection = db["users"]