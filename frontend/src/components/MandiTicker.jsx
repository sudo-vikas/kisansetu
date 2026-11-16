import React from 'react';
import { TrendingUp, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function MandiTicker({ benchmarks, lang, t }) {
  if (!benchmarks || benchmarks.length === 0) return null;

  return (
    <div className="bg-agri-950 text-white text-xs border-b border-agri-800/60 overflow-hidden py-2 shadow-inner w-full">
      <div className="max-w-[102rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold text-agri-300 uppercase tracking-wider shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.liveMandiPrices}</span>
          <span className="text-[10px] bg-agri-800 text-agri-200 px-1.5 py-0.5 rounded border border-agri-700">Govt. MSP & APMC</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5 flex-1 justify-center sm:justify-start">
          {benchmarks.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 bg-agri-900/80 px-3 py-1 rounded-full border border-agri-700/50 shrink-0 hover:border-emerald-500/60 transition-colors"
            >
              <span className="font-bold text-amber-200">
                {lang === 'hi' && item.crop_name === 'Wheat' ? 'गेहूँ' : lang === 'hi' && item.crop_name === 'Bajra' ? 'बाजरा' : lang === 'hi' && item.crop_name === 'Rice' ? 'चावल' : item.crop_name}
              </span>
              <span className="text-slate-400 text-[11px]">({item.variety.split(' ')[0]})</span>
              
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-slate-400">Mandi: ₹{item.mandi_modal_price_per_kg}/kg</span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-semibold flex items-center">
                  Direct: ₹{Math.round(item.mandi_modal_price_per_kg * 1.25)}/kg
                  <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Farmers earn +25% | Direct Escrow Protected</span>
        </div>
      </div>
    </div>
  );
}
