# FILE: database.py
# PostgreSQL configuration for Render deployment

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# -------------------------------------------------
# Load environment variables
# -------------------------------------------------
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set in environment variables")

# -------------------------------------------------
# SQLAlchemy Engine
# -------------------------------------------------
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,     # Prevent stale connections
    pool_recycle=300,       # Render-friendly connection recycling
    echo=False              # MUST be False in production
)

# -------------------------------------------------
# Session factory
# -------------------------------------------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# -------------------------------------------------
# Declarative base
# -------------------------------------------------
Base = declarative_base()

# -------------------------------------------------
# Dependency for FastAPI
# -------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
