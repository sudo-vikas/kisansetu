import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, MapPin, Award, TrendingUp, ShoppingBag, Check, Sparkles, Sprout } from 'lucide-react';

export default function MarketplaceView({
  crops,
  stats,
  onAddToCart,
  onOpenPriceModal,
  onOpenTraceabilityModal,
  lang,
  t
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFarmingType, setSelectedFarmingType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBagSizes, setSelectedBagSizes] = useState({});

  const categories = [
    { id: 'all', label: t.allCategories, icon: '🌾' },
    { id: 'grains', label: t.wheatCategory, icon: '🌾' },
    { id: 'millets', label: t.bajraCategory, icon: '🥣' },
    { id: 'rice', label: t.riceCategory, icon: '🍚' },
    { id: 'pulses', label: t.pulsesCategory, icon: '🌱' },
    { id: 'flour', label: t.flourCategory, icon: '🥯' },
  ];

  const farmingTypes = [
    { id: 'all', label: t.allFarmingTypes },
    { id: 'natural', label: t.naturalFarming },
    { id: 'organic', label: t.organicFarming },
    { id: 'conventional', label: t.conventionalFarming },
  ];

  const filteredCrops = crops.filter(crop => {
    const matchesCat = selectedCategory === 'all' || crop.category === selectedCategory;
    const matchesType = selectedFarmingType === 'all' || crop.farming_type === selectedFarmingType;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      crop.crop_name.toLowerCase().includes(q) ||
      crop.variety.toLowerCase().includes(q) ||
      (crop.crop_name_hi && crop.crop_name_hi.toLowerCase().includes(q)) ||
      (crop.description && crop.description.toLowerCase().includes(q));
    return matchesCat && matchesType && matchesSearch;
  });

  const getBagSize = (cropId) => selectedBagSizes[cropId] || 25;

  const handleBagSizeChange = (cropId, size) => {
    setSelectedBagSizes(prev => ({ ...prev, [cropId]: size }));
  };

  return (
    <div className="space-y-8 pb-16 w-full">
      {/* Hero Section - Full width with wide grid support */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agri-950 via-agri-900 to-agri-800 text-white p-6 sm:p-10 lg:p-12 shadow-2xl w-full">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-agri-800/80 border border-agri-700/60 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'सीधा खेत से • बिना मिलावट • उचित दाम' : '100% Unadulterated • Direct Farm Gate • Escrow Protected'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-agri-100/90 leading-relaxed max-w-3xl">
            {t.heroSubtitle}
          </p>

          {/* Impact Stats Banner */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-t border-agri-800/80 text-left">
            <div>
              <div className="text-xl sm:text-3xl font-black text-amber-300">
                ₹{(stats?.farmer_extra_earnings_inr || 627600).toLocaleString()}
              </div>
              <div className="text-xs text-agri-200 font-medium">
                {lang === 'hi' ? 'किसानों की अतिरिक्त आय' : 'Farmer Extra Realization'}
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-3xl font-black text-emerald-300">
                ₹{(stats?.consumer_savings_inr || 941400).toLocaleString()}
              </div>
              <div className="text-xs text-agri-200 font-medium">
                {lang === 'hi' ? 'उपभोक्ताओं की कुल बचत' : 'Consumer Money Saved'}
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-3xl font-black text-white">
                {(stats?.total_grain_moved_kg || 78450).toLocaleString()} kg
              </div>
              <div className="text-xs text-agri-200 font-medium">
                {lang === 'hi' ? 'सफलतापूर्वक वितरित अनाज' : 'Clean Grain Dispatched'}
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-3xl font-black text-amber-200">
                100%
              </div>
              <div className="text-xs text-agri-200 font-medium">
                {lang === 'hi' ? 'एस्क्रो सुरक्षित लेन-देन' : 'Escrow Payment Trust'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="space-y-4 w-full">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-soil-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-agri-600 text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-bold text-soil-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'विधि:' : 'Method:'}
            </span>
            {farmingTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedFarmingType(type.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedFarmingType === type.id
                    ? 'bg-agri-800 text-white shadow-sm'
                    : 'bg-white border border-soil-200 text-slate-600 hover:bg-soil-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-agri-800 to-agri-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-soil-200/80 hover:bg-soil-100/60'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Crop Cards Grid - 4 Columns on XL & 2XL Desktop Screens! */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 w-full">
        {filteredCrops.map((crop) => {
          const bagSize = getBagSize(crop.id);
          const bagPrice = Math.round(crop.price_per_kg * bagSize);

          return (
            <div
              key={crop.id}
              className="bg-white rounded-3xl border border-soil-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Crop Image & Badges */}
                <div className="relative h-52 overflow-hidden bg-soil-100">
                  <img
                    src={crop.image_url}
                    alt={crop.variety}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      {crop.farming_type === 'natural' ? 'Natural' : crop.farming_type === 'organic' ? '100% Organic' : 'Conventional'}
                    </span>
                    <span className="bg-amber-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      {crop.harvest_date ? crop.harvest_date.split(' ')[0] : 'Fresh'}
                    </span>
                  </div>

                  {/* Bottom Image Overlay: Title */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs font-semibold text-amber-300">
                      {lang === 'hi' ? crop.crop_name_hi || crop.crop_name : crop.crop_name}
                    </span>
                    <h3 className="font-extrabold text-base sm:text-lg leading-snug drop-shadow-sm">
                      {crop.variety}
                    </h3>
                  </div>
                </div>

                {/* Farmer Info */}
                <div className="p-5 pb-3 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate">
                      <div className="w-6 h-6 rounded-full bg-agri-100 text-agri-800 flex items-center justify-center font-bold text-xs shrink-0">
                        🌾
                      </div>
                      <span className="truncate">{crop.farmer ? crop.farmer.name.split('(')[0] : "Verified Farmer"}</span>
                    </div>

                    <span className="flex items-center gap-1 text-slate-500 text-[11px] shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-agri-700" />
                      {crop.farmer ? `${crop.farmer.village}, ${crop.farmer.state.split(' ')[0]}` : "Madhya Pradesh"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {crop.description}
                  </p>

                  {/* Mandi vs Direct Transparency Bar */}
                  <div className="bg-soil-50 p-3 rounded-2xl border border-soil-200/80 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Direct Farm Gate:</span>
                      <span className="font-extrabold text-agri-800 text-sm">
                        ₹{crop.price_per_kg}/kg
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>Mandi: ~₹{Math.round(crop.price_per_kg * 0.78)}/kg</span>
                      <span className="text-emerald-700 font-semibold">Farmer +28%</span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>Supermarket: ~₹{Math.round(crop.price_per_kg * 1.55)}/kg</span>
                      <span className="text-amber-700 font-semibold">Save ~35%</span>
                    </div>
                  </div>

                  {/* Bag Size Selector */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Select Bag Size:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[10, 25, 50].map((size) => (
                        <button
                          key={size}
                          onClick={() => handleBagSizeChange(crop.id, size)}
                          className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                            bagSize === size
                              ? 'bg-agri-800 text-white border-agri-800 shadow-sm'
                              : 'bg-white text-slate-600 border-soil-200 hover:bg-soil-100'
                          }`}
                        >
                          {size} kg
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="p-5 pt-0 space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => onOpenPriceModal(crop)}
                    className="flex-1 py-2 px-2.5 rounded-xl border border-agri-700/30 bg-agri-50/50 hover:bg-agri-100 text-agri-900 text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-agri-700 shrink-0" />
                    <span>Price Split</span>
                  </button>

                  <button
                    onClick={() => onOpenTraceabilityModal(crop)}
                    className="flex-1 py-2 px-2.5 rounded-xl border border-soil-300 bg-white hover:bg-soil-50 text-slate-700 text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Traceability</span>
                  </button>
                </div>

                <button
                  onClick={() => onAddToCart({ ...crop, quantity_kg: bagSize, subtotal: bagPrice })}
                  className="w-full bg-agri-800 hover:bg-agri-900 active:scale-98 text-white font-bold py-3 px-4 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>Buy {bagSize} kg Bag (₹{bagPrice.toLocaleString()})</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
