from evaluation.pipeline import evaluate_pipeline
from evaluation.schemas.validators import SingleRubric, Technical_terms
from database import db
from pprint import pprint
for doc in db.EvaluationResult.find():
    pprint(doc)
    
# for c in db.list_collection_names():
#     db[c].delete_many({})
