from fastapi import APIRouter

from bson import ObjectId

from datetime import datetime

from database import assessment_collection

router = APIRouter()


# CREATE / UPDATE ASSESSMENT
@router.post("/create")
def create_assessment(data: dict):

    assessment_id = data.get("id")

    if "id" in data:
        del data["id"]

    if assessment_id:

        assessment_collection.update_one(
            {"_id": ObjectId(assessment_id)},
            {"$set": data}
        )

        return {
            "message": "Assessment Updated Successfully"
        }

    result = assessment_collection.insert_one(data)

    return {
        "message": "Assessment Created Successfully",
        "id": str(result.inserted_id)
    }


# GET ASSESSMENTS OF LOGGED-IN FACULTY ONLY
@router.get("/all/{faculty_email}")
def get_all_assessments(faculty_email: str):

    assessments = list(
        assessment_collection.find(
            {
                "faculty_email": faculty_email
            }
        )
    )

    for assessment in assessments:

        assessment["_id"] = str(
            assessment["_id"]
        )

    return assessments


# GET ASSESSMENTS FOR STUDENTS
@router.get("/student/{department}/{year}")
def get_student_assessments(
    department: str,
    year: str
):

    current_time = datetime.now()

    assessments = list(
        assessment_collection.find(
            {
                "status": "Published"
            }
        )
    )

    filtered_assessments = []

    for assessment in assessments:

        departments = assessment.get(
            "departments",
            []
        )

        years = assessment.get(
            "years",
            []
        )

        available_from = assessment.get(
            "availableFrom"
        )

        available_to = assessment.get(
            "availableTo"
        )

        if not available_from or not available_to:
            continue

        try:

            start_time = datetime.fromisoformat(
                available_from
            )

            end_time = datetime.fromisoformat(
                available_to
            )

        except:
            continue

        if (
            department in departments
            and
            year in years
            and
            start_time <= current_time <= end_time
        ):

            assessment["_id"] = str(
                assessment["_id"]
            )

            filtered_assessments.append(
                assessment
            )

    return filtered_assessments


# GET SINGLE ASSESSMENT
@router.get("/view/{assessment_id}")
def get_assessment(
    assessment_id: str
):

    assessment = assessment_collection.find_one(
        {
            "_id": ObjectId(
                assessment_id
            )
        }
    )

    if not assessment:

        return {
            "message": "Assessment not found"
        }

    assessment["_id"] = str(
        assessment["_id"]
    )

    return assessment


# DELETE ASSESSMENT
@router.delete("/delete/{assessment_id}")
def delete_assessment(assessment_id: str):

    assessment_collection.delete_one(
        {"_id": ObjectId(assessment_id)}
    )

    return {
        "message": "Assessment Deleted Successfully"
    }