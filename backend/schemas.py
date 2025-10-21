from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str
    

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        # UPDATED: Use the Pydantic V2 setting
        from_attributes = True

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None # Use Optional for clarity
    category: Optional[str] = None
    instructor_id: int
    image_url: Optional[str] = None   
    price: int

    class Config:
        # UPDATED: Use the Pydantic V2 setting
        from_attributes = True

class CourseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    instructor_id: int
    image_url: Optional[str] = None
    price: int 

    class Config:
        from_attributes = True

class LessonCreate(BaseModel):
    course_id: int
    title: str
    type: str  # video/pdf/text
    url: Optional[str] = None
    content: Optional[str] = None

    class Config:
        # UPDATED: Use the Pydantic V2 setting
        from_attributes = True

class LessonResponse(BaseModel):
    id: int
    course_id: int
    title: str
    type: str
    url: Optional[str] = None
    content: Optional[str] = None

    class Config:
        # UPDATED: Use the Pydantic V2 setting
        from_attributes = True


# # Base schema for creating a Quiz
# class QuizBase(BaseModel):
#     course_id: int
#     question: str
#     options: str  # Comma separated string of options
#     correct_answer: str

# # Schema used for the request body (POST request)
# class QuizCreate(QuizBase):
#     pass

# # Schema used for the response body (GET/POST response)
# class Quiz(QuizBase):
#     id: int

#     class Config:
#         # Renamed from orm_mode = True in Pydantic V2
#         from_attributes = True
        