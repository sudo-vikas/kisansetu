import React, { useState } from 'react';
import { X, TrendingUp, Sparkles, ShieldCheck, ArrowRight, Check } from 'lucide-react';

export default function PriceBenefitModal({ crop, onClose, lang, t }) {
  const [weightKg, setWeightKg] = useState(100);

  if (!crop) return null;

  // Pricing benchmarks based on crop
  const isWheat = crop.crop_name.toLowerCase().includes('wheat');
  const isBajra = crop.crop_name.toLowerCase().includes('bajra');
  const isRice = crop.crop_name.toLowerCase().includes('rice');

  const mandiRate = isWheat ? 26.5 : isBajra ? 22.8 : isRice ? 48.0 : 30.0;
  const kisansetuRate = crop.price_per_kg;
  const supermarketRate = isWheat ? 54.0 : isBajra ? 48.0 : isRice ? 120.0 : 60.0;

  const farmerMandiEarnings = Math.round(mandiRate * weightKg);
  const farmerKisanSetuEarnings = Math.round(kisansetuRate * weightKg);
  const farmerExtraGain = farmerKisanSetuEarnings - farmerMandiEarnings;
  const farmerGainPct = Math.round((farmerExtraGain / farmerMandiEarnings) * 100);

  const consumerSupermarketCost = Math.round(supermarketRate * weightKg);
  const consumerKisanSetuCost = Math.round(kisansetuRate * weightKg);
  const consumerSavings = consumerSupermarketCost - consumerKisanSetuCost;
  const consumerSavingsPct = Math.round((consumerSavings / consumerSupermarketCost) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-soil-200 overflow-hidden relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-agri-900 via-agri-800 to-agri-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Fair Price Transparency Engine</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold">
            {lang === 'hi' ? `${crop.crop_name_hi || crop.crop_name} का मूल्य विश्लेषण` : `Fair Trade Analysis: ${crop.variety}`}
          </h3>
          <p className="text-xs sm:text-sm text-agri-200 mt-1">
            {t.savingsSummary}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Quantity Slider */}
          <div className="bg-soil-50 p-4 rounded-2xl border border-soil-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">
                {lang === 'hi' ? 'मात्रा चुनें (किलोग्राम)' : 'Select Harvest Batch Size (kg)'}:
              </span>
              <span className="text-lg font-black text-agri-800 bg-white px-3 py-1 rounded-xl border border-soil-200 shadow-sm">
                {weightKg} kg {weightKg >= 100 && `(${(weightKg / 100).toFixed(1)} Quintals)`}
              </span>
            </div>

            <input
              type="range"
              min="25"
              max="1000"
              step="25"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-agri-700 h-2 bg-soil-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-medium">
              <span>25 kg (Household bag)</span>
              <span>200 kg</span>
              <span>500 kg (Society pool)</span>
              <span>1000 kg (Full harvest batch)</span>
            </div>
          </div>

          {/* Dual Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Farmer Advantage Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">🌾</span>
                <span>{lang === 'hi' ? 'किसान की अतिरिक्त आय' : 'Farmer Net Realization'}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Mandi Agent Rate:</span>
                  <span className="font-semibold text-slate-700">₹{mandiRate}/kg (₹{farmerMandiEarnings.toLocaleString()})</span>
                </div>
                <div className="flex justify-between text-emerald-900 font-semibold bg-emerald-100/60 p-2 rounded-lg">
                  <span>KisanSetu Direct:</span>
                  <span className="font-black text-emerald-800">₹{kisansetuRate}/kg (₹{farmerKisanSetuEarnings.toLocaleString()})</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 flex items-baseline justify-between">
                <span className="text-xs font-bold text-emerald-800">Farmer Profit Boost:</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  +₹{farmerExtraGain.toLocaleString()} <span className="text-xs font-bold">({farmerGainPct}%)</span>
                </span>
              </div>
            </div>

            {/* Consumer Savings Card */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-3">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">🏡</span>
                <span>{lang === 'hi' ? 'उपभोक्ता की बचत' : 'Consumer Doorstep Savings'}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Supermarket Brand:</span>
                  <span className="font-semibold line-through text-slate-500">₹{supermarketRate}/kg (₹{consumerSupermarketCost.toLocaleString()})</span>
                </div>
                <div className="flex justify-between text-amber-950 font-semibold bg-amber-100/60 p-2 rounded-lg">
                  <span>KisanSetu Direct:</span>
                  <span className="font-black text-amber-900">₹{kisansetuRate}/kg (₹{consumerKisanSetuCost.toLocaleString()})</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200 flex items-baseline justify-between">
                <span className="text-xs font-bold text-amber-900">Total Money Saved:</span>
                <span className="text-xl font-extrabold text-amber-700">
                  ₹{consumerSavings.toLocaleString()} <span className="text-xs font-bold">({consumerSavingsPct}%)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block text-slate-200">Zero Middleman Spread</span>
                <span className="text-slate-400 text-[11px]">100% transparent weighing, moisture testing, and escrow payout.</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
