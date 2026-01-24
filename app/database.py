from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://airline_db_n8wv_user:91DS9shCFVvtELlfFrsQr78tfiDiPfTR@dpg-d5qctf7pm1nc738ofucg-a:5432/airline_db_n8wv
"
)

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
