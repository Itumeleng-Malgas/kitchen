from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.core.config import settings
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User

class CookieBearer(HTTPBearer):
    async def __call__(self, request: Request):
        # First try to get token from cookie
        token = request.cookies.get("access_token")
        
        # Fallback to Authorization header (for compatibility)
        if not token:
            authorization: HTTPAuthorizationCredentials = await super().__call__(request)
            if authorization:
                token = authorization.credentials
        
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        return token

cookie_bearer = CookieBearer()

def get_current_user(
    token: str = Depends(cookie_bearer),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    # Attach additional token claims to user object if needed
    user.plan = payload.get("plan")
    user.restaurant_id = payload.get("restaurant_id")
    
    return user