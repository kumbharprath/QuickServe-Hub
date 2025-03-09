from fastapi import APIRouter, HTTPException, status, Depends, Request, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from core.config import settings
from models.user import TokenModel, ServiceTokenData, LoginModel
from core.database import service_collection
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from datetime import datetime, timedelta
from typing import List, Set, Optional
from models.service import ServiceProviderRegister
from crud.service import get_service_provider_latlng, save_image, create_service_provider, add_images
from pydantic import EmailStr
from bson import ObjectId


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

@router.get("/user/{token}", response_model=dict)
async def fetch_user_by_token(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    # Check if the token is in the blacklist
    if token in blacklist:
        raise credentials_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = ServiceTokenData(email=email)

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"}
        )

    except InvalidTokenError:
        raise credentials_exception

    user = await service_collection.find_one({"email": token_data.email})
    user["_id"] = str(user["_id"])
    if user is None:
        raise credentials_exception
    return user

@router.post("/service-provider/login")
async def post_login(user: LoginModel):
    try:
        service_in_db = await service_collection.find_one({"email": user.email})
        if not service_in_db:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="service does not exist")

        if not pwd_context.verify(user.password, service_in_db['password']):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid password")

        # await service_collection.update_one({"name": name}, {"$set": {"active_token": new_token}})

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# @router.get("/service-provider/logout")
# async def logout(token: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
#     try:
#         blacklist.add(token.credentials)
#         return {"message": "You have been logged out."}
#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/service-provider/register")
async def add_service_provider_with_images(
    name: str = Form(...),
    service_offered: str = Form(...),
    description: str = Form(...),
    address: str = Form(...),
    district: str = Form(...),
    state: str = Form(...),
    zip_code: str = Form(...),
    latitude: Optional[str] = Form(None),
    longitude: Optional[str] = Form(None),
    phone_number: str = Form(...),
    email: EmailStr = Form(...),
    operating_hours: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    password: str = Form(...),
    confirm_password: str = Form(...),
    profile_image: UploadFile = File(None),
    adhar_card: UploadFile = File(None),
    office_images: List[UploadFile] = File(None)
):
    print(f"Received fields - name: {name}, email: {email}")
    print(f"Received profile_image: {profile_image}")
    print(f"Received adhar_card: {adhar_card}")
    print(f"Received office_images: {[image.filename for image in office_images]}")
    try:
        if password != confirm_password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")

        hashed_password = pwd_context.hash(password)

        service_provider = {
            "name": name,
            "service_offered": service_offered,
            "description": description,
            "address": address,
            "district": district,
            "state": state,
            "zip_code": zip_code,
            "latitude": latitude,
            "longitude": longitude,
            "phone_number": phone_number,
            "email": email,
            "operating_hours": operating_hours,
            "website": website,
            "password": hashed_password  # Store hashed password
        }

        # Check for existing service provider
        existing_service_provider = await service_collection.find_one({"email": email})
        if existing_service_provider is not None:
            return {"message": "Service provider is already registered"}

        

        # Create new service provider
        result = await create_service_provider(service_provider)
        service_id = str(result.inserted_id)

        # Update location with latitude and longitude
        latitude, longitude = await get_service_provider_latlng(service_id)
        await service_collection.update_one(
            {"_id": ObjectId(service_id)},
            {"$set": {
                "latitude": latitude,
                "longitude": longitude
            }}
        )

        # Handle image uploads
        profile_image_id = await save_image(profile_image) if profile_image else None
        adhar_card_image_id = await save_image(adhar_card) if adhar_card else None
        office_images_ids = [await save_image(image) for image in office_images] if office_images else []

        # Prepare the images dictionary
        images = {
            "profile_image_id": profile_image_id,
            "adhar_card_image_id": adhar_card_image_id,
            "office_images_ids": office_images_ids
        }

        # Update service provider with image IDs
        updated_result = await add_images(service_id, images)
        if updated_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Service provider not found")

        return {"message": "Service provider registration successful", "service_id": service_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))