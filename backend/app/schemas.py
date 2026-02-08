from pydantic import BaseModel

class User(BaseModel):
    username: str
    name: str |None = None
    password: str
    age: int | None = None
    gender: str | None = None
    bio: str | None = None

    class Config:
        orm_mode = True

class CreateUser(BaseModel):
    username: str
    password: str

    class Config:
        orm_mode = True

class LoginUser(CreateUser):
    class Config:
        orm_mode = True


class UpdateUser(BaseModel):
    name: str|None = None
    age: int|None = None
    gender: str|None = None
    bio: str|None = None


class ShowUsers(BaseModel):
    id: int
    name: str |None = None
    age: int |None = None
    gender: str |None = None
    bio: str |None = None
    photo:str|None = None
    
    class Config:
        orm_mode = True

class ShowOwn(ShowUsers):
    username:str

    class Config:
        orm_mode = True


class LikeRequest(BaseModel):
    # from_user_id:int
    to_user_id:int

    class Config:
        orm_mode = True

class RejectRequest(BaseModel):
    from_user_id:int

    class Config:
        orm_mode = True


class Token(BaseModel):

    access_token: str
    token_types: str

    class Config:
        orm_mode = True

class TokenData(BaseModel):
    username: str

    class Config:
        orm_mode = True


