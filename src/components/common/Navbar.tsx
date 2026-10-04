import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Currency, Language } from '../../types';
import {
  ShoppingBag,
  Globe,
  Fingerprint,
  Award,
  Layers,
  ShieldCheck,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    setIsCartOpen,
    currency,
    setCurrency,
    language,
    setLanguage,
    t,
    user,
    setIsBiometricModalOpen,
    setIsLoyaltyModalOpen,
    setIsTrackingOpen,
    setIsChatOpen,
    setSelectedCategory,
  } = useStore();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currencies: Currency[] = ['USD', 'THB', 'EUR', 'GBP', 'JPY', 'AUD'];
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'th', label: 'ไทย (Thai)', flag: '🇹🇭' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#E2DDD5]">
      {/* Free Freight Global Announcement Banner - Deep Khaki */}
      <div className="bg-[#373E28] text-[#F7F5F0] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#727B5A] animate-pulse" />
        <span>{t('freeShippingBanner')}</span>
      </div>

      {/* Main Top Bar (Conforming to Top Bar Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Zone: BuyThai */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveView('store');
            }}
            className="text-left group cursor-pointer focus-visible:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1F241A] group-hover:text-[#4A5335] transition-colors">
                BuyThai
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#4A5335] bg-[#EDF0E8] px-2 py-0.5 rounded border border-[#727B5A]/30 hidden sm:inline-block">
                GLOBAL
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 Clean Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#63685E]">
          <button
            onClick={() => setActiveView('store')}
            className={`transition-colors hover:text-[#1F241A] relative py-1 ${
              activeView === 'store'
                ? 'text-[#1F241A] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#4A5335]'
                : ''
            }`}
          >
            {t('storefront')}
          </button>

          <button
            onClick={() => setIsTrackingOpen(true)}
            className="transition-colors hover:text-[#1F241A] py-1 flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-[#727B5A]" />
            <span>Air Cargo Tracking</span>
          </button>

          <button
            onClick={() => setIsChatOpen(true)}
            className="transition-colors hover:text-[#1F241A] py-1 flex items-center gap-1.5"
          >
            <span>Style & Food Concierge</span>
          </button>

          <button
            onClick={() => setActiveView('admin')}
            className={`transition-colors hover:text-[#1F241A] py-1 flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'text-[#1F241A] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#4A5335]'
                : ''
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#4A5335]" />
            <span>{t('adminPortal')}</span>
          </button>

          <button
            onClick={() => setActiveView('architecture')}
            className={`transition-colors hover:text-[#1F241A] py-1 flex items-center gap-1.5 ${
              activeView === 'architecture'
                ? 'text-[#1F241A] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#4A5335]'
                : ''
            }`}
          >
            <Layers className="w-4 h-4 text-[#727B5A]" />
            <span>Architecture & Schemas</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Clusters */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              aria-label="Select Currency"
              className="text-xs font-mono font-medium bg-[#F3EFE6] border border-[#E2DDD5] rounded-lg px-2.5 py-1.5 text-[#1F241A] hover:bg-[#EFECE6] transition-colors focus:outline-none cursor-pointer"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 text-xs font-medium text-[#1F241A] hover:bg-[#EFECE6] p-1.5 rounded-lg border border-[#E2DDD5] bg-[#F3EFE6] transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#63685E]" />
              <span className="uppercase text-[11px] font-mono">{language}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#F7F5F0] rounded-xl shadow-xl border border-[#E2DDD5] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#EFECE6] transition-colors ${
                      language === l.code ? 'font-semibold text-[#4A5335] bg-[#EDF0E8]' : 'text-[#1F241A]'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span>{l.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Smile.io Loyalty Widget Trigger */}
          <button
            onClick={() => setIsLoyaltyModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-[#EDF0E8] hover:bg-[#E2DDD5]/60 text-[#373E28] border border-[#727B5A]/30 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Smile.io Rewards Club"
          >
            <Award className="w-3.5 h-3.5 text-[#4A5335]" />
            <span className="font-mono tabular-nums font-semibold">{user.points}</span>
            <span className="text-[11px] text-[#63685E] hidden md:inline">pts</span>
          </button>

          {/* Biometric Auth Quick Icon */}
          <button
            onClick={() => setIsBiometricModalOpen(true)}
            className="flex items-center text-[#63685E] hover:text-[#1F241A] p-1.5 rounded-lg hover:bg-[#EFECE6] border border-transparent hover:border-[#E2DDD5] transition-colors relative"
            title="Biometric Face ID / WebAuthn"
          >
            <Fingerprint className="w-4 h-4" />
            {user.biometricRegistered && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#4A5335] rounded-full" />
            )}
          </button>

          {/* Shopping Cart Drawer Trigger - Earthy Khaki Green */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2 rounded-lg bg-[#4A5335] hover:bg-[#373E28] text-[#F7F5F0] transition-colors cursor-pointer shadow-xs"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F3EFE6] text-[#373E28] border border-[#4A5335] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#63685E] hover:text-[#1F241A]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2DDD5] bg-[#F7F5F0] px-4 py-3 space-y-2">
          <button
            onClick={() => {
              setActiveView('store');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#1F241A] hover:text-[#4A5335]"
          >
            {t('storefront')}
          </button>
          <button
            onClick={() => {
              setIsTrackingOpen(true);
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#1F241A] hover:text-[#4A5335]"
          >
            Air Freight Tracking & Logistics
          </button>
          <button
            onClick={() => {
              setIsChatOpen(true);
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#1F241A] hover:text-[#4A5335]"
          >
            BuyThai Style & Food Concierge
          </button>
          <button
            onClick={() => {
              setActiveView('admin');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#4A5335] font-semibold"
          >
            Admin Operations Console
          </button>
          <button
            onClick={() => {
              setActiveView('architecture');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#1F241A] hover:text-[#4A5335]"
          >
            System Architecture & DB Schemas
          </button>
          <div className="pt-2 border-t border-[#E2DDD5] flex items-center justify-between text-xs text-[#63685E]">
            <span>Smile.io Rewards: {user.points} pts</span>
            <button
              onClick={() => {
                setIsLoyaltyModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-[#4A5335] font-semibold underline"
            >
              View Perks
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
