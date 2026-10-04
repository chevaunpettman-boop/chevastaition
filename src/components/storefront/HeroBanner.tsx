import React from 'react';
import { useStore } from '../../context/StoreContext';
import { HERO_IMAGE } from '../../data/products';
import { Search, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { searchQuery, setSearchQuery, setSelectedCategory, t } = useStore();

  const quickSearches = [
    { label: 'Silk Resortwear', category: "Women's Fashion", query: 'Silk' },
    { label: 'Kra-Jood Wicker Bags', category: 'Bags & Leather Goods', query: 'Kra-Jood' },
    { label: 'Leather Slides', category: 'Footwear', query: 'Leather' },
    { label: 'Jasmine Perfume', category: 'Beauty & Fragrances', query: 'Dok Mali' },
    { label: 'Linen Shirts', category: "Men's Fashion", query: 'Linen' },
    { label: 'Tom Yum & Teas', category: 'Thai Market & Wholefoods', query: 'Tom Yum' },
  ];

  return (
    <section className="relative overflow-hidden bg-[#373E28] text-[#F7F5F0]">
      {/* Background Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="BuyThai Global Marketplace Lifestyle and Products"
          className="w-full h-full object-cover object-center opacity-35 scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F241A] via-[#373E28]/85 to-[#373E28]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          {/* Subtle editorial kicker in Soft Khaki */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#727B5A] uppercase mb-4">
            <span className="w-6 h-px bg-[#727B5A]" />
            <span>Bangkok · Chiang Mai · Direct Cross-Border Air Cargo</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F7F5F0] leading-[1.15] text-balance">
            Curated Thai Lifestyle, Fashion & Market Goods.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#EFECE6]/90 font-light leading-relaxed max-w-2xl">
            Connecting global buyers to authentic Thai resort wear, handwoven kra-jood wicker totes, botanical agarwood perfumes, and royal project culinary treasures.
          </p>

          {/* Smart Multilingual & Phonetic Search Bar */}
          <div className="mt-8 max-w-2xl">
            <div className="relative flex items-center bg-[#F7F5F0]/95 backdrop-blur-md rounded-xl border border-[#E2DDD5] shadow-xl focus-within:border-[#4A5335] focus-within:ring-2 focus-within:ring-[#4A5335]/30 transition-all p-1.5">
              <Search className="w-5 h-5 text-[#4A5335] ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-transparent px-3 py-2 text-sm text-[#1F241A] placeholder-[#63685E] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#63685E] hover:text-[#1F241A] px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Category & Phonetic Search Tags */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#EFECE6]/80">
              <span className="font-medium text-[#EFECE6]">Trending searches:</span>
              {quickSearches.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setSelectedCategory(item.category);
                    setSearchQuery(item.query);
                  }}
                  className="hover:text-white underline underline-offset-2 transition-colors cursor-pointer text-[#F3EFE6]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 pt-6 border-t border-[#727B5A]/30 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl text-xs">
            <div>
              <div className="text-[#F7F5F0] font-mono text-xl sm:text-2xl font-bold tabular-nums">48 hrs</div>
              <div className="text-[#EFECE6]/70 mt-1">Bangkok Air Uplift to Major Global Hubs</div>
            </div>
            <div>
              <div className="text-[#F7F5F0] font-mono text-xl sm:text-2xl font-bold tabular-nums">100%</div>
              <div className="text-[#EFECE6]/70 mt-1">Authentic Thai Artisan & Customs Certified</div>
            </div>
            <div>
              <div className="text-[#F7F5F0] font-mono text-xl sm:text-2xl font-bold tabular-nums">0% Duty</div>
              <div className="text-[#EFECE6]/70 mt-1">Automated De Minimis & IOSS VAT at Checkout</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
