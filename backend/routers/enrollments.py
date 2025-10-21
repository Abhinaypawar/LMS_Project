from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Enrollment, Course, User
from typing import List

router = APIRouter(prefix="/enrollments", tags=["enrollments"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Enroll student in course
@router.post("/")
def enroll_student(student_id: int, course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    student = db.query(User).filter(User.id == student_id).first()
    if not course or not student:
        raise HTTPException(status_code=404, detail="Course or student not found")
    
    existing = db.query(Enrollment).filter(Enrollment.student_id==student_id, Enrollment.course_id==course_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled")
    
    enroll = Enrollment(student_id=student_id, course_id=course_id)
    db.add(enroll)
    db.commit()
    db.refresh(enroll)
    return enroll

# Get student's enrolled courses
@router.get("/student/{student_id}")
def get_my_courses(student_id: int, db: Session = Depends(get_db)):
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    return enrollments


# enrollments.py
@router.delete("/")
def delete_enrollment(student_id: int, course_id: int, db: Session = Depends(get_db)):
    enrollment = db.query(Enrollment).filter(Enrollment.student_id==student_id, Enrollment.course_id==course_id).first()
    if not enrollment:
        raise HTTPException(404, "Enrollment not found")
    db.delete(enrollment)
    db.commit()
    return {"detail": "Unenrolled successfully"}

