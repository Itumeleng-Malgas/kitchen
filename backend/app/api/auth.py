from app.api.deps import get_current_user
from app.schemas.auth import LoginRequest, RegisterRequest, UserOut
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.core.security import hash_password

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import verify_password, create_access_token
from app.models.restaurant import Restaurant
from app.domain.roles import Role

router = APIRouter(prefix="/auth")

@router.post("/register", status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role.value,
    )

    db.add(user)
    db.commit()
    db.refresh(user) #Applies database defaults and triggers

    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
    }

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    restaurant = (
        db.query(Restaurant)
        .filter(Restaurant.owner_id == user.id)
        .first()
    )

    plan = restaurant.plan if restaurant else "FREE"

    token = create_access_token({
        "sub": str(user.id),
        "role": user.role,
        "plan": plan,
        "restaurant_id": restaurant.id if restaurant else None,
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "plan": plan,
            "restaurant_id": restaurant.id if restaurant else None,
        },
    }


@router.get("/me")
def me(current_user: User = Depends(get_current_user)) -> UserOut:
    return {
        "id": current_user.id,
        "email": current_user.email,
        "is_active": current_user.is_active,
        "role": current_user.role,
        "plan": current_user.plan,
        "restaurant_id": current_user.restaurant_id,
    }
