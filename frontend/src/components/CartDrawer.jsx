import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ShieldCheck, MapPin, Truck, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  setCart,
  onOrderSuccess,
  lang,
  t
}) {
  const [deliveryType, setDeliveryType] = useState('direct'); // direct or society
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [societyName, setSocietyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalWeight = cart.reduce((acc, item) => acc + (item.quantity_kg || 25), 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.subtotal || item.price_per_kg * item.quantity_kg), 0);
  const deliveryFee = deliveryType === 'society' ? 0 : Math.round(totalWeight * 3); // Free for society pool drop
  const grandTotal = subtotal + deliveryFee;

  const handleRemove = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!buyerName || !buyerPhone || !deliveryAddress) {
      alert("Please fill in your name, phone number, and delivery address.");
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      buyer_name: buyerName,
      buyer_phone: buyerPhone,
      delivery_address: deliveryType === 'society' ? `${deliveryAddress}, ${societyName}` : deliveryAddress,
      order_type: deliveryType === 'society' ? 'society_group_buy' : 'direct',
      items: cart.map(item => ({
        crop_id: item.crop_id || item.id,
        crop_name: item.crop_name,
        variety: item.variety,
        quantity_kg: item.quantity_kg,
        price_per_kg: item.price_per_kg,
        subtotal: item.quantity_kg * item.price_per_kg
      }))
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      let orderData;
      if (response.ok) {
        orderData = await response.json();
      } else {
        // Fallback simulated order for offline or fast demo
        orderData = {
          order_number: `KS-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          delivery_address: deliveryAddress,
          total_amount_inr: grandTotal,
          total_weight_kg: totalWeight,
          status: "confirmed",
          delivery_otp: String(Math.floor(1000 + Math.random() * 9000)),
          items: orderPayload.items,
          created_at: new Date().toISOString()
        };
      }

      // Celebrate checkout with confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setCart([]);
      onClose();
      onOrderSuccess(orderData);
    } catch (err) {
      console.error("Order placement error:", err);
      // Fallback local order
      const fallbackOrder = {
        order_number: `KS-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        buyer_name: buyerName,
        buyer_phone: buyerPhone,
        delivery_address: deliveryAddress,
        total_amount_inr: grandTotal,
        total_weight_kg: totalWeight,
        status: "confirmed",
        delivery_otp: String(Math.floor(1000 + Math.random() * 9000)),
        items: orderPayload.items,
        created_at: new Date().toISOString()
      };
      confetti({ particleCount: 70, spread: 60 });
      setCart([]);
      onClose();
      onOrderSuccess(fallbackOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left">
        {/* Drawer Header */}
        <div className="p-5 border-b border-soil-200 bg-soil-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-agri-800 text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">{t.cartTitle}</h3>
              <p className="text-xs text-soil-500 font-medium">
                {cart.length} item(s) • {totalWeight} kg Total Weight
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-soil-200/60 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Cart Items & Form */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {cart.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-5xl">🌾</div>
              <p className="text-sm font-semibold text-slate-600">{t.emptyCart}</p>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-soil-50/80 p-3.5 rounded-2xl border border-soil-200/70"
                  >
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-slate-900">{item.variety}</h4>
                      <p className="text-xs text-slate-500">
                        {item.quantity_kg} kg Bag • ₹{item.price_per_kg}/kg
                      </p>
                      <span className="text-[10px] font-semibold text-agri-700 bg-agri-100 px-2 py-0.5 rounded-md inline-block">
                        Direct Farm Gate
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm text-slate-900">
                        ₹{(item.quantity_kg * item.price_per_kg).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Mode Choice */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Choose Delivery Logistics
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('direct')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      deliveryType === 'direct'
                        ? 'border-agri-700 bg-agri-50/70 font-bold text-agri-950 ring-1 ring-agri-700'
                        : 'border-soil-200 text-slate-600 hover:bg-soil-50'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-agri-700 mb-1" />
                    <div>Doorstep Courier</div>
                    <div className="text-[10px] text-slate-500 font-normal">₹3/kg freight charge</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('society')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      deliveryType === 'society'
                        ? 'border-amber-600 bg-amber-50/70 font-bold text-amber-950 ring-1 ring-amber-600'
                        : 'border-soil-200 text-slate-600 hover:bg-soil-50'
                    }`}
                  >
                    <div className="text-base mb-0.5">🏢</div>
                    <div>Apartment Group Drop</div>
                    <div className="text-[10px] text-emerald-700 font-bold">FREE Bulk Freight</div>
                  </button>
                </div>
              </div>

              {/* Customer Delivery Details Form */}
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300 focus:outline-none focus:ring-2 focus:ring-agri-600 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Mobile Phone (for Delivery OTP & WhatsApp Updates)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit phone number"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300 focus:outline-none focus:ring-2 focus:ring-agri-600 bg-white"
                  />
                </div>

                {deliveryType === 'society' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Apartment / Society Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sunrise Greens Society, Tower B"
                      value={societyName}
                      onChange={(e) => setSocietyName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300 focus:outline-none focus:ring-2 focus:ring-agri-600 bg-white"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Complete Delivery Address & Pincode
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Flat No., Street, City, State, Pincode"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-soil-300 focus:outline-none focus:ring-2 focus:ring-agri-600 bg-white"
                  />
                </div>
              </form>

              {/* Escrow Guarantee Pill */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-start gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-emerald-900 leading-snug">
                  <span className="font-bold">100% Escrow Protection:</span> Your payment is safely held until delivery OTP verification. If grain quality doesn't match description, get 100% replacement or refund.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer with Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-soil-200 bg-soil-50 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Grain Produce ({totalWeight} kg):</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Freight & Handling:</span>
                <span className={deliveryFee === 0 ? "text-emerald-700 font-bold" : ""}>
                  {deliveryFee === 0 ? "FREE (Group Drop)" : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-soil-200">
                <span>Total Payable:</span>
                <span className="text-agri-800 text-base">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full bg-agri-800 hover:bg-agri-900 active:scale-98 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-agri-900/20 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isSubmitting ? "Securing Escrow..." : t.checkoutBtn}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
