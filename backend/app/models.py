import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    role = Column(String(30), default="farmer") # farmer, buyer, society_lead, admin
    state = Column(String(50))
    district = Column(String(50))
    village = Column(String(80))
    preferred_language = Column(String(10), default="hi") # hi, en
    is_verified = Column(Boolean, default=True)
    farm_size_acres = Column(Float, nullable=True)
    avatar_url = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    upi_id = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    crops = relationship("CropListing", back_populates="farmer")

class CropListing(Base):
    __tablename__ = "crop_listings"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_name = Column(String(80), nullable=False, index=True) # e.g. Wheat, Bajra, Rice
    crop_name_hi = Column(String(80), nullable=True) # e.g. गेहूँ, बाजरा, चावल
    variety = Column(String(80), nullable=False) # e.g. Sharbati, Lokwan, Desi Bajra, 1121 Basmati
    category = Column(String(40), index=True) # grains, millets, rice, pulses, flour
    farming_type = Column(String(40), default="natural") # organic, natural, conventional
    description = Column(Text, nullable=True)
    price_per_kg = Column(Float, nullable=False)
    available_quantity_kg = Column(Float, nullable=False)
    min_order_kg = Column(Float, default=10.0)
    harvest_date = Column(String(30), nullable=True)
    moisture_percent = Column(Float, default=11.5)
    image_url = Column(String(255), nullable=True)
    lab_report_summary = Column(String(255), nullable=True)
    status = Column(String(30), default="available") # available, reserved, sold_out
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("User", back_populates="crops")

class MandiBenchmark(Base):
    __tablename__ = "mandi_benchmarks"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(80), nullable=False, index=True)
    variety = Column(String(80), nullable=False)
    msp_price_per_kg = Column(Float, nullable=False)
    mandi_modal_price_per_kg = Column(Float, nullable=False)
    retail_market_price_per_kg = Column(Float, nullable=False)
    mandi_name = Column(String(100))
    state = Column(String(50))
    updated_date = Column(String(30))

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(40), unique=True, index=True)
    buyer_name = Column(String(100), nullable=False)
    buyer_phone = Column(String(20), nullable=False)
    delivery_address = Column(Text, nullable=False)
    order_type = Column(String(30), default="direct") # direct, society_group_buy
    society_pool_id = Column(Integer, nullable=True)
    total_amount_inr = Column(Float, nullable=False)
    total_weight_kg = Column(Float, nullable=False)
    status = Column(String(40), default="placed") # placed, confirmed, packed, in_transit, delivered, completed
    delivery_otp = Column(String(6), default="4829")
    tracking_number = Column(String(50), nullable=True)
    items_json = Column(Text, nullable=False) # JSON string of item details
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    escrow = relationship("EscrowRecord", back_populates="order", uselist=False)

class GroupBuyPool(Base):
    __tablename__ = "group_buy_pools"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    crop_name = Column(String(80), nullable=False)
    crop_name_hi = Column(String(80), nullable=True)
    variety = Column(String(80), nullable=False)
    farmer_name = Column(String(100), nullable=False)
    apartment_society = Column(String(120), nullable=False)
    city = Column(String(80), nullable=False)
    target_weight_kg = Column(Float, nullable=False)
    current_weight_kg = Column(Float, default=0.0)
    base_price_per_kg = Column(Float, nullable=False)
    pooled_price_per_kg = Column(Float, nullable=False)
    min_savings_percent = Column(Float, default=20.0)
    status = Column(String(30), default="active") # active, locked, dispatched, delivered
    deadline_date = Column(String(30), nullable=True)
    organizer_name = Column(String(100))
    participants_count = Column(Integer, default=1)
    image_url = Column(String(255), nullable=True)

class EscrowRecord(Base):
    __tablename__ = "escrow_records"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    farmer_id = Column(Integer, nullable=False)
    amount_inr = Column(Float, nullable=False)
    status = Column(String(40), default="HELD_IN_ESCROW") # HELD_IN_ESCROW, RELEASED_TO_FARMER, REFUNDED
    held_at = Column(DateTime, default=datetime.datetime.utcnow)
    released_at = Column(DateTime, nullable=True)
    bank_transaction_ref = Column(String(50), nullable=True)

    order = relationship("Order", back_populates="escrow")
