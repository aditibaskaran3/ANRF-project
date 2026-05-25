# AssessPro – Academic Evaluation System

A full stack academic evaluation platform for faculty members to create and manage assessments.

---

## Tech Stack

### Frontend

* Next.js
* React.js
* Tailwind CSS

### Backend

* FastAPI
* MongoDB
* JWT Authentication

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# Backend Setup

## Navigate to Backend

```bash
cd backend
```

---

## Create Virtual Environment

```bash
python -m venv venv
```

---

## Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

---

# Install Backend Packages

```bash
pip install fastapi uvicorn pymongo python-dotenv python-jose passlib bcrypt python-multipart google-generativeai
```

---

# Run Backend Server

```bash
uvicorn main:app --reload
```

Backend runs on:

```bash
http://127.0.0.1:8000
```

---

# API Documentation

```bash
http://127.0.0.1:8000/docs
```
