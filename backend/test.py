from database import db
from bson import ObjectId
db.users.insert_one({
    "email":"fac20@gmail.com",
    "password":"123456",
    "role":"faculty",
})