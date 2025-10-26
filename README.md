# LMS Project

This is a Learning Management System (LMS) project with React frontend and FastAPI backend.


## Project Structure

## Prerequisites

- Node.js (for frontend)
- Python 3.10+ (for backend)
- PostgreSQL database
- Razorpay account for payment integration

## Setup Instructions

### 1. Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

# <!-- Create a .env file in backend/ with: -->
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
DATABASE_URL=postgresql://username:password@localhost:5432/db_name

# Run backend:
uvicorn main:app --reload


### 1. frontend
cd frontend
npm install
npm start

# Frontend .env file in frontend/:
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
REACT_APP_API_BASE_URL=http://localhost:8000
