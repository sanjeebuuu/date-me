from fastapi import APIRouter, Response, Depends, status, HTTPException
from .. import schemas, models, database
from sqlalchemy.orm import Session
from typing import List
from ..oauth2 import get_current_user

get_db = database.get_db

router = APIRouter(
    tags=["Interactions"],
    prefix="/interaction"
)




@router.get('/' ,response_model = List[schemas.ShowUsers])
def show_people(db:Session = Depends(get_db), 
                current_user: schemas.User = Depends(get_current_user)
                ):
    
    user= db.query(models.User).filter(models.User.username == current_user.username).first()

    current_user_id = user.id 

    rejected_ids = db.query(models.Reject.to_user_id).filter(models.Reject.from_user_id == current_user_id)

    # .to_user_id to get just the user id, nothing else like there are things like from_user_id in Reject table, to NOT get those, we do Reject.to_user_id

    liked_ids = db.query(models.Like.to_user_id).filter(models.Like.from_user_id == current_user_id)

    users = db.query(models.User).filter(
        models.User.id != current_user_id, #to notShow afailai to like/dis
        ~models.User.id.in_(rejected_ids), #~ means ! in SQL Alchemy
        ~models.User.id.in_(liked_ids) # .in_ means in ofc, user id must not be in liked ids gg
    ).all()

    if not users:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND ,detail="No users found")
    return users


@router.post('/reject/{to_user_id}')
def reject(to_user_id: int, db:Session = Depends(get_db),
           current_user: schemas.User = Depends(get_current_user)):

    user = db.query(models.User).filter(models.User.username == current_user.username).first()
    current_user_id = user.id

    reject = models.Reject(to_user_id = to_user_id, from_user_id = current_user_id)
    db.add(reject)
    db.commit()

    return {"Rejected":True}


@router.post('/like/{to_user_id}')
def like(to_user_id:int,
         db:Session = Depends(get_db),
         current_user: schemas.User = Depends(get_current_user)):
    
    user = db.query(models.User).filter(models.User.username == current_user.username).first()
    current_user_id = user.id 

    existing_like = db.query(models.Like).filter(models.Like.from_user_id == current_user_id, 
    models.Like.to_user_id == to_user_id).first()

    if existing_like:
        return {"Match":False}
    
    
    new_like = models.Like(from_user_id = current_user_id, to_user_id = to_user_id)
    db.add(new_like)
    db.commit()

    reverse_like = db.query(models.Like).filter( 
    models.Like.to_user_id == current_user_id, 
    models.Like.from_user_id == to_user_id).first()

    if reverse_like:

        existing_chat = db.query(models.Chat).filter(
            ((models.Chat.user1_id == current_user_id) & 
            (models.Chat.user2_id == to_user_id)) |
            ((models.Chat.user2_id == current_user_id) & 
            (models.Chat.user1_id == to_user_id))
        ).first()

        if not existing_chat:
            chat = models.Chat(
                user1_id = current_user_id,
                user2_id = to_user_id
            )
            db.add(chat)
            db.commit()

        return {"Match":True,
                "chat_id":existing_chat.id if existing_chat else chat.id}


    return {"Match":False}


























# Initially did this to like from and to

# @router.post('/like/{to_user_id}')
# def like(to_user_id:int ,request: schemas.LikeRequest , db:Session = Depends(get_db)):
    


#     existing_like = db.query(models.Like).filter(models.Like.from_user_id == request.from_user_id, 
#     models.Like.to_user_id == to_user_id).first()

#     if existing_like:
#         return {"Match":False}
    
#     if not existing_like:
#         new_like = models.Like(from_user_id = request.from_user_id, to_user_id = to_user_id)
#         db.add(new_like)
#         db.commit()

#     reverse_like = db.query(models.Like).filter( 
#     models.Like.to_user_id == request.from_user_id, 
#     models.Like.from_user_id == to_user_id).first()

#     if reverse_like:
#         return {"Match":True}


#     return {"Match":False}