# KisanSetu (किसान सेतु) 🌾
### Direct Farmer-to-Consumer (F2C) Agricultural Marketplace Platform
*Connecting India's Grain Cultivators Directly with Conscious Consumers for Transparent, Fair-Priced, and Trusted Staples*

---

## 🌐 Live Cloud Public Demo
👉 **Live Public Web App**: **[https://aspects-licensing-cars-composer.trycloudflare.com](https://aspects-licensing-cars-composer.trycloudflare.com)**  
👉 **Live Swagger REST API Docs**: **[https://aspects-licensing-cars-composer.trycloudflare.com/docs](https://aspects-licensing-cars-composer.trycloudflare.com/docs)**

*(Anyone with internet access can open the live link above on mobile, tablet, or desktop to browse farm-fresh grains, simulate escrow orders, and explore the farmer dashboard!)*

---

## 🌟 Overview & Mission

Smallholder grain farmers often lose 40% to 60% of consumer-paid retail margins to physical mandi intermediaries, while urban consumers pay inflated prices for chemically polished, blended staples.

**KisanSetu** bridges this divide through:
1. **Direct Farm-Gate Procurement**: Verified single-origin Wheat (Sharbati, Lokwan, Khapli), Pearl Millet (Desi Bajra), Rice (1121 Basmati, Sona Masoori), and Stone-ground Chakki Atta.
2. **Fair Price Benchmark Engine**: Real-time comparisons showing government MSP, local APMC Mandi rates, and direct KisanSetu price—guaranteeing farmers earn +25% to +35% more while consumers save ~20% to ~35% vs supermarket brands.
3. **Apartment / Society Bulk Pooling**: Neighbors pool 25kg–50kg bags to unlock dedicated bulk freight trucks, cutting per-kg delivery costs by 70%.
4. **RBI-Compliant Escrow Trust**: Consumer payment remains locked in escrow until the grain is delivered and the buyer confirms the 4-digit Delivery OTP.
5. **Bilingual Accessibility**: Instant 1-click toggle between **English** and **हिन्दी (Hindi)** with icon-rich, voice-friendly interfaces.
6. **Adaptive Responsive Design**: Expansive fluid width (`102rem`) with 4-column responsive grid on desktop/tablets.

---

## 🏛️ System Architecture

- **Backend**: Python 3.14 + FastAPI + SQLAlchemy + SQLite/PostgreSQL + Pydantic v2
- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons + Canvas Confetti
- **Deployment**: Unified FastAPI server hosting the REST API (`/api/*`) and modern SPA frontend with HTTPS Cloudflare Edge routing.

---

## 🚀 Local Quick Start Guide

### 1. Unified Launch (One Single Command)
```bash
./start.sh
```
Or run the backend directly:
```bash
cd backend
PYTHONPATH=. ./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open your browser:
- **Web Application**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Run Backend Automated Test Suite
```bash
cd backend
PYTHONPATH=. ./venv/bin/pytest tests/test_api.py -v
```

---

## 📑 Feature Modules

### 1. Consumer Grain Marketplace (`/`)
- Filter by grain type: Wheat (गेहूँ), Bajra (बाजरा), Rice (चावल), Pulses (दालें), Fresh Chakki Atta.
- Filter by farming method: Natural Zero-Budget, 100% Certified Organic, Clean Conventional.
- Select bag sizes (10kg, 25kg, 50kg) with instant pricing calculation.
- **Fair Price Transparency Breakdown**: Interactive slider comparing farmer net realization vs local mandi vs packaged supermarket brands.
- **Traceability Certificate**: Soil health status, moisture percentage (&lt;12%), harvest batch date, and farmer profile.

### 2. Society Group-Buying Pools (`#groupbuy`)
- Join active apartment pools (e.g., Sunrise Greens Pune, Palm Grove Gurugram, EcoLife Bengaluru).
- Dynamic progress meters tracking pooled kilograms towards the bulk freight discount.
- Create new pools for any apartment or residential layout.

### 3. Farmer Portal (`#farmer`)
- Vernacular 3-minute harvest listing wizard with presets for staple grains.
- Real-time earnings uplift calculator showing extra profit earned over physical mandi agents.
- Inventory tracking and dispatch management.

### 4. Order Tracking & Escrow Release (`#escrow`)
- 5-step transparent milestone journey:
  `Order Placed & Escrow Held` ➔ `Farm Bagging with QR Seal` ➔ `In-Transit Freight` ➔ `Doorstep Delivery` ➔ `Escrow Released to Farmer`
- Interactive 4-digit Delivery OTP verification modal triggering immediate escrow payout release with confetti celebration!
