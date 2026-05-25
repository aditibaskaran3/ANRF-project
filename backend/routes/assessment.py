from fastapi import APIRouter
from bson import ObjectId

from database import assessment_collection
from models.assessment_model import Assessment

router = APIRouter()


# CREATE / UPDATE
@router.post("/create")
def create_assessment(data: Assessment):

    assessment_dict = dict(data)

    assessment_id = assessment_dict.get("id")

    # REMOVE id
    if "id" in assessment_dict:
        del assessment_dict["id"]


    # UPDATE
    if assessment_id:

        assessment_collection.update_one(
            {"_id": ObjectId(assessment_id)},
            {"$set": assessment_dict}
        )

        return {
            "message": "Assessment Updated Successfully"
        }


    # CREATE
    result = assessment_collection.insert_one(
        assessment_dict
    )

    return {
        "message": "Assessment Created Successfully",
        "id": str(result.inserted_id)
    }


# GET ALL
@router.get("/all")
def get_all_assessments():

    assessments = list(
        assessment_collection.find()
    )

    for assessment in assessments:

        assessment["_id"] = str(
            assessment["_id"]
        )

    return assessments


# DELETE
@router.delete("/delete/{assessment_id}")
def delete_assessment(assessment_id: str):

    assessment_collection.delete_one(
        {"_id": ObjectId(assessment_id)}
    )

    return {
        "message": "Assessment Deleted Successfully"
    }