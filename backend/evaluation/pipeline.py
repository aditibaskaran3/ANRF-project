from .rubric_service import accessing_faculty_input
from .technical_service import (
    access_similarity_for_technical_evaluation,
    cal_technical_score,
    normalise_marks,
)
from .semantic_service import similarity_marks, labelling_ans
from .scoring_service import final_score_combined
from database import db


def _normalize_question_id(question_id):
    if str(question_id).isdigit():
        return int(question_id)
    return question_id


def accessing_student_input(student_id, question_id, assessment_id):
    question_id = _normalize_question_id(question_id)

    answer_doc = db.StudentAnswer.find_one({
        "student_id": student_id,
        "assessment_id": assessment_id,
        "question_id": question_id
    })
    if not answer_doc:
        return

    rubric_doc = db.Rubric.find_one({
        "question_id": question_id,
        "assessment_id": assessment_id
    })
    if not rubric_doc or not rubric_doc.get("verified_points_json"):
        return

    answer_key_doc = db.AnswerKey.find_one({
        "question_id": question_id,
        "assessment_id": assessment_id
    })
    if not answer_key_doc or not answer_key_doc.get("key_text"):
        return

    marks_breakdown = labelling_ans(
        answer_key_doc["key_text"],
        rubric_doc["verified_points_json"],
        answer_doc["answer_text"],
    )

    db.EvaluationResult.update_one(
        {"question_id": question_id, "student_id": student_id, "assessment_id": assessment_id},
        {
            "$set": {
                "question_id": question_id,
                "student_id": student_id,
                "assessment_id": assessment_id,
                "labels_json": marks_breakdown,
                "suggested_marks": None,
                "audit_json": None,
                "status": None,
            }
        },
        upsert=True,
    )


def evaluate_pipeline(student_id, question_ids, assessment_id):
    scores_by_question = {}

    for raw_question_id in question_ids:
        question_id = _normalize_question_id(raw_question_id)

        accessing_faculty_input(question_id, assessment_id)
        accessing_student_input(student_id, question_id, assessment_id)
        similarity_marks(student_id, question_id, assessment_id)
        access_similarity_for_technical_evaluation(question_id, assessment_id)
        cal_technical_score(student_id, question_id, assessment_id)
        normalise_marks(student_id, question_id, assessment_id)
        final_score_combined(student_id, question_id, assessment_id)

        result = db.EvaluationResult.find_one({
            "student_id": student_id,
            "question_id": question_id,
            "assessment_id": assessment_id
        })
        if not result:
            continue

        scores_by_question[str(question_id)] = {
            "semantic_marks": result.get("semantic_marks"),
            "technical_marks": result.get("technical_score"),
            "Final Marks": result.get("suggested_marks"),
        }

    if not scores_by_question:
        return None

    if len(scores_by_question) == 1:
        return next(iter(scores_by_question.values()))

    return scores_by_question