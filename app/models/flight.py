from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Flight(Base):
    __tablename__ = "flights"

    id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(String(50), unique=True, nullable=False)
    origin = Column(String(50), nullable=False)
    destination = Column(String(50), nullable=False)
