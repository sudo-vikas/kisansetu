import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "KisanSetu"

def test_get_crops():
    response = client.get("/api/crops")
    assert response.status_code == 200
    crops = response.json()
    assert len(crops) > 0
    # verify wheat and bajra exist
    crop_names = [c["crop_name"].lower() for c in crops]
    assert "wheat" in crop_names or "bajra" in crop_names

def test_get_mandi_benchmarks():
    response = client.get("/api/mandi")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert any(item["crop_name"] == "Wheat" for item in data)

def test_mandi_comparison():
    response = client.get("/api/mandi/comparison?crop_name=Wheat&weight_kg=100")
    assert response.status_code == 200
    data = response.json()
    assert data["crop_name"] == "Wheat"
    assert "farmer_comparison" in data
    assert data["farmer_comparison"]["gain_inr"] > 0
    assert data["consumer_comparison"]["savings_inr"] > 0

def test_group_buys():
    response = client.get("/api/group-buys")
    assert response.status_code == 200
    pools = response.json()
    assert len(pools) > 0

def test_order_creation_and_escrow_release():
    # 1. Get first crop
    crops = client.get("/api/crops").json()
    first_crop = crops[0]

    # 2. Place order
    order_payload = {
        "buyer_name": "Rohan Sharma",
        "buyer_phone": "9999888877",
        "delivery_address": "Flat 304, Green Heights, Delhi",
        "order_type": "direct",
        "items": [
            {
                "crop_id": first_crop["id"],
                "crop_name": first_crop["crop_name"],
                "variety": first_crop["variety"],
                "quantity_kg": 25.0,
                "price_per_kg": first_crop["price_per_kg"],
                "subtotal": 25.0 * first_crop["price_per_kg"]
            }
        ]
    }
    create_res = client.post("/api/orders", json=order_payload)
    assert create_res.status_code == 201
    order = create_res.json()
    assert order["order_number"].startswith("KS-")
    assert order["escrow"]["status"] == "HELD_IN_ESCROW"
    otp = order["delivery_otp"]

    # 3. Verify delivery with OTP
    verify_payload = {
        "order_number": order["order_number"],
        "otp": otp
    }
    verify_res = client.post("/api/orders/verify-delivery", json=verify_payload)
    assert verify_res.status_code == 200
    verify_data = verify_res.json()
    assert verify_data["success"] is True
    assert verify_data["escrow_status"] == "RELEASED_TO_FARMER"
