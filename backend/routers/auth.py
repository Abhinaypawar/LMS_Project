from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from schemas import UserCreate, UserLogin, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # NOTE: You should hash the password before saving it in a real application!
    new_user = User(name=user.name, email=user.email, password=user.password, role=user.role)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # --- FIX IS HERE ---
    return new_user 
    # -------------------
    
@router.post("/login", response_model=UserResponse)
def login(data:UserLogin, db: Session = Depends(get_db)):
      user = db.query(User).filter(User.email == data.email, User.password == data.password ).first()
      if not user:
          raise HTTPException(status_code = 400, detail="Invalid credential")
      return user

