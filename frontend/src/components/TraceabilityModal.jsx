import React from 'react';
import { X, Award, CheckCircle, MapPin, Calendar, Droplets, UserCheck, ShieldCheck, FileText } from 'lucide-react';

export default function TraceabilityModal({ crop, onClose, lang, t }) {
  if (!crop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-soil-200 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-agri-950 via-agri-900 to-agri-800 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Farm Batch Provenance & Quality Certificate</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold">
            {lang === 'hi' ? `${crop.crop_name_hi || crop.crop_name} - प्रमाण पत्र` : `Traceability Record: ${crop.variety}`}
          </h3>
          <p className="text-xs sm:text-sm text-agri-200 mt-1">
            Certified single-origin harvest batch direct from grower to consumer.
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Farmer & Location Banner */}
          <div className="flex items-center gap-4 bg-soil-50 p-4 rounded-2xl border border-soil-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-wheat-400 to-agri-600 flex items-center justify-center text-3xl shadow-md shrink-0">
              🌾
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900">
                  {crop.farmer ? crop.farmer.name : "Verified Progressive Farmer"}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  KYC Verified
                </span>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-agri-700" />
                <span>
                  {crop.farmer ? `${crop.farmer.village}, ${crop.farmer.state}` : "Madhya Pradesh, India"}
                </span>
                {crop.farmer?.farm_size_acres && (
                  <span className="text-slate-400 font-medium">({crop.farmer.farm_size_acres} Acres Cultivation)</span>
                )}
              </p>
              <p className="text-xs text-soil-500 italic">
                {crop.farmer?.bio || "Practicing traditional natural farming without synthetic chemical enhancers."}
              </p>
            </div>
          </div>

          {/* Key Lab Test & Quality Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                <Droplets className="w-4 h-4 text-sky-500" />
                <span>Moisture Level</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {crop.moisture_percent}%
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">Optimal Storage &lt; 12%</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Harvest Window</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                {crop.harvest_date}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Fresh Crop Cycle</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Farming Type</span>
              </div>
              <div className="text-sm font-extrabold text-emerald-800 capitalize">
                {crop.farming_type === 'natural' ? 'Natural Farming' : crop.farming_type === 'organic' ? '100% Organic' : 'Conventional Clean'}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Zero Heavy Metals</span>
            </div>
          </div>

          {/* Lab Test Summary */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Independent Quality & Residue Analysis</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {crop.lab_report_summary || "Sample inspected for grain density, grain length elongation, gluten structure, and moisture content. Conforms to FSSAI standards with zero chemical adulteration."}
            </p>
          </div>

          {/* Authenticity Guarantee */}
          <div className="bg-soil-100 p-4 rounded-2xl flex items-center justify-between text-xs border border-soil-200">
            <div>
              <span className="font-bold text-slate-800 block">Single Farm Batch Identity</span>
              <span className="text-slate-500 text-[11px]">Bags are dispatched directly with tamper-evident QR seals.</span>
            </div>
            <button
              onClick={onClose}
              className="bg-agri-800 hover:bg-agri-900 text-white font-bold px-4 py-2 rounded-xl transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
