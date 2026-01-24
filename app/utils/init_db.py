from app.database import engine
from app.models.flight import Base

# Create all tables in the database
Base.metadata.create_all(bind=engine)

print("Tables created successfully!")
