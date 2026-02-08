from fastapi import APIRouter
from fastapi import Response, Depends, status, HTTPException
from .. import schemas, models, database
from sqlalchemy.orm import Session
from typing import List
from ..oauth2 import get_current_user

get_db = database.get_db

# A match means:

# Mutual interest exists

# Chat is allowed

# No messages necessarily exist yet

router = APIRouter(
    tags= ["Matches"],
    prefix='/match'
)

@router.get('/',response_model=List[schemas.ShowUsers])
def show_matches(db: Session = Depends(get_db),
                 current_user: schemas.User = Depends(get_current_user)):
    

    user = db.query(models.User).filter(models.User.username == current_user.username).first()
    current_user_id = user.id


    liked_by_me = db.query(models.Like.to_user_id).filter(models.Like.from_user_id == current_user_id)
    liked_me = db.query(models.Like.from_user_id).filter(models.Like.to_user_id == current_user_id)


    matches = db.query(models.User).filter(
        models.User.id.in_(liked_by_me),
        models.User.id.in_(liked_me),
        models.User.id != current_user_id
    ).all()

    return matches