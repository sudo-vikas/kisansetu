import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MandiTicker from './components/MandiTicker';
import CartDrawer from './components/CartDrawer';
import PriceBenefitModal from './components/PriceBenefitModal';
import TraceabilityModal from './components/TraceabilityModal';

import MarketplaceView from './views/MarketplaceView';
import GroupBuyView from './views/GroupBuyView';
import FarmerPortalView from './views/FarmerPortalView';
import OrderTrackingView from './views/OrderTrackingView';

import { translations } from './i18n/translations';
import { mockCrops, mockMandiBenchmarks, mockGroupBuys } from './data/mockData';

export default function App() {
  const [lang, setLang] = useState('en');
  const [activeView, setActiveView] = useState('marketplace');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [priceModalCrop, setPriceModalCrop] = useState(null);
  const [traceabilityModalCrop, setTraceabilityModalCrop] = useState(null);

  // Data states
  const [crops, setCrops] = useState(mockCrops);
  const [mandiBenchmarks, setMandiBenchmarks] = useState(mockMandiBenchmarks);
  const [groupBuys, setGroupBuys] = useState(mockGroupBuys);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: 1,
      order_number: "KS-2026-8841",
      buyer_name: "Ananya Verma",
      buyer_phone: "9876543210",
      delivery_address: "Flat 402, Tower 3, Silver Oak Gardens, Hinjewadi, Pune - 411057",
      order_type: "society_group_buy",
      total_amount_inr: 1625.0,
      total_weight_kg: 50.0,
      status: "in_transit",
      delivery_otp: "5921",
      items: [
        {
          crop_name: "Wheat",
          variety: "Sehore Sharbati (Golden Grain)",
          quantity_kg: 50.0,
          price_per_kg: 32.50,
          subtotal: 1625.0
        }
      ],
      escrow: {
        status: "HELD_IN_ESCROW"
      }
    }
  ]);

  const t = translations[lang];

  // Fetch initial data from backend if available
  useEffect(() => {
    fetch('/api/crops')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.length > 0) setCrops(data);
      })
      .catch(() => {});

    fetch('/api/mandi')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.length > 0) setMandiBenchmarks(data);
      })
      .catch(() => {});

    fetch('/api/group-buys')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.length > 0) setGroupBuys(data);
      })
      .catch(() => {});

    fetch('/api/orders')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.length > 0) setOrders(data);
      })
      .catch(() => {});

    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => {});
  }, []);

  const handleAddToCart = (item) => {
    setCart((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  const handleOrderSuccess = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveView('escrow');
  };

  const handleCropCreated = (newCrop) => {
    setCrops((prev) => [newCrop, ...prev]);
    setActiveView('marketplace');
  };

  const handlePoolJoinSuccess = (poolId, addedKg) => {
    setGroupBuys((prev) =>
      prev.map((p) =>
        p.id === poolId
          ? {
              ...p,
              current_weight_kg: p.current_weight_kg + addedKg,
              participants_count: p.participants_count + 1
            }
          : p
      )
    );
  };

  const handleDeliveryVerified = (orderNumber) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.order_number === orderNumber
          ? { ...o, status: 'completed', escrow: { ...o.escrow, status: 'RELEASED_TO_FARMER' } }
          : o
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-slate-800 w-full overflow-x-hidden">
      {/* Live Mandi Benchmark Ticker */}
      <MandiTicker benchmarks={mandiBenchmarks} lang={lang} t={t} />

      {/* Main Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        lang={lang}
        setLang={setLang}
        t={t}
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main View Area with expansive adaptive width */}
      <main className="flex-1 w-full max-w-[102rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 pt-6 transition-all">
        {activeView === 'marketplace' && (
          <MarketplaceView
            crops={crops}
            stats={stats}
            onAddToCart={handleAddToCart}
            onOpenPriceModal={(crop) => setPriceModalCrop(crop)}
            onOpenTraceabilityModal={(crop) => setTraceabilityModalCrop(crop)}
            lang={lang}
            t={t}
          />
        )}

        {activeView === 'groupbuy' && (
          <GroupBuyView
            pools={groupBuys}
            onJoinSuccess={handlePoolJoinSuccess}
            lang={lang}
            t={t}
          />
        )}

        {activeView === 'farmer' && (
          <FarmerPortalView
            crops={crops}
            onCropCreated={handleCropCreated}
            lang={lang}
            t={t}
          />
        )}

        {activeView === 'escrow' && (
          <OrderTrackingView
            orders={orders}
            onDeliveryVerified={handleDeliveryVerified}
            lang={lang}
            t={t}
          />
        )}
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
        onOrderSuccess={handleOrderSuccess}
        lang={lang}
        t={t}
      />

      {/* Price Transparency Modal */}
      <PriceBenefitModal
        crop={priceModalCrop}
        onClose={() => setPriceModalCrop(null)}
        lang={lang}
        t={t}
      />

      {/* Batch Traceability & Lab Test Modal */}
      <TraceabilityModal
        crop={traceabilityModalCrop}
        onClose={() => setTraceabilityModalCrop(null)}
        lang={lang}
        t={t}
      />

      {/* Expansive Full-Width Footer */}
      <footer className="bg-soil-900 text-soil-100 border-t border-soil-800 py-14 mt-16 w-full">
        <div className="max-w-[102rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <span className="text-xl font-extrabold text-white">KisanSetu (किसान सेतु)</span>
            </div>
            <p className="text-xs text-soil-300 leading-relaxed">
              Empowering India's grain cultivators with direct market access, fair benchmark pricing, and zero middleman exploitation.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Direct Farm Produce
            </h4>
            <ul className="text-xs text-soil-300 space-y-2">
              <li>• MP Sehore Sharbati Wheat</li>
              <li>• Rajasthan Desi Nagauri Bajra</li>
              <li>• Punjab Taraori 1121 Basmati Rice</li>
              <li>• Maharashtra Vedic Khapli Emmer</li>
              <li>• Stone-ground Whole Chakki Atta</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
              Trust & Security
            </h4>
            <ul className="text-xs text-soil-300 space-y-2">
              <li>• RBI-Compliant Escrow Protection</li>
              <li>• Tamper-Evident QR Seed Seals</li>
              <li>• Doorstep OTP Verification</li>
              <li>• NABL Accredited Moisture Checks</li>
              <li>• 100% Direct Farmer Bank Settlement</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Mission
            </h4>
            <p className="text-xs text-soil-300 leading-relaxed">
              When farmers prosper, the nation flourishes. KisanSetu eliminates 3 to 4 intermediary tiers to ensure healthy, natural staples for every Indian kitchen.
            </p>
            <div className="mt-4 text-[11px] text-soil-400">
              © 2026 KisanSetu Agri-Tech Platform. Built for India's Annadatas.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
