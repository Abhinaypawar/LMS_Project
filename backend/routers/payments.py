import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
import razorpay
from pydantic import BaseModel


load_dotenv()  # .env file load kare

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

router = APIRouter(prefix="/payments", tags=["payments"])

class PaymentOrder(BaseModel):
    student_id: int
    course_id: int
    amount: int  # in rupees

@router.post("/create-order")
def create_order(data: PaymentOrder):
    try:
        order_amount = data.amount * 100  # Convert rupees → paise
        order_currency = "INR"
        order_receipt = f"order_rcpt_{data.student_id}_{data.course_id}"

        razorpay_order = client.order.create({
            "amount": order_amount,
            "currency": order_currency,
            "receipt": order_receipt,
            "payment_capture": 1
        })

        return {
            "order_id": razorpay_order["id"],
            "amount": order_amount,
            "currency": order_currency,
            "key": RAZORPAY_KEY_ID  # 👈 frontend me Razorpay popup ke liye
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
