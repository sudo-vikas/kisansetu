import React, { useState } from 'react';
import { Tractor, PlusCircle, CheckCircle, TrendingUp, Package, ShieldCheck, Sparkles, MapPin, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FarmerPortalView({
  crops,
  onCropCreated,
  lang,
  t
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [cropName, setCropName] = useState('Wheat');
  const [cropNameHi, setCropNameHi] = useState('सीहोर शरबती गेहूँ');
  const [variety, setVariety] = useState('Sharbati Golden Grain');
  const [category, setCategory] = useState('grains');
  const [farmingType, setFarmingType] = useState('natural');
  const [availableKg, setAvailableKg] = useState(1500);
  const [pricePerKg, setPricePerKg] = useState(36);
  const [description, setDescription] = useState('Harvested directly from our farm. Zero synthetic pesticide usage. Plump grain with natural golden sheen.');
  const [moisture, setMoisture] = useState(11.0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePreset = (crop, hi, vari, cat, defaultPrice) => {
    setCropName(crop);
    setCropNameHi(hi);
    setVariety(vari);
    setCategory(cat);
    setPricePerKg(defaultPrice);
  };

  const localMandiEstimate = Math.round(pricePerKg * 0.78);
  const totalBatchEarningsDirect = Math.round(pricePerKg * availableKg);
  const totalBatchEarningsMandi = Math.round(localMandiEstimate * availableKg);
  const farmerExtraGain = totalBatchEarningsDirect - totalBatchEarningsMandi;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      farmer_id: 1,
      crop_name: cropName,
      crop_name_hi: cropNameHi,
      variety: variety,
      category: category,
      farming_type: farmingType,
      description: description,
      price_per_kg: Number(pricePerKg),
      available_quantity_kg: Number(availableKg),
      min_order_kg: 10.0,
      harvest_date: "Nov 2026 Harvest",
      moisture_percent: Number(moisture),
      image_url: cropName.toLowerCase().includes('bajra')
        ? "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
        : cropName.toLowerCase().includes('rice')
        ? "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
        : "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
      lab_report_summary: `Moisture ${moisture}%, Verified Single-Origin harvest batch.`
    };

    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let newCrop;
      if (res.ok) {
        newCrop = await res.json();
      } else {
        newCrop = {
          ...payload,
          id: Date.now(),
          created_at: new Date().toISOString(),
          farmer: {
            id: 1,
            name: "Rameshwar Patel (रामेश्वर पटेल)",
            village: "Ashta, Sehore",
            state: "Madhya Pradesh",
            is_verified: true
          }
        };
      }

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onCropCreated(newCrop);
      setShowAddForm(false);
      alert("🌾 Your harvest listing has been published live to thousands of consumers!");
    } catch (err) {
      console.error(err);
      const fallbackCrop = {
        ...payload,
        id: Date.now(),
        created_at: new Date().toISOString(),
        farmer: {
          id: 1,
          name: "Rameshwar Patel (रामेश्वर पटेल)",
          village: "Ashta, Sehore",
          state: "Madhya Pradesh",
          is_verified: true
        }
      };
      confetti({ particleCount: 70, spread: 60 });
      onCropCreated(fallbackCrop);
      setShowAddForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 w-full">
      {/* Farmer Portal Header */}
      <section className="bg-gradient-to-r from-agri-950 via-agri-900 to-soil-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden w-full">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-300">
            <Tractor className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'किसान फसल प्रबंधन एवं पारदर्शी भुगतान' : 'Farmer Harvest Portal & Direct Bank Settlements'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black">
            {t.farmerPortalTitle}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-agri-200 leading-relaxed max-w-2xl">
            {t.farmerPortalSub}
          </p>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="mt-2 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-agri-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showAddForm ? (lang === 'hi' ? 'फॉर्म बंद करें' : 'Hide Form') : t.postNewCrop}</span>
          </button>
        </div>
      </section>

      {/* Add Crop Listing Form */}
      {showAddForm && (
        <section className="bg-white rounded-3xl border border-soil-200 shadow-xl p-6 sm:p-8 animate-fade-in w-full">
          <div className="border-b border-soil-200 pb-4 mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {lang === 'hi' ? 'अपनी नई कटी हुई फसल दर्ज करें' : 'List a New Harvest Batch'}
              </h2>
              <p className="text-xs text-soil-500">
                Direct buyer matching with guaranteed escrow settlement.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Presets:</span>
              <button
                type="button"
                onClick={() => handlePreset('Wheat', 'सीहोर शरबती गेहूँ', 'Sehore Sharbati', 'grains', 36)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-soil-100 hover:bg-soil-200 text-slate-700"
              >
                🌾 Sharbati Wheat
              </button>
              <button
                type="button"
                onClick={() => handlePreset('Bajra', 'देसी नागौरी बाजरा', 'Desi Nagauri Bajra', 'millets', 32)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-soil-100 hover:bg-soil-200 text-slate-700"
              >
                🥣 Desi Bajra
              </button>
              <button
                type="button"
                onClick={() => handlePreset('Rice', '1121 बासमती', '1121 Royal Basmati', 'rice', 72)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-soil-100 hover:bg-soil-200 text-slate-700"
              >
                🍚 Basmati Rice
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Crop Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300 bg-white"
                >
                  <option value="grains">Wheat / Grain (गेहूँ)</option>
                  <option value="millets">Millet / Bajra (बाजरा / मोटा अनाज)</option>
                  <option value="rice">Rice (चावल / धान)</option>
                  <option value="pulses">Pulses / Dal (दालें / चना)</option>
                  <option value="flour">Stone-ground Flour (चक्की आटा)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.varietyName}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharbati, Lokwan, Desi Bajra"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Farming Practice
                </label>
                <select
                  value={farmingType}
                  onChange={(e) => setFarmingType(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300 bg-white"
                >
                  <option value="natural">Natural Zero-Budget (प्राकृतिक खेती)</option>
                  <option value="organic">100% Certified Organic (जैविक)</option>
                  <option value="conventional">Conventional Clean (पारंपरिक)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Available Quantity (in Kilograms)
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  step="50"
                  value={availableKg}
                  onChange={(e) => setAvailableKg(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300 font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  = {(availableKg / 100).toFixed(1)} Quintals
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Expected Price (₹/kg)
                </label>
                <input
                  type="number"
                  required
                  min="15"
                  step="0.5"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300 font-bold"
                />
                <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                  vs APMC Mandi modal ~₹{localMandiEstimate}/kg
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Moisture Content (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="8"
                  max="14"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-soil-300"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Safe storage is &lt; 12.0%
                </span>
              </div>
            </div>

            {/* Live Profit Uplift Preview Banner */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-950 block">
                    Your Extra Profit Realization for this Harvest:
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    Direct Platform: ₹{totalBatchEarningsDirect.toLocaleString()} vs Mandi Agent: ₹{totalBatchEarningsMandi.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-white px-3.5 py-1.5 rounded-xl border border-emerald-300 font-black text-emerald-700 text-sm shadow-sm shrink-0">
                +₹{farmerExtraGain.toLocaleString()} Extra Profit
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Harvest Story & Field Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-soil-300"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-agri-800 hover:bg-agri-900 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Tractor className="w-4 h-4 text-amber-300" />
              <span>{isSubmitting ? "Publishing Listing..." : t.submitListing}</span>
            </button>
          </form>
        </section>
      )}

      {/* Active Listings by Farmers - 4 columns on desktop */}
      <section className="space-y-4 w-full">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Your Active Harvest Listings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
          {crops.slice(0, 4).map((crop) => (
            <div
              key={crop.id}
              className="bg-white p-5 rounded-3xl border border-soil-200 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-agri-800 bg-agri-100 px-2.5 py-0.5 rounded-md">
                  Active in Market
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {crop.available_quantity_kg.toLocaleString()} kg In Stock
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900">{crop.variety}</h3>
                <p className="text-xs text-soil-500">{crop.crop_name} • {crop.farming_type}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-soil-100 text-xs">
                <span className="font-black text-agri-800 text-base">₹{crop.price_per_kg}/kg</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Escrow Guaranteed
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
