from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Lesson, Course
from schemas import LessonCreate, LessonResponse
from typing import List

router = APIRouter(prefix="/lessons", tags=["lessons"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Add lesson
@router.post("/", response_model=LessonResponse)
def add_lesson(lesson: LessonCreate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == lesson.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    new_lesson = Lesson(
        course_id=lesson.course_id,
        title=lesson.title,
        type=lesson.type,
        url=lesson.url,
        content=lesson.content
    )
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)
    return new_lesson

# Get lessons for a course
@router.get("/course/{course_id}", response_model=List[LessonResponse])
def get_lessons(course_id: int, db: Session = Depends(get_db)):
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).all()
    return lessons
