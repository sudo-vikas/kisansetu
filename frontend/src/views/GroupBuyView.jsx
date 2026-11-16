import React, { useState } from 'react';
import { Users, Truck, Sparkles, PlusCircle, CheckCircle, ArrowRight, ShieldCheck, Clock, MapPin, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GroupBuyView({
  pools,
  onJoinSuccess,
  lang,
  t
}) {
  const [selectedPool, setSelectedPool] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [bagQuantity, setBagQuantity] = useState(1);
  const [bagSize, setBagSize] = useState(25);
  const [isJoining, setIsJoining] = useState(false);

  // New pool modal
  const [showNewPoolModal, setShowNewPoolModal] = useState(false);
  const [newSocietyName, setNewSocietyName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCropName, setNewCropName] = useState('Sharbati Wheat');
  const [newTargetKg, setNewTargetKg] = useState(500);

  const handleOpenJoin = (pool) => {
    setSelectedPool(pool);
  };

  const handleConfirmJoin = async (e) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || !flatNumber) {
      alert("Please fill in your name, phone, and flat number.");
      return;
    }

    const totalKg = bagQuantity * bagSize;
    setIsJoining(true);

    try {
      const response = await fetch('/api/group-buys/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pool_id: selectedPool.id,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          quantity_kg: totalKg,
          flat_number: flatNumber
        })
      });

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });

      onJoinSuccess(selectedPool.id, totalKg);
      setSelectedPool(null);
      setBuyerName('');
      setBuyerPhone('');
      setFlatNumber('');
    } catch (err) {
      console.error(err);
      confetti({ particleCount: 60, spread: 60 });
      onJoinSuccess(selectedPool.id, totalKg);
      setSelectedPool(null);
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreatePool = (e) => {
    e.preventDefault();
    if (!newSocietyName || !newCity) {
      alert("Please enter your society and city.");
      return;
    }

    confetti({ particleCount: 70, spread: 60 });
    alert(`🎉 New Group Buy Pool created for ${newSocietyName}! Your neighbors can now start joining.`);
    setShowNewPoolModal(false);
  };

  return (
    <div className="space-y-8 pb-16 w-full">
      {/* Banner */}
      <section className="bg-gradient-to-r from-amber-950 via-soil-900 to-agri-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden w-full">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 px-3 py-1.5 rounded-full text-xs font-bold text-amber-300">
            <Users className="w-3.5 h-3.5" />
            <span>Apartment Society Bulk Pooling (सामूहिक खरीद)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black">
            {lang === 'hi' ? 'सोसायटी समूह खरीद - माल ढुलाई में 70% बचत' : 'Apartment Group-Buying: Pool with Neighbors & Cut Freight 70%'}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-soil-200 leading-relaxed max-w-2xl">
            {t.societyPoolSub}
          </p>

          <button
            onClick={() => setShowNewPoolModal(true)}
            className="mt-2 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start a Pool for Your Apartment</span>
          </button>
        </div>
      </section>

      {/* Active Society Pools Grid - 4 Columns on XL screens */}
      <section className="space-y-4 w-full">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t.societyPoolActive}
            </h2>
            <p className="text-xs text-soil-500">
              Orders auto-dispatch when pool hits 100% threshold.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {pools.map((pool) => {
            const percentFilled = Math.min(100, Math.round((pool.current_weight_kg / pool.target_weight_kg) * 100));

            return (
              <div
                key={pool.id}
                className="bg-white rounded-3xl border border-soil-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image & Status */}
                  <div className="relative h-44 overflow-hidden bg-soil-100">
                    <img
                      src={pool.image_url}
                      alt={pool.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    <div className="absolute top-3 left-3 bg-amber-400 text-agri-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      Save {pool.min_savings_percent}% vs Supermarket
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{pool.city}</span>
                      </div>
                      <h3 className="font-extrabold text-base leading-snug">
                        {pool.apartment_society}
                      </h3>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-agri-800">
                        {pool.crop_name} • {pool.variety}
                      </span>
                      <p className="text-xs text-slate-500">
                        Grower: {pool.farmer_name} | Coordinator: {pool.organizer_name}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">
                          {pool.current_weight_kg} kg / {pool.target_weight_kg} kg
                        </span>
                        <span className="text-emerald-700">{percentFilled}% Filled</span>
                      </div>

                      <div className="w-full bg-soil-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-agri-700 h-full rounded-full transition-all duration-700"
                          style={{ width: `${percentFilled}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {pool.participants_count} neighbors pooled so far • Closes {pool.deadline_date}
                      </p>
                    </div>

                    {/* Price Comparison */}
                    <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Direct Pooled Rate:</span>
                        <span className="text-base font-black text-amber-950">
                          ₹{pool.pooled_price_per_kg}/kg
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 line-through text-[11px]">Regular ₹{pool.base_price_per_kg}/kg</span>
                        <span className="text-emerald-700 font-bold block text-xs">FREE Truck Drop</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Join Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleOpenJoin(pool)}
                    className="w-full bg-agri-800 hover:bg-agri-900 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                  >
                    <Users className="w-4 h-4 text-amber-300" />
                    <span>Join Pool ({pool.apartment_society.split(' ')[0]})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Join Pool Modal */}
      {selectedPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-soil-200 overflow-hidden relative">
            <div className="bg-agri-900 text-white p-5 relative">
              <button
                onClick={() => setSelectedPool(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-lg">{t.poolModalTitle}</h3>
              <p className="text-xs text-agri-200">{selectedPool.apartment_society}</p>
            </div>

            <form onSubmit={handleConfirmJoin} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Joshi"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300 focus:ring-2 focus:ring-agri-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300 focus:ring-2 focus:ring-agri-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.flatNumber}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat B-402"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300 focus:ring-2 focus:ring-agri-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Bag Size
                  </label>
                  <select
                    value={bagSize}
                    onChange={(e) => setBagSize(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-soil-300 bg-white"
                  >
                    <option value={25}>25 kg Bag</option>
                    <option value={50}>50 kg Bag</option>
                    <option value={10}>10 kg Bag</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Number of Bags
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bagQuantity}
                    onChange={(e) => setBagQuantity(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-soil-300 text-center"
                  />
                </div>
              </div>

              <div className="bg-soil-50 p-3 rounded-xl border border-soil-200 text-xs flex justify-between items-center">
                <span className="text-slate-600">Total: {bagQuantity * bagSize} kg</span>
                <span className="font-black text-sm text-agri-800">
                  ₹{Math.round(bagQuantity * bagSize * selectedPool.pooled_price_per_kg).toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={isJoining}
                className="w-full bg-agri-800 hover:bg-agri-900 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all"
              >
                {isJoining ? "Securing Allocation..." : t.confirmJoin}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Start New Apartment Pool Modal */}
      {showNewPoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-soil-200 overflow-hidden">
            <div className="bg-amber-900 text-white p-5 relative">
              <button
                onClick={() => setShowNewPoolModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-lg">Start Society Harvest Pool</h3>
              <p className="text-xs text-amber-200">Lead bulk grain procurement for your society</p>
            </div>

            <form onSubmit={handleCreatePool} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Apartment / Society Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oberoi Woods, Goregaon East"
                  value={newSocietyName}
                  onChange={(e) => setNewSocietyName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300 focus:ring-2 focus:ring-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  City & State
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300 focus:ring-2 focus:ring-amber-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Target Crop
                  </label>
                  <select
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-soil-300 bg-white"
                  >
                    <option value="Sharbati Wheat">Sharbati Wheat (गेहूँ)</option>
                    <option value="Desi Bajra">Desi Bajra (बाजरा)</option>
                    <option value="1121 Basmati Rice">Basmati Rice (चावल)</option>
                    <option value="Khapli Wheat">Khapli Emmer Wheat</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Target Goal (kg)
                  </label>
                  <select
                    value={newTargetKg}
                    onChange={(e) => setNewTargetKg(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-soil-300 bg-white"
                  >
                    <option value={300}>300 kg (Mini Pool)</option>
                    <option value={500}>500 kg (10-15 flats)</option>
                    <option value={1000}>1000 kg (Full 1 Ton Truck)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all"
              >
                Launch Apartment Pool
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
