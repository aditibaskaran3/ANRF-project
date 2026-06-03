from fastapi import APIRouter

from datetime import datetime

from database import (
    student_submissions_collection,
    student_answers_collection
)

router = APIRouter()


# SUBMIT ASSESSMENT
@router.post("/submit")
def submit_assessment(data: dict):

    existing_submission = (
        student_submissions_collection.find_one(
            {
                "assessment_id":
                    data["assessment_id"],

                "student_email":
                    data["student_email"]
            }
        )
    )

    if existing_submission:

        return {
            "message":
                "Assessment Already Submitted"
        }

    submission = {

        "assessment_id":
            data["assessment_id"],

        "student_email":
            data["student_email"],

        "submitted_at":
            datetime.now(),

        "status":
            "Submitted"
    }

    result = (
        student_submissions_collection.insert_one(
            submission
        )
    )

    submission_id = str(
        result.inserted_id
    )

    answers = data.get(
        "answers",
        {}
    )

    for question_id, answer_text in answers.items():

        student_answers_collection.insert_one({

            "submission_id":
                submission_id,

            "question_id":
                question_id,

            "answer_text":
                answer_text,

            "word_count":
                len(
                    answer_text.split()
                )
        })

    return {
        "message":
            "Assessment Submitted Successfully"
    }


# GET STUDENT SUBMISSIONS
@router.get("/student/{student_email}")
def get_student_submissions(
    student_email: str
):

    submissions = list(

        student_submissions_collection.find(
            {
                "student_email":
                    student_email
            }
        )

    )

    for submission in submissions:

        submission["_id"] = str(
            submission["_id"]
        )

    return submissions