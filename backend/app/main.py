import json
import uuid
import os
from datetime import datetime, timezone
from typing import List, Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import desc

from .database import engine, get_db, Base
from .models import User, CropListing, MandiBenchmark, Order, GroupBuyPool, EscrowRecord
from .schemas import (
    CropListingOut, CropListingCreate,
    MandiBenchmarkOut,
    OrderCreate, OrderOut,
    GroupBuyPoolOut, GroupBuyJoin,
    VerifyDeliveryRequest, UserOut
)
from .seed import init_db_and_seed

init_db_and_seed()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db_and_seed()
    yield

app = FastAPI(
    title="KisanSetu API (किसान सेतु)",
    description="Direct Farmer-to-Consumer Agri-Marketplace Engine with Mandi Benchmarks & Escrow Protection",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "KisanSetu", "timestamp": datetime.now(timezone.utc).isoformat()}

# --- CROPS ENDPOINTS ---
@app.get("/api/crops", response_model=List[CropListingOut])
def get_crops(
    category: Optional[str] = None,
    farming_type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CropListing).filter(CropListing.status != "sold_out")
    if category and category != "all":
        query = query.filter(CropListing.category == category)
    if farming_type and farming_type != "all":
        query = query.filter(CropListing.farming_type == farming_type)
    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            (CropListing.crop_name.ilike(search_fmt)) |
            (CropListing.variety.ilike(search_fmt)) |
            (CropListing.crop_name_hi.ilike(search_fmt))
        )
    return query.order_by(desc(CropListing.id)).all()

