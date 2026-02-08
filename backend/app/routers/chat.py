# Purpose:
# Do we have a conversation thread?
# This is communication logic.
# A chat means:
# A room / thread exists
# Messages belong here
# WebSocket connects here

from fastapi import APIRouter, Response, Depends, status, HTTPException
from .. import schemas, models, database
from sqlalchemy.orm import Session
from typing import List
from ..oauth2 import get_current_user

get_db = database.get_db


router = APIRouter(
    tags=["Chat"],
    prefix='/chat'

)

# Show all the "chats" of the current user
@router.get('/')
def show_chats(db:Session = Depends(get_db),
               current_user: schemas.User = Depends(get_current_user)):

    user= db.query(models.User).filter(models.User.username == current_user.username).first()
    current_user_id = user.id 

    chats = db.query(models.Chat).filter(
        (models.Chat.user1_id == current_user_id)|
        (models.Chat.user2_id == current_user_id)
    ).all()

    results = []

    for chat in chats:
        other_user_id = (
            chat.user2_id if chat.user1_id == current_user_id else chat.user1_id
        )

        other_user = db.query(models.User).get(other_user_id)

        results.append({
            "chat_id":chat.id,
            "current_user":current_user_id,
            "other_user":{
                "id":other_user.id,
                "username":other_user.username,
                "name":other_user.name,
                "photo":other_user.photo
            },
        })

    return results

# Show all the "messages" of the user

@router.get('/{chat_id}/messages')
def show_messages(chat_id:int,
                  db:Session = Depends(get_db),
                  current_user: schemas.User = Depends(get_current_user)):
    
    
    user= db.query(models.User).filter(models.User.username == current_user.username).first()
    current_user_id = user.id 

    chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first() 

    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if current_user_id not in [chat.user1_id, chat.user2_id]:
        raise HTTPException(status_code=403, detail="Not allowed")
    
    messages = db.query(models.Message).filter(
        models.Message.chat_id == chat_id
    ).all()

    all_messages = []

    for msg in messages:
        sender_id = msg.sender_id
        message_text = msg.message_text
    
        all_messages.append({"sender_id":sender_id,
                            "message_text":message_text})
    return all_messages