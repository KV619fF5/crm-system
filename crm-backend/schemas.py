from typing import Optional
from datetime import date
from pydantic import BaseModel

# --- LOGIN PAGE ---
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    class Config:
        from_attributes = True

# --- Customers ---
class CustomerBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None

class Customer(CustomerBase):
    id: int
    class Config:
        from_attributes = True

# --- Activities ---
class ActivityBase(BaseModel):
    customer_id: Optional[int] = None   # <-- fixed, now optional
    activity: str
    status: str

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    customer_id: Optional[int] = None
    activity: Optional[str] = None
    status: Optional[str] = None

class Activity(ActivityBase):
    id: int
    class Config:
        from_attributes = True

# --- Leads ---
class LeadBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None        # <-- add this
    status: str = "New"  
    notes: Optional[str] = None         # <-- add this

class LeadCreate(LeadBase):
    pass

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None        # <-- add this
    status: Optional[str] = None
    notes: Optional[str] = None         # <-- add this

class Lead(LeadBase):
    id: int
    class Config:
        from_attributes = True

# --- Deals ---
class DealBase(BaseModel):
    customer_id: Optional[int] = None   # <-- fixed, now optional
    deal_name: str
    value: float
    stage: str   # e.g. Prospecting, Proposal, Negotiation, Closed-Won, Closed-Lost
    expected_close_date: Optional[date] = None
    notes: Optional[str] = None

class DealCreate(DealBase):
    pass

class DealUpdate(BaseModel):
    customer_id: Optional[int] = None
    deal_name: Optional[str] = None
    value: Optional[float] = None
    stage: Optional[str] = None
    expected_close_date: Optional[date] = None
    notes: Optional[str] = None

class Deal(DealBase):
    id: int
    class Config:
        from_attributes = True
