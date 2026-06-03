from fastapi import APIRouter, HTTPException

from jose import jwt

from passlib.context import CryptContext

from datetime import datetime, timedelta

from database import db

from models.user_model import User

router = APIRouter()

SECRET_KEY = "MYSECRETKEY"

ALGORITHM = "HS256"

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

users_collection = db["users"]


# HASH PASSWORD
def hash_password(password: str):

    return pwd_context.hash(password)


# VERIFY PASSWORD
def verify_password(
    plain_password,
    hashed_password
):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# CREATE TOKEN
def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(days=1)

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# REGISTER
@router.post("/register")
def register(user: User):

    existing_user = users_collection.find_one({
        "email": user.email
    })

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    hashed_password = hash_password(
        user.password
    )

    users_collection.insert_one({

        "email": user.email,

        "password": hashed_password,

        "role": getattr(
            user,
            "role",
            "student"
        ),

        "register_number": getattr(
            user,
            "register_number",
            ""
        ),

        "department": getattr(
            user,
            "department",
            ""
        ),

        "year": getattr(
            user,
            "year",
            ""
        )
    })

    return {
        "message": "User Registered Successfully"
    }


# LOGIN
@router.post("/login")
def login(user: User):

    existing_user = users_collection.find_one({
        "email": user.email
    })

    if not existing_user:

        raise HTTPException(
            status_code=400,
            detail="Invalid Email"
        )

    valid_password = verify_password(
        user.password,
        existing_user["password"]
    )

    if not valid_password:

        raise HTTPException(
            status_code=400,
            detail="Invalid Password"
        )

    token = create_access_token({
        "sub": user.email
    })

    return {
    "access_token": token,
    "token_type": "bearer",

    "role": existing_user.get(
        "role",
        "student"
    ),

    "register_number": existing_user.get(
        "register_number",
        ""
    ),

    "department": existing_user.get(
        "department",
        ""
    ),

    "year": existing_user.get(
        "year",
        ""
    )
}