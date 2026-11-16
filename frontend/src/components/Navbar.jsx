import React from 'react';
import { ShoppingBag, Sprout, Users, ShieldCheck, Languages, Tractor, CheckCircle2 } from 'lucide-react';

export default function Navbar({
  activeView,
  setActiveView,
  lang,
  setLang,
  t,
  cartCount,
  onOpenCart
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-soil-200/60 shadow-sm transition-all w-full">
      <div className="max-w-[102rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => setActiveView('marketplace')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-agri-700 via-agri-800 to-agri-950 flex items-center justify-center shadow-md shadow-agri-900/20 group-hover:scale-105 transition-transform">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-agri-900 via-agri-700 to-wheat-700 bg-clip-text text-transparent">
                  {t.brandName}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-agri-100 text-agri-800 px-2 py-0.5 rounded-full border border-agri-300">
                  Direct F2C
                </span>
              </div>
              <p className="text-xs text-soil-500 font-medium hidden sm:block">
                {t.brandTagline}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-soil-100/70 p-1.5 rounded-2xl border border-soil-200/80">
            <button
              onClick={() => setActiveView('marketplace')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeView === 'marketplace'
                  ? 'bg-agri-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-agri-900 hover:bg-white/60'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>{t.navMarketplace}</span>
            </button>

            <button
              onClick={() => setActiveView('groupbuy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeView === 'groupbuy'
                  ? 'bg-agri-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-agri-900 hover:bg-white/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t.navGroupBuy}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-900 font-bold px-1.5 py-0.2 rounded-md">Save 70% Freight</span>
            </button>

            <button
              onClick={() => setActiveView('farmer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeView === 'farmer'
                  ? 'bg-agri-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-agri-900 hover:bg-white/60'
              }`}
            >
              <Tractor className="w-4 h-4 text-amber-500" />
              <span>{t.navFarmerPortal}</span>
            </button>

            <button
              onClick={() => setActiveView('escrow')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeView === 'escrow'
                  ? 'bg-agri-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-agri-900 hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t.navEscrow}</span>
            </button>
          </nav>

          {/* Actions: Language Toggle & Cart */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-soil-100 hover:bg-soil-200/70 border border-soil-300 text-slate-700 text-xs font-bold transition-all shadow-sm"
              title="Toggle English / हिन्दी"
            >
              <Languages className="w-4 h-4 text-agri-700" />
              <span>{lang === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-agri-700 to-agri-800 hover:from-agri-800 hover:to-agri-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-agri-900/15 hover:shadow-lg transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Basket</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-agri-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Subnav */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-soil-200 text-xs font-semibold overflow-x-auto gap-2">
          <button
            onClick={() => setActiveView('marketplace')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeView === 'marketplace' ? 'bg-agri-800 text-white' : 'text-slate-600'
            }`}
          >
            🌾 {t.navMarketplace}
          </button>
          <button
            onClick={() => setActiveView('groupbuy')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeView === 'groupbuy' ? 'bg-agri-800 text-white' : 'text-slate-600'
            }`}
          >
            🏢 {t.navGroupBuy}
          </button>
          <button
            onClick={() => setActiveView('farmer')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeView === 'farmer' ? 'bg-agri-800 text-white' : 'text-slate-600'
            }`}
          >
            🚜 {t.navFarmerPortal}
          </button>
          <button
            onClick={() => setActiveView('escrow')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeView === 'escrow' ? 'bg-agri-800 text-white' : 'text-slate-600'
            }`}
          >
            🛡️ {t.navEscrow}
          </button>
        </div>
      </div>
    </header>
  );
}
