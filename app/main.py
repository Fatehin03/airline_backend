from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
import secrets
import os
from pathlib import Path
from dotenv import load_dotenv

# -------------------------------------------------
# Load environment variables
# -------------------------------------------------
load_dotenv()

# -------------------------------------------------
# Import database, models, schemas
# -------------------------------------------------
from database import get_db, engine, Base
from models import User, UserRole, ActivityLog
from schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
    PasswordReset,
    PasswordResetConfirm,
    EmailVerification,
)
from email_service import (
    send_verification_email,
    send_password_reset_email,
)

# -------------------------------------------------
# Create database tables
# -------------------------------------------------
Base.metadata.create_all(bind=engine)

# -------------------------------------------------
# Initialize FastAPI app
# -------------------------------------------------
app = FastAPI(
    title="SkyLink Airlines - User Management System",
    description="Complete user management module with authentication",
    version="2.0.0",
)

# -------------------------------------------------
# CORS CONFIGURATION (RENDER SAFE)
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://airline-frontend-rjej.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Static files (safe for Render)
# -------------------------------------------------
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

# -------------------------------------------------
# Upload directory
# -------------------------------------------------
UPLOAD_DIR = Path("static/uploads/profiles")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# -------------------------------------------------
# Security configuration
# -------------------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set in environment variables")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# -------------------------------------------------
# Helper functions
# -------------------------------------------------
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise credentials_exception

    return user

def log_activity(
    db: Session,
    user_id: int,
    action: str,
    details: Optional[str] = None,
):
    activity = ActivityLog(
        user_id=user_id,
        action=action,
        details=details,
        ip_address="render-client",
        timestamp=datetime.utcnow(),
    )
    db.add(activity)
    db.commit()

# -------------------------------------------------
# HEALTH CHECK
# -------------------------------------------------
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "SkyLink Airlines API is running",
        "database": "PostgreSQL",
        "version": "2.0.0",
    }

# -------------------------------------------------
# NOTE:
# All your existing auth, profile, activity,
# admin, upload, and other routes remain unchanged.
# -------------------------------------------------

# -------------------------------------------------
# Uvicorn (Render compatible)
# -------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
    )
