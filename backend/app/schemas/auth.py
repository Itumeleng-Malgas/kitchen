from app.domain.roles import Role
from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: Role = Role.OWNER

class UserOut(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool
    plan: str
    restaurant_id: Optional[int]

    class Config:
        from_attributes = True
