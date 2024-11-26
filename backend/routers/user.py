from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from core.config import settings
from models.user import LoginModel, RegisterModel, TokenModel, UserTokenData
from core.database import users_collection
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from datetime import datetime, timedelta
from typing import List, Set

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = settings.SECRET_KEY
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

bearer_scheme = HTTPBearer(auto_error=True)
blacklist: Set[str] = set()

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    # Check if the token is in the blacklist
    if token.credentials in blacklist:
        raise credentials_exception

    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = UserTokenData(email=email)

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    except InvalidTokenError:
        raise credentials_exception

    user = await users_collection.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    return user

@router.post("/user/login")
async def post_login(user: LoginModel):
    try:
        user_in_db = await users_collection.find_one({"email": user.email})
        if not user_in_db:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User does not exist")
        
        try:
            if not pwd_context.verify(user.password, user_in_db['hashed_password']):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid password")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid password")

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    except HTTPException as e:
        raise e  # Let HTTPExceptions propagate normally
    
    except Exception as e:
        # Catch all unexpected errors and log the actual exception details
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.get("/logout/{token}")
async def logout(token: str):
    try:
        blacklist.add(token)
        return {"message": "You have been logged out."}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/user/register")
async def post_register(user: RegisterModel):
    try:
        if user.password != user.confirm_password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")

        user_in_db = await users_collection.find_one({"email": user.email})
        if user_in_db:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

        hashed_password = pwd_context.hash(user.password)
        await users_collection.insert_one({
            "email": user.email,
            "hashed_password": hashed_password
        }) 

        return {"message": "Registration successful. Please log in."}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


