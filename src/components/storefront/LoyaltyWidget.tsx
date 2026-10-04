import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Award, Gift } from 'lucide-react';

export const LoyaltyWidget: React.FC = () => {
  const { isLoyaltyModalOpen, setIsLoyaltyModalOpen, user, redeemVoucher, showNotification } = useStore();

  if (!isLoyaltyModalOpen) return null;

  const redemptionOptions = [
    { points: 250, discountUsd: 5, label: '$5 Off Store Voucher' },
    { points: 500, discountUsd: 10, label: '$10 Off Store Voucher' },
    { points: 1000, discountUsd: 25, label: '$25 Off Royal Reserve Voucher' },
  ];

  const tiers = [
    { name: 'Silver', min: 0, perk: 'Earn 5 pts / $1' },
    { name: 'Gold', min: 500, perk: 'Free Cold-Pack Packaging + Priority Bangkok Uplift' },
    { name: 'Jade', min: 1500, perk: 'Personal Thai Culinary Concierge + 1.25x Points' },
    { name: 'Royal Elephant', min: 3000, perk: 'Free Express Air Freight on All Orders + 1.5x Points' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F241A]/70 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#F7F5F0] rounded-2xl shadow-2xl border border-[#E2DDD5] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#373E28] text-[#F7F5F0] flex items-center justify-between border-b border-[#4A5335]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#4A5335] border border-[#727B5A]/40 rounded-xl">
              <Award className="w-6 h-6 text-[#EDF0E8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold">SiamHarvest Rewards</h2>
                <span className="text-[10px] font-mono tracking-widest text-[#EDF0E8] uppercase bg-[#4A5335] px-2 py-0.5 rounded border border-[#727B5A]/40">
                  Smile.io Integration
                </span>
              </div>
              <p className="text-xs text-[#EFECE6]/80 mt-0.5">
                VIP Tier: <span className="font-semibold text-white">{user.tier} Member</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLoyaltyModalOpen(false)}
            className="p-1.5 text-[#EFECE6]/80 hover:text-white rounded-lg hover:bg-[#4A5335]"
            aria-label="Close rewards"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Points & Progress Box */}
        <div className="p-6 bg-[#F3EFE6] border-b border-[#E2DDD5] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#63685E] font-medium">Available Balance</span>
            <div className="text-3xl font-serif font-bold text-[#1F241A] font-mono tabular-nums">
              {user.points}{' '}
              <span className="text-sm font-sans text-[#4A5335] font-normal">points</span>
            </div>
            <p className="text-[11px] text-[#63685E] mt-0.5">
              Earn 5 points for every $1 spent across the storefront
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-[#373E28] bg-[#EDF0E8] border border-[#727B5A]/40 px-3 py-1 rounded-full inline-block">
              {user.tier} Status
            </span>
            <div className="text-[11px] text-[#63685E] mt-1 font-mono">
              Next Tier: Jade (660 pts needed)
            </div>
          </div>
        </div>

        {/* Redeem Vouchers */}
        <div className="p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F241A] flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#4A5335]" />
            <span>Redeem Rewards for Instant Checkout Discounts</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {redemptionOptions.map((opt) => {
              const canAfford = user.points >= opt.points;
              return (
                <div
                  key={opt.points}
                  className="p-3.5 bg-[#F3EFE6] border border-[#E2DDD5] rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-[#4A5335] block">
                      {opt.points} PTS
                    </span>
                    <h4 className="text-xs font-semibold text-[#1F241A] mt-1">{opt.label}</h4>
                  </div>
                  <button
                    onClick={() => redeemVoucher(opt.discountUsd, opt.points)}
                    disabled={!canAfford}
                    className={`mt-3 w-full py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
                      canAfford
                        ? 'bg-[#4A5335] hover:bg-[#373E28] text-[#F7F5F0]'
                        : 'bg-[#E2DDD5] text-[#63685E]/50 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem Code' : 'Need More Pts'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* User's Available Vouchers */}
          {user.savedVouchers.length > 0 && (
            <div className="pt-4 border-t border-[#E2DDD5]">
              <h4 className="text-xs font-semibold text-[#1F241A] mb-2">
                Your Active Discount Codes ({user.savedVouchers.length}):
              </h4>
              <div className="space-y-2">
                {user.savedVouchers.map((v, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-[#EDF0E8] border border-[#727B5A]/30 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#373E28]">{v.code}</span>
                      <span className="text-[#63685E] ml-2">({v.description})</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(v.code);
                        showNotification(`Voucher ${v.code} copied!`);
                      }}
                      className="text-[#4A5335] hover:underline text-[11px] font-semibold"
                    >
                      Copy Code
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIP Tiers Overview */}
          <div className="pt-4 border-t border-[#E2DDD5]">
            <h4 className="text-xs font-semibold text-[#1F241A] mb-2">VIP Tier Benefits</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {tiers.map((t) => (
                <div
                  key={t.name}
                  className={`p-2.5 rounded-xl border ${
                    user.tier === t.name
                      ? 'border-[#4A5335] bg-[#EDF0E8] text-[#373E28] font-medium'
                      : 'border-[#E2DDD5] bg-[#F3EFE6] text-[#63685E]'
                  }`}
                >
                  <div className="font-bold text-[11px] uppercase tracking-wider text-[#1F241A]">{t.name}</div>
                  <div className="text-[10px] text-[#63685E] font-mono mt-0.5">{t.min}+ pts</div>
                  <div className="text-[10px] mt-1 leading-snug line-clamp-2">{t.perk}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
