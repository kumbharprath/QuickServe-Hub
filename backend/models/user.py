from pydantic import BaseModel, validator
import re

class LoginModel(BaseModel):
    email: str
    password: str

class RegisterModel(BaseModel):
    email: str
    password: str
    confirm_password: str

    @validator('password')
    def validate_password(cls, value):
        if not re.match(r'^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$', value):
            raise ValueError("Password must be at least 8 characters long, include an uppercase letter and a number.")
        return value

class TokenModel(BaseModel):
    access_token: str
    token_type: str

class UserTokenData(BaseModel):
    email: str

class ServiceTokenData(BaseModel):
    email: str