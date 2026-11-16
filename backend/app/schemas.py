from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    phone: str
    role: str = "farmer"
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    preferred_language: str = "hi"
    farm_size_acres: Optional[float] = None
    bio: Optional[str] = None
    upi_id: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserOut(UserBase):
    id: int
    is_verified: bool
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CropListingBase(BaseModel):
    crop_name: str
    crop_name_hi: Optional[str] = None
    variety: str
    category: str # grains, millets, rice, pulses, flour
    farming_type: str = "natural" # organic, natural, conventional
    description: Optional[str] = None
    price_per_kg: float
    available_quantity_kg: float
    min_order_kg: float = 10.0
    harvest_date: Optional[str] = None
    moisture_percent: float = 11.5
    image_url: Optional[str] = None
    lab_report_summary: Optional[str] = None

class CropListingCreate(CropListingBase):
    farmer_id: int

class CropListingOut(CropListingBase):
    id: int
    farmer_id: int
    status: str
    created_at: datetime
    farmer: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)

class MandiBenchmarkOut(BaseModel):
    id: int
    crop_name: str
    variety: str
    msp_price_per_kg: float
    mandi_modal_price_per_kg: float
    retail_market_price_per_kg: float
    mandi_name: Optional[str] = None
    state: Optional[str] = None
    updated_date: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class OrderItemSchema(BaseModel):
    crop_id: int
    crop_name: str
    variety: str
    quantity_kg: float
    price_per_kg: float
    subtotal: float

class OrderCreate(BaseModel):
    buyer_name: str
    buyer_phone: str
    delivery_address: str
    order_type: str = "direct"
    society_pool_id: Optional[int] = None
    items: List[OrderItemSchema]

class EscrowOut(BaseModel):
    id: int
    amount_inr: float
    status: str
    held_at: datetime
    released_at: Optional[datetime] = None
    bank_transaction_ref: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class OrderOut(BaseModel):
    id: int
    order_number: str
    buyer_name: str
    buyer_phone: str
    delivery_address: str
    order_type: str
    society_pool_id: Optional[int] = None
    total_amount_inr: float
    total_weight_kg: float
    status: str
    delivery_otp: str
    tracking_number: Optional[str] = None
    created_at: datetime
    items: List[OrderItemSchema] = []
    escrow: Optional[EscrowOut] = None

    model_config = ConfigDict(from_attributes=True)

class GroupBuyPoolOut(BaseModel):
    id: int
    title: str
    crop_name: str
    crop_name_hi: Optional[str] = None
    variety: str
    farmer_name: str
    apartment_society: str
    city: str
    target_weight_kg: float
    current_weight_kg: float
    base_price_per_kg: float
    pooled_price_per_kg: float
    min_savings_percent: float
    status: str
    deadline_date: Optional[str] = None
    organizer_name: Optional[str] = None
    participants_count: int
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class GroupBuyJoin(BaseModel):
    pool_id: int
    buyer_name: str
    buyer_phone: str
    quantity_kg: float
    flat_number: str

class VerifyDeliveryRequest(BaseModel):
    order_number: str
    otp: str
