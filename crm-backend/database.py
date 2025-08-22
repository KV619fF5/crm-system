import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load .env file (only needed for local dev)
load_dotenv()

# Get DATABASE_URL from environment, fallback to SQLite if not set
DATABASE_URL = "postgresql://crm_db_g77o_user:5yQKgcnc0uKdIQGaMiIdAhn8vKSGSHvE@dpg-d2kbpte3jp1c7382k8g0-a:5432/crm-db"

# If using SQLite, need connect_args
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
