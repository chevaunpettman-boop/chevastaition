import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Flame, Zap, Award, Tag, Ruler } from 'lucide-react';

export const DiscoveryStrip: React.FC = () => {
  const {
    activeFilterBadge,
    setActiveFilterBadge,
    setIsSizeGuideOpen,
    setSizeGuideCategory,
    selectedCategory,
  } = useStore();

  // Simulated countdown timer for flash deals
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const badgeTabs = [
    { id: 'ALL', label: 'All Curations', icon: Sparkles },
    { id: 'TRENDING', label: 'Trending in Bangkok', icon: Flame },
    { id: 'FLASH DEAL', label: 'Flash Deals (20-35% Off)', icon: Zap },
    { id: 'BESTSELLER', label: 'Top Rated Bestsellers', icon: Award },
    { id: 'ARTISAN', label: 'Handcrafted Heritage', icon: Tag },
  ];

  return (
    <div className="bg-[#F3EFE6] border-b border-[#E2DDD5] py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Flash Sale Banner & Countdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-[#C86D51] text-[#F7F5F0] text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono shrink-0 shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>FLASH SALE</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#1F241A]">
            <span className="text-[#63685E] hidden sm:inline">Bangkok Night Market Drop ends in:</span>
            <span className="font-bold bg-[#F7F5F0] border border-[#E2DDD5] px-2 py-0.5 rounded text-[#1F241A] tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Discovery Filter Badges & Size Guide Trigger */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {badgeTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilterBadge === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilterBadge(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#4A5335] text-[#F7F5F0] font-semibold shadow-xs'
                    : 'bg-[#F7F5F0] text-[#63685E] hover:text-[#1F241A] hover:bg-[#EFECE6] border border-[#E2DDD5]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F7F5F0]' : 'text-[#4A5335]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Size Guide Trigger Button */}
          <button
            onClick={() => {
              setSizeGuideCategory(selectedCategory || "Women's Fashion");
              setIsSizeGuideOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap bg-[#EDF0E8] text-[#373E28] border border-[#727B5A]/40 hover:bg-[#E2DDD5]/60 transition-colors shrink-0 cursor-pointer"
            title="Open Size Guide"
          >
            <Ruler className="w-3.5 h-3.5 text-[#4A5335]" />
            <span>Size Guide</span>
          </button>
        </div>
      </div>
    </div>
  );
};
