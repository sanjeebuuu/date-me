from fastapi import APIRouter,  Depends, HTTPException, status
from .. import schemas, database, models, token
from sqlalchemy.orm import Session
from .. hashing import Hash
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(
    tags=["Login"],
    prefix="/login"
)

get_db = database.get_db

# request: OAuth2PasswordRequestForm = Depends()

@router.post('/')
def login_user(request: OAuth2PasswordRequestForm = Depends() , db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found")
    if not Hash.verify_password(request.password,user.password):
        raise HTTPException(status_code= status.HTTP_406_NOT_ACCEPTABLE, detail="Wrong Password")
    
    access_token = token.create_access_token(data = {"sub":user.username})

    return {"access_token":access_token,
            "type":"bearer",
            "user":{
                "id":user.id,
                "username":user.username
            }}

# logout route is not required since access token is stored in just localStroage and frontend can remove it on button press or whatever so no route required