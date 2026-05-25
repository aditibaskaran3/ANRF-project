from fastapi import APIRouter

from bson import ObjectId

from database import assessment_collection

router = APIRouter()


# CREATE / UPDATE ASSESSMENT
@router.post("/create")
def create_assessment(data: dict):

    assessment_id = data.get("id")

    # REMOVE ID FROM BODY
    if "id" in data:

        del data["id"]


    # UPDATE EXISTING
    if assessment_id:

        assessment_collection.update_one(
            {"_id": ObjectId(assessment_id)},
            {"$set": data}
        )

        return {
            "message": "Assessment Updated Successfully"
        }


    # CREATE NEW
    result = assessment_collection.insert_one(data)

    return {
        "message": "Assessment Created Successfully",
        "id": str(result.inserted_id)
    }


# GET ALL ASSESSMENTS
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


# DELETE ASSESSMENT
@router.delete("/delete/{assessment_id}")
def delete_assessment(assessment_id: str):

    assessment_collection.delete_one(
        {"_id": ObjectId(assessment_id)}
    )

    return {
        "message": "Assessment Deleted Successfully"
    }