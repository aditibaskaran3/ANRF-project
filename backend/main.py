from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.assessment import router as assessment_router
from routes.auth import router as auth_router

app = FastAPI()


# ENABLE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# HOME API
@app.get("/")
def home():

    return {
        "message": "Backend Running Successfully"
    }


# ASSESSMENT ROUTES
app.include_router(
    assessment_router,
    prefix="/assessment",
    tags=["Assessment APIs"]
)


# AUTH ROUTES
app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication APIs"]
)