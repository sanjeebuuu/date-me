from datetime import datetime, timedelta
from jose import jwt, JWTError
from .schemas import Token,  TokenData

from fastapi import WebSocket, status, HTTPException
from . import models, database
from sqlalchemy.orm import Session
from jose import jwt, JWTError

get_db = database.get_db

SECRET_KEY = "afc272d9efa4a8a16df8109486cd6a06223ee12fc71e0383a7648f8d743b57db"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRY_MINUTES = 9999999

def create_access_token(data:dict, expiry_delta: timedelta | None = None):
    to_encode = data.copy()
    if expiry_delta:
        expiry = datetime.utcnow()+expiry_delta
    else:
        expiry = datetime.utcnow()+timedelta(minutes=ACCESS_TOKEN_EXPIRY_MINUTES)
    to_encode.update({"exp":expiry})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# verify access token and oauth2 file for verification and locking various APIs
# mathi ko paxi paila oauth2 file purai then only yes tala ko

def verify_access_token(oauth2_token : str, credential_exception):
    try:
        payload = jwt.decode(oauth2_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credential_exception
        token_data = TokenData(username= username)
        return token_data
    except JWTError:
        raise credential_exception
    
# this will be called from ws_chat.py, so no Depends
async def get_current_user_ws(websocket:WebSocket, db:Session):
    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username: str = payload.get("sub")

    user = db.query(models.User).filter(
        models.User.username == username
    ).first()

    return user