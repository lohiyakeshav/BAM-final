from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.database.models import Feedback
from app.schemas.feedback import FeedbackCreate

def create_feedback(db: Session, feedback: FeedbackCreate, user_id: int):
    """Create a new feedback entry"""
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID is required to submit feedback"
        )
        
    db_feedback = Feedback(
        user_id=user_id,
        feedback_description=feedback.feedback_description,
        # report_id=feedback.report_id
    )
    
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return db_feedback

def get_feedback_by_id(db: Session, feedback_id: int):
    """Get a specific feedback by ID"""
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    return feedback

def get_user_feedbacks(db: Session, user_id: int):
    """Get all feedbacks for a specific user"""
    return db.query(Feedback).filter(Feedback.user_id == user_id).all()

def get_all_feedbacks(db: Session, skip: int = 0, limit: int = 100):
    """Get all feedbacks with pagination"""
    return db.query(Feedback).offset(skip).limit(limit).all()

    # def get_report_feedbacks(db: Session, report_id: int):
    #     """Get all feedbacks for a specific report"""
    #     return db.query(Feedback).filter(Feedback.report_id == report_id).all() 