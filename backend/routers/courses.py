from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Course, User, Enrollment,Lesson
from schemas import CourseCreate, CourseResponse
from typing import List

router = APIRouter(prefix="/courses", tags=["courses"])
# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create a new course (Admin/Teacher)
@router.post("/", response_model=CourseResponse)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    # Check if instructor exists
    instructor = db.query(User).filter(User.id == course.instructor_id).first()
    if not instructor:
        raise HTTPException(status_code=400, detail="Instructor not found")
    
    new_course = Course(
        title=course.title,
        description=course.description,
        category=course.category,
        instructor_id=course.instructor_id,
        image_url=course.image_url,
        price=course.price
        
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

# Get all courses
@router.get("/", response_model=List[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    return courses


# Get single course by id
@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


# Update course
@router.put("/{course_id}", response_model=CourseResponse)
def update_course(course_id: int, data: CourseCreate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course.title = data.title
    course.description = data.description
    course.category = data.category
    course.instructor_id = data.instructor_id,
    course.image_url = data.image_url,
    course.price = data.price
    

    db.commit()
    db.refresh(course)
    return course
# Delete course (along with related enrollments)
@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    # Step 1: Check if course exists
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Step 2: Delete enrollments linked to this course
    db.query(Enrollment).filter(Enrollment.course_id == course_id).delete()
    db.query(Lesson).filter(Lesson.course_id == course_id).delete()

    # Step 3: Delete the course itself
    db.delete(course)
    db.commit()

    return {"detail": f"Course '{course.title}' and related enrollments deleted successfully"}
