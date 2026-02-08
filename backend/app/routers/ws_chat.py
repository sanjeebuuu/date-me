from fastapi import APIRouter, Response, Depends, status, HTTPException, WebSocket, WebSocketDisconnect
from .. import schemas, models, database
from sqlalchemy.orm import Session
from typing import List
from ..oauth2 import get_current_user
from ..token import get_current_user_ws
from ..ws_manager import ConnectionManager

get_db = database.get_db


router = APIRouter(
    tags=["WebSocket"],
    prefix='/ws'

)

manager = ConnectionManager()


@router.websocket("/chat/{chat_id}")
async def websocket_chat(
    websocket: WebSocket,
    chat_id: int,
    db: Session = Depends(get_db)
):
    user = await get_current_user_ws(websocket, db)

    if not user:
        return

    # check chat permission
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()

    if not chat:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    if user.id not in [chat.user1_id, chat.user2_id]:
        await websocket.close()
        return

    await manager.connect(chat_id, websocket)

    try:
        while True:
            data = await websocket.receive_json()
            message_text = data["message"]

            # save message
            message = models.Message(
                chat_id=chat_id,
                sender_id=user.id,
                message_text=message_text
            )
            db.add(message)
            db.commit()
            db.refresh(message)

            await manager.broadcast(chat_id, {
                "sender_id": user.id,
                "message_text": message_text,
                "message_id": message.id
            })

    except WebSocketDisconnect:
        manager.disconnect(chat_id, websocket)
