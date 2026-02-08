from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .routers import interactions, users, auth, matches, chat, ws_chat
from . import models
from .database import engine

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://dateme.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

models.Base.metadata.create_all(engine)

app.include_router(interactions.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(matches.router)
app.include_router(chat.router)
app.include_router(ws_chat.router)

app.mount("/static", StaticFiles(directory="static")) # for static files ie. Images

@app.get('/')
def server_start():
    return {"Details":"Server is Running"}