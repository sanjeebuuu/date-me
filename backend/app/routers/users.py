from fastapi import APIRouter, Response, Depends, status, HTTPException, File, UploadFile
from .. import schemas, models, database
from sqlalchemy.orm import Session
from typing import List
import uuid
from .. import hashing
from ..oauth2 import get_current_user

get_db = database.get_db
IMGDIR = "static/images/"

router = APIRouter(
    tags=["Users"],
    prefix="/user"
)

@router.get('/', response_model=schemas.ShowOwn)
def show_me(db:Session = Depends(get_db),
            current_user:schemas.User = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.username == current_user.username).first()

    return user


@router.post('/register')
def register_user(request: schemas.CreateUser , db:Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.username == request.username).first()

    if user:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail="Username already taken")
    hashed_password = hashing.Hash.bcrypt(request.password)

    new_user = models.User(username = request.username, password = hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# @router.post('/{user_id}/upload-photo')
# async def upload_photo(user_id:int, file: UploadFile = File(...), db: Session = Depends(get_db)):

#         user = db.query(models.User).filter(models.User.id == user_id).first()

#         if not user:
#              raise HTTPException(status_code= status.HTTP_404_NOT_FOUND)
        


#         file.filename = f"{uuid.uuid4()}.jpg"
#         contents = await file.read()

#         with open(f"{IMGDIR}{file.filename}", "wb") as f:
#             f.write(contents)


#         user.photo = f"/images/{file.filename}"
#         db.commit()
        
#         return  file.filename


@router.post('/upload-photo')
async def upload_photo( file: UploadFile = File(...), 
                       db: Session = Depends(get_db),
                       current_user: schemas.User = Depends(get_current_user)):

        user = db.query(models.User).filter(models.User.username == current_user.username).first()

        if not user:
             raise HTTPException(status_code= status.HTTP_404_NOT_FOUND)
        

        file.filename = f"{uuid.uuid4()}.jpg"
        contents = await file.read()

        with open(f"{IMGDIR}{file.filename}", "wb") as f:
            f.write(contents)


        user.photo = f"static/images/{file.filename}"
        db.commit()
        
        return  file.filename

@router.put('/update')
def update_profile(
                    user: schemas.UpdateUser,
                    db:Session = Depends(get_db),
                    current_user : schemas.User = Depends(get_current_user),
                   ):
    db.query(models.User).filter(models.User.username == current_user.username).update(user.dict(exclude_unset=True), synchronize_session=False)
    db.commit()

    return {"Status":"Updated"}

    