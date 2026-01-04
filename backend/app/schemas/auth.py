from pydantic import BaseModel, EmailStr
from app.models.user import Role


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: Role = Role.OWNER
