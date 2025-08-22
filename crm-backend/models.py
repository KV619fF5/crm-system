
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

#Login Page 
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)  # hashed password
    
    
# --- Customers ---
class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

    activities = relationship("Activity", back_populates="customer")
    deals = relationship("Deal", back_populates="customer")

# --- Activities ---
class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)  # <-- allow null
    activity = Column(String)
    status = Column(String)

    customer = relationship("Customer", back_populates="activities")

# --- Leads ---
class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    source = Column(String, nullable=True)   # <-- add this
    status = Column(String, default="New")
    notes = Column(String, nullable=True)    # <-- add this

# --- Deals (New) ---
class Deal(Base):
    __tablename__ = "deals"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    deal_name = Column(String, index=True)
    value = Column(Float)
    stage = Column(String)  # Prospecting, Proposal, Negotiation, Closed-Won, Closed-Lost
    expected_close_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    customer = relationship("Customer", back_populates="deals")

