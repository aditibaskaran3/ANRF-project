from pydantic import BaseModel
from typing import List, Optional


class Question(BaseModel):

    question: str
    answer_key: str
    rubric: str
    marks: int
    expected_length: str


class Assessment(BaseModel):

    title: str
    questions: List[Question]
    id: Optional[str] = None