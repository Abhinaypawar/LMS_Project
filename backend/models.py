from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    category = Column(String)
    instructor_id = Column(Integer, ForeignKey("users.id"))
    image_url = Column(String, nullable=True)
    price = Column(Integer, nullable=False, default=0)

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String, nullable=False)
    type = Column(String)  # video/pdf/text
    url = Column(String, nullable=True)
    content = Column(String, nullable=True)

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    
    

# class Progress(Base):
#     __tablename__ = "progress"
#     id = Column(Integer, primary_key=True, index=True)
#     student_id = Column(Integer, ForeignKey("users.id"))
#     course_id = Column(Integer, ForeignKey("courses.id"))
#     lesson_id = Column(Integer, ForeignKey("lessons.id"))
#     completed = Column(Boolean, default=False)

# class Quiz(Base):
#     __tablename__ = "quizzes"
#     id = Column(Integer, primary_key=True, index=True)
#     course_id = Column(Integer, ForeignKey("courses.id"))
#     question = Column(String)
#     options = Column(String)  # comma separated
#     correct_answer = Column(String)

# class QuizAttempt(Base):
#     __tablename__ = "quiz_attempts"
#     id = Column(Integer, primary_key=True, index=True)
#     student_id = Column(Integer, ForeignKey("users.id"))
#     quiz_id = Column(Integer, ForeignKey("quizzes.id"))
#     selected_option = Column(String)
#     score = Column(Integer)