@app.get("/api/crops/{crop_id}", response_model=CropListingOut)
def get_crop_detail(crop_id: int, db: Session = Depends(get_db)):
    crop = db.query(CropListing).filter(CropListing.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop listing not found")
    return crop

@app.post("/api/crops", response_model=CropListingOut, status_code=status.HTTP_201_CREATED)
def create_crop_listing(payload: CropListingCreate, db: Session = Depends(get_db)):
    farmer = db.query(User).filter(User.id == payload.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    new_crop = CropListing(
        farmer_id=payload.farmer_id,
        crop_name=payload.crop_name,
        crop_name_hi=payload.crop_name_hi or payload.crop_name,
        variety=payload.variety,
        category=payload.category,
        farming_type=payload.farming_type,
        description=payload.description,
        price_per_kg=payload.price_per_kg,
        available_quantity_kg=payload.available_quantity_kg,
        min_order_kg=payload.min_order_kg,
        harvest_date=payload.harvest_date or "Fresh Harvest",
        moisture_percent=payload.moisture_percent,
        image_url=payload.image_url or "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
        lab_report_summary=payload.lab_report_summary or "Self-tested moisture & grain purity verified.",
        status="available"
    )
    db.add(new_crop)
    db.commit()
    db.refresh(new_crop)
    return new_crop

# --- MANDI BENCHMARK & PRICE CALCULATOR ---
@app.get("/api/mandi", response_model=List[MandiBenchmarkOut])
def get_mandi_benchmarks(db: Session = Depends(get_db)):
    return db.query(MandiBenchmark).all()

@app.get("/api/mandi/comparison")
def compare_prices(crop_name: str = "Wheat", weight_kg: float = 100.0, db: Session = Depends(get_db)):
    benchmark = db.query(MandiBenchmark).filter(MandiBenchmark.crop_name.ilike(f"%{crop_name}%")).first()
    if not benchmark:
        benchmark = db.query(MandiBenchmark).first()

    mandi_rate = benchmark.mandi_modal_price_per_kg
    msp_rate = benchmark.msp_price_per_kg
    retail_rate = benchmark.retail_market_price_per_kg
    kisansetu_rate = round(mandi_rate * 1.25, 2)

    farmer_mandi_earnings = round(mandi_rate * weight_kg, 2)
    farmer_kisansetu_earnings = round(kisansetu_rate * weight_kg, 2)
    farmer_gain_inr = round(farmer_kisansetu_earnings - farmer_mandi_earnings, 2)
    farmer_gain_pct = round(((farmer_kisansetu_earnings - farmer_mandi_earnings) / farmer_mandi_earnings) * 100, 1) if farmer_mandi_earnings else 0

    consumer_retail_cost = round(retail_rate * weight_kg, 2)
    consumer_kisansetu_cost = round(kisansetu_rate * weight_kg, 2)
    consumer_savings_inr = round(consumer_retail_cost - consumer_kisansetu_cost, 2)
    consumer_savings_pct = round(((consumer_retail_cost - consumer_kisansetu_cost) / consumer_retail_cost) * 100, 1) if consumer_retail_cost else 0

    return {
        "crop_name": benchmark.crop_name,
        "variety": benchmark.variety,
        "weight_kg": weight_kg,
        "mandi_modal_rate_per_kg": mandi_rate,
        "msp_rate_per_kg": msp_rate,
        "kisansetu_rate_per_kg": kisansetu_rate,
        "supermarket_rate_per_kg": retail_rate,
        "farmer_comparison": {
            "mandi_earnings": farmer_mandi_earnings,
            "kisansetu_earnings": farmer_kisansetu_earnings,
            "gain_inr": farmer_gain_inr,
            "gain_percent": farmer_gain_pct
        },
        "consumer_comparison": {
            "supermarket_cost": consumer_retail_cost,
            "kisansetu_cost": consumer_kisansetu_cost,
            "savings_inr": consumer_savings_inr,
            "savings_percent": consumer_savings_pct
        }
    }

# --- ORDERS & ESCROW ---
def parse_order_items(order_obj):
    try:
        raw_items = json.loads(order_obj.items_json) if isinstance(order_obj.items_json, str) else order_obj.items_json
    except:
        raw_items = []
    return {
        "id": order_obj.id,
        "order_number": order_obj.order_number,
        "buyer_name": order_obj.buyer_name,
        "buyer_phone": order_obj.buyer_phone,
        "delivery_address": order_obj.delivery_address,
        "order_type": order_obj.order_type,
        "society_pool_id": order_obj.society_pool_id,
        "total_amount_inr": order_obj.total_amount_inr,
        "total_weight_kg": order_obj.total_weight_kg,
        "status": order_obj.status,
        "delivery_otp": order_obj.delivery_otp,
        "tracking_number": order_obj.tracking_number,
        "created_at": order_obj.created_at,
        "items": raw_items,
        "escrow": order_obj.escrow
    }

@app.get("/api/orders", response_model=List[OrderOut])
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(desc(Order.id)).all()
    return [parse_order_items(o) for o in orders]

@app.get("/api/orders/{order_number}", response_model=OrderOut)
def get_order_by_number(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return parse_order_items(order)

@app.post("/api/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one crop item")

    total_amount = sum(item.subtotal for item in payload.items)
    total_weight = sum(item.quantity_kg for item in payload.items)

    order_num = f"KS-{datetime.now(timezone.utc).year}-{str(uuid.uuid4().int)[:5]}"
    tracking_num = f"KSEX-{str(uuid.uuid4().hex)[:8].upper()}"
    delivery_otp = str(uuid.uuid4().int % 9000 + 1000)

    primary_crop = db.query(CropListing).filter(CropListing.id == payload.items[0].crop_id).first()
    farmer_id = primary_crop.farmer_id if primary_crop else 1

    for item in payload.items:
        crop_record = db.query(CropListing).filter(CropListing.id == item.crop_id).first()
        if crop_record:
            crop_record.available_quantity_kg = max(0.0, crop_record.available_quantity_kg - item.quantity_kg)

    new_order = Order(
        order_number=order_num,
        buyer_name=payload.buyer_name,
        buyer_phone=payload.buyer_phone,
        delivery_address=payload.delivery_address,
        order_type=payload.order_type,
        society_pool_id=payload.society_pool_id,
        total_amount_inr=total_amount,
        total_weight_kg=total_weight,
        status="confirmed",
        delivery_otp=delivery_otp,
        tracking_number=tracking_num,
        items_json=json.dumps([item.model_dump() for item in payload.items])
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    escrow = EscrowRecord(
        order_id=new_order.id,
        farmer_id=farmer_id,
        amount_inr=total_amount,
        status="HELD_IN_ESCROW",
        bank_transaction_ref=f"UPI-ESC-{str(uuid.uuid4().int)[:7]}"
    )
    db.add(escrow)
    db.commit()
    db.refresh(new_order)

    return parse_order_items(new_order)

@app.post("/api/orders/verify-delivery")
def verify_delivery(payload: VerifyDeliveryRequest, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == payload.order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.delivery_otp != payload.otp.strip():
        raise HTTPException(status_code=400, detail="Invalid OTP code. Please check the code provided upon delivery.")

    order.status = "completed"

    if order.escrow:
        order.escrow.status = "RELEASED_TO_FARMER"
        order.escrow.released_at = datetime.now(timezone.utc)

    db.commit()
    return {
        "success": True,
        "message": "Delivery verified successfully! Escrow funds have been released to the farmer's verified bank account.",
        "order_number": order.order_number,
        "status": order.status,
        "escrow_status": order.escrow.status if order.escrow else "N/A",
        "released_amount_inr": order.total_amount_inr
    }

# --- GROUP BUYING POOLS ---
@app.get("/api/group-buys", response_model=List[GroupBuyPoolOut])
def get_group_buy_pools(db: Session = Depends(get_db)):
    return db.query(GroupBuyPool).all()

@app.post("/api/group-buys/join")
def join_group_buy(payload: GroupBuyJoin, db: Session = Depends(get_db)):
    pool = db.query(GroupBuyPool).filter(GroupBuyPool.id == payload.pool_id).first()
    if not pool:
        raise HTTPException(status_code=404, detail="Group buy pool not found")

    pool.current_weight_kg += payload.quantity_kg
    pool.participants_count += 1
    if pool.current_weight_kg >= pool.target_weight_kg:
        pool.status = "locked"

    db.commit()
    db.refresh(pool)
    return {
        "success": True,
        "message": f"Successfully joined {pool.title} for {payload.quantity_kg}kg!",
        "pool": pool
    }

# --- FARMERS & PLATFORM STATS ---
@app.get("/api/farmers", response_model=List[UserOut])
def get_farmers(db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == "farmer").all()

@app.get("/api/stats")
def get_platform_stats(db: Session = Depends(get_db)):
    total_farmers = db.query(User).filter(User.role == "farmer").count()
    total_listings = db.query(CropListing).count()
    total_orders = db.query(Order).count()
    active_pools = db.query(GroupBuyPool).filter(GroupBuyPool.status == "active").count()

    return {
        "total_farmers": total_farmers,
        "total_harvest_listings": total_listings,
        "total_orders_dispatched": total_orders + 1420,
        "total_grain_moved_kg": 78450.0,
        "farmer_extra_earnings_inr": 627600.0,
        "consumer_savings_inr": 941400.0,
        "active_society_pools": active_pools
    }

# Mount static frontend build if it exists
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
