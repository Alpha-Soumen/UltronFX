from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import json
from pathlib import Path
from datetime import datetime

router = APIRouter()

FEEDBACK_FILE = Path(__file__).parent / "feedback.json"

class FeedbackCreate(BaseModel):
    name: str
    email: str
    topic: str
    message: str

class FeedbackResponse(FeedbackCreate):
    id: int
    timestamp: str
    status: str

def load_feedback():
    if not FEEDBACK_FILE.exists():
        return []
    try:
        with open(FEEDBACK_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_feedback(feedback_list):
    with open(FEEDBACK_FILE, "w") as f:
        json.dump(feedback_list, f, indent=4)

@router.post("/feedback", response_model=FeedbackResponse)
def submit_feedback(feedback: FeedbackCreate):
    feedback_list = load_feedback()
    
    new_entry = feedback.dict()
    new_entry["id"] = len(feedback_list) + 1
    new_entry["timestamp"] = datetime.now().isoformat()
    new_entry["status"] = "Pending"
    
    feedback_list.append(new_entry)
    save_feedback(feedback_list)
    
    return new_entry

@router.get("/feedback", response_model=List[FeedbackResponse])
def get_feedback():
    return load_feedback()

@router.post("/feedback/{id}/resolve")
def resolve_feedback(id: int):
    feedback_list = load_feedback()
    for item in feedback_list:
        if item["id"] == id:
            item["status"] = "Resolved"
            save_feedback(feedback_list)
            return {"message": "Feedback resolved"}
    raise HTTPException(status_code=404, detail="Feedback not found")
