from pydantic import BaseModel


class User(BaseModel):

    email: str
    password: str

    role: str = "student"

    register_number: str = ""

    department: str = ""

    year: str = ""