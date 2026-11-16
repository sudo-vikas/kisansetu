import json
from .database import SessionLocal, engine, Base
from .models import User, CropListing, MandiBenchmark, Order, GroupBuyPool, EscrowRecord

def init_db_and_seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).count() > 0:
        db.close()
        return

    # Seed Farmers
    farmer_ramesh = User(
        name="Rameshwar Patel (रामेश्वर पटेल)",
        phone="9826012345",
        role="farmer",
        state="Madhya Pradesh",
        district="Sehore",
        village="Ashta",
        preferred_language="hi",
        is_verified=True,
        farm_size_acres=14.5,
        avatar_url="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
        bio="3rd generation natural wheat cultivator. Practicing zero chemical pesticide farming along the Narmada basin for 12 years.",
        upi_id="rameshwar.patel@upi"
    )

    farmer_ramkaran = User(
        name="Ramkaran Choudhary (रामकरण चौधरी)",
        phone="9414023456",
        role="farmer",
        state="Rajasthan",
        district="Nagaur",
        village="Kuchaman",
        preferred_language="hi",
        is_verified=True,
        farm_size_acres=22.0,
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        bio="Specializes in rain-fed organic pearl millet (Desi Bajra) and Guar. Traditional desert sun-drying technique.",
        upi_id="ramkaran.choudhary@upi"
    )

    farmer_gurpreet = User(
        name="Gurpreet Singh Gill (गुरप्रीत सिंह गिल)",
        phone="9815034567",
        role="farmer",
        state="Haryana",
        district="Karnal",
        village="Taraori",
        preferred_language="en",
        is_verified=True,
        farm_size_acres=18.0,
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        bio="Grower of heritage aromatic 1121 and Taraori Basmati rice using canal water irrigation and green compost manure.",
        upi_id="gurpreet.gill@upi"
    )

    farmer_tukaram = User(
        name="Tukaram Shinde (तुकाराम शिंदे)",
        phone="9822045678",
        role="farmer",
        state="Maharashtra",
        district="Sangli",
        village="Miraj",
        preferred_language="hi",
        is_verified=True,
        farm_size_acres=9.0,
        avatar_url="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
        bio="Preserving ancient Khapli (Emmer) wheat heirloom seeds. Low gluten, low GI, 100% natural mulch farming.",
        upi_id="tukaram.shinde@upi"
    )

    db.add_all([farmer_ramesh, farmer_ramkaran, farmer_gurpreet, farmer_tukaram])
    db.commit()

    # Mandi Benchmark Prices
    benchmarks = [
        MandiBenchmark(
            crop_name="Wheat",
            variety="Sharbati (MP Golden)",
            msp_price_per_kg=24.25,
            mandi_modal_price_per_kg=28.50,
            retail_market_price_per_kg=54.00,
            mandi_name="Sehore APMC Mandi",
            state="Madhya Pradesh",
            updated_date="Today"
        ),
        MandiBenchmark(
            crop_name="Wheat",
            variety="Lokwan Heavy Grain",
            msp_price_per_kg=24.25,
            mandi_modal_price_per_kg=26.00,
            retail_market_price_per_kg=44.00,
            mandi_name="Kota APMC Mandi",
            state="Rajasthan",
            updated_date="Today"
        ),
        MandiBenchmark(
            crop_name="Wheat",
            variety="Khapli (Emmer Heirloom)",
            msp_price_per_kg=25.00,
            mandi_modal_price_per_kg=45.00,
            retail_market_price_per_kg=110.00,
            mandi_name="Sangli APMC Mandi",
            state="Maharashtra",
            updated_date="Today"
        ),
        MandiBenchmark(
            crop_name="Bajra",
            variety="Desi Nagaur Pearl Millet",
            msp_price_per_kg=26.25,
            mandi_modal_price_per_kg=22.80,
            retail_market_price_per_kg=48.00,
            mandi_name="Nagaur APMC Mandi",
            state="Rajasthan",
            updated_date="Today"
        ),
        MandiBenchmark(
            crop_name="Rice",
            variety="1121 Aged Pusa Basmati",
            msp_price_per_kg=38.00,
            mandi_modal_price_per_kg=48.50,
            retail_market_price_per_kg=120.00,
            mandi_name="Karnal Grain Market",
            state="Haryana",
            updated_date="Today"
        ),
        MandiBenchmark(
            crop_name="Rice",
            variety="Traditional Sona Masoori",
            msp_price_per_kg=31.00,
            mandi_modal_price_per_kg=35.00,
            retail_market_price_per_kg=64.00,
            mandi_name="Kurnool APMC Mandi",
            state="Andhra Pradesh",
            updated_date="Today"
        ),
    ]
    db.add_all(benchmarks)
    db.commit()

    # Crop Listings
    crops = [
        CropListing(
            farmer_id=farmer_ramesh.id,
            crop_name="Wheat",
            crop_name_hi="सीहोर शरबती गेहूँ",
            variety="Sehore Sharbati (Golden Grain)",
            category="grains",
            farming_type="natural",
            description="Celebrated as the 'Golden Grain' of India. Plump, amber-colored, naturally sweet wheat kernels grown in black cotton soil without synthetic urea. Yields ultra-soft, aromatic rotis.",
            price_per_kg=36.00,
            available_quantity_kg=4200.0,
            min_order_kg=10.0,
            harvest_date="Nov 2026 (Fresh Rabi Harvest)",
            moisture_percent=10.8,
            image_url="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
            lab_report_summary="Moisture 10.8%, Protein 13.4%, Zero chemical residues detected by MPKV Labs."
        ),
        CropListing(
            farmer_id=farmer_ramkaran.id,
            crop_name="Bajra",
            crop_name_hi="देसी नागौरी बाजरा",
            variety="Desi Nagauri Pearl Millet",
            category="millets",
            farming_type="organic",
            description="Pure native pearl millet from the arid soils of Nagaur. Sun-dried on desert dunes. Super rich in iron, zinc, and dietary fiber. Ideal for authentic winter Bajra rotla and khichdi.",
            price_per_kg=32.00,
            available_quantity_kg=3100.0,
            min_order_kg=5.0,
            harvest_date="Oct 2026 (Kharif Harvest)",
            moisture_percent=11.2,
            image_url="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
            lab_report_summary="Iron 8.2mg/100g, 100% Organically Certified by Rajasthan Organic Board."
        ),
        CropListing(
            farmer_id=farmer_gurpreet.id,
            crop_name="Rice",
            crop_name_hi="तराओरी पारंपरिक बासमती",
            variety="1121 Royal Aromatic Basmati",
            category="rice",
            farming_type="natural",
            description="Heritage extra-long grain aged Basmati from the canal-fed plains of Taraori. Aged for 18 months in traditional moisture-controlled granaries for feather-light non-sticky fluffiness.",
            price_per_kg=72.00,
            available_quantity_kg=2500.0,
            min_order_kg=5.0,
            harvest_date="Aged 2025/2026 Reserve",
            moisture_percent=9.5,
            image_url="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
            lab_report_summary="Grain elongation ratio 2.1x, Unpolished single-origin grain."
        ),
        CropListing(
            farmer_id=farmer_tukaram.id,
            crop_name="Wheat",
            crop_name_hi="प्राचीन खापली (एमर) गेहूँ",
            variety="Khapli (Emmer Heirloom Wheat)",
            category="grains",
            farming_type="organic",
            description="Ancient Vedic diploid wheat grain unchanged for thousands of years. Low glycemic index, easily digestible, suitable for diabetic and gluten-sensitive diets. Rich in antioxidants.",
            price_per_kg=68.00,
            available_quantity_kg=1200.0,
            min_order_kg=5.0,
            harvest_date="Nov 2026 Harvest",
            moisture_percent=11.0,
            image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
            lab_report_summary="Glycemic Index < 45, NABL Accredited Organic Batch #KHP-92."
        ),
        CropListing(
            farmer_id=farmer_ramesh.id,
            crop_name="Atta",
            crop_name_hi="ताज़ा पत्थर चक्की शरबती आटा",
            variety="Stone-Ground Whole Sharbati Atta",
            category="flour",
            farming_type="natural",
            description="Milled fresh upon order using low-heat slow stone chakki to keep bran and germ nutrients intact. Never bleached, zero maida mixing, zero preservatives.",
            price_per_kg=42.00,
            available_quantity_kg=1800.0,
            min_order_kg=5.0,
            harvest_date="Milled Fresh Weekly",
            moisture_percent=12.0,
            image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
            lab_report_summary="100% Whole Grain Bran intact, Zero additive declaration."
        ),
        CropListing(
            farmer_id=farmer_ramkaran.id,
            crop_name="Pulses",
            crop_name_hi="देसी काबुली/चना (बिना पॉलिश)",
            variety="Desi Unpolished Chana (Brown Gram)",
            category="pulses",
            farming_type="natural",
            description="Naturally sun-ripened whole brown gram. Unpolished with no water or oil glazing. High dietary protein and earthy nutty flavor.",
            price_per_kg=58.00,
            available_quantity_kg=900.0,
            min_order_kg=5.0,
            harvest_date="Oct 2026",
            moisture_percent=10.5,
            image_url="https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80",
            lab_report_summary="Protein 21.8%, Zero chemical polish verified."
        ),
    ]
    db.add_all(crops)
    db.commit()

    # Seed Group Buy Pools (Apartments pooling for bulk heavy delivery)
    pools = [
        GroupBuyPool(
            title="Sunrise Greens Apartments - Annual Sharbati Wheat Pool",
            crop_name="Wheat",
            crop_name_hi="सीहोर शरबती गेहूँ",
            variety="MP Sharbati Grade-A (25kg & 50kg Bags)",
            farmer_name="Rameshwar Patel",
            apartment_society="Sunrise Greens Residential Society",
            city="Pune, Maharashtra",
            target_weight_kg=1000.0,
            current_weight_kg=775.0,
            base_price_per_kg=36.00,
            pooled_price_per_kg=32.50,
            min_savings_percent=24.0,
            status="active",
            deadline_date="In 4 days",
            organizer_name="Priya Sharma (Tower B Rep)",
            participants_count=18,
            image_url="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
        ),
        GroupBuyPool(
            title="Palm Grove Society - Pure Desi Nagauri Bajra Pool",
            crop_name="Bajra",
            crop_name_hi="देसी नागौरी बाजरा",
            variety="Desi Rajasthan Winter Bajra (10kg & 25kg)",
            farmer_name="Ramkaran Choudhary",
            apartment_society="Palm Grove Enclave, Sector 54",
            city="Gurugram, Haryana",
            target_weight_kg=500.0,
            current_weight_kg=340.0,
            base_price_per_kg=32.00,
            pooled_price_per_kg=28.00,
            min_savings_percent=26.0,
            status="active",
            deadline_date="In 2 days",
            organizer_name="Amit Mathur (Society Secretary)",
            participants_count=12,
            image_url="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
        ),
        GroupBuyPool(
            title="EcoLife Greens - Royal Taraori 1121 Basmati Rice",
            crop_name="Rice",
            crop_name_hi="तराओरी पारंपरिक बासमती",
            variety="Aged Single-Origin Basmati (10kg & 25kg)",
            farmer_name="Gurpreet Singh Gill",
            apartment_society="EcoLife Habitat, Whitefield",
            city="Bengaluru, Karnataka",
            target_weight_kg=600.0,
            current_weight_kg=520.0,
            base_price_per_kg=72.00,
            pooled_price_per_kg=64.00,
            min_savings_percent=28.0,
            status="active",
            deadline_date="In 3 days",
            organizer_name="Karthik Narayan",
            participants_count=21,
            image_url="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
        )
    ]
    db.add_all(pools)
    db.commit()

    # Seed Sample Active Order with Escrow
    sample_order = Order(
        order_number="KS-2026-8841",
        buyer_name="Ananya Verma",
        buyer_phone="9876543210",
        delivery_address="Flat 402, Tower 3, Silver Oak Gardens, Hinjewadi, Pune - 411057",
        order_type="society_group_buy",
        society_pool_id=pools[0].id,
        total_amount_inr=1625.0,
        total_weight_kg=50.0,
        status="in_transit",
        delivery_otp="5921",
        tracking_number="KSEX-TRK-99042",
        items_json=json.dumps([
            {
                "crop_id": crops[0].id,
                "crop_name": "Wheat",
                "variety": "Sehore Sharbati (Golden Grain)",
                "quantity_kg": 50.0,
                "price_per_kg": 32.50,
                "subtotal": 1625.0
            }
        ])
    )
    db.add(sample_order)
    db.commit()

    sample_escrow = EscrowRecord(
        order_id=sample_order.id,
        farmer_id=farmer_ramesh.id,
        amount_inr=1625.0,
        status="HELD_IN_ESCROW",
        bank_transaction_ref="UPI-ESC-7782190"
    )
    db.add(sample_escrow)
    db.commit()

    db.close()
    print("KisanSetu Database seeded successfully with authentic agricultural records!")

if __name__ == "__main__":
    init_db_and_seed()
