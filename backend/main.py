from fastapi import FastAPI
from database import Base, engine
from routers import auth, courses,lessons, enrollments,payments
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(lessons.router)
app.include_router(enrollments.router)
app.include_router(payments.router)


# app.include_router(progress.router)
# app.include_router(quiz.router)

# app.include_router(courses.router)
# include other routers: lessons, enrollments, progress, quiz

