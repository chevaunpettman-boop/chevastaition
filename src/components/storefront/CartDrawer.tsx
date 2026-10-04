import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  ThermometerSnowflake,
  Plane,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotalUsd,
    formatPrice,
    setIsCheckoutOpen,
    t,
  } = useStore();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD_USD = 85.0;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - cartSubtotalUsd);
  const freeShippingProgress = Math.min(100, (cartSubtotalUsd / FREE_SHIPPING_THRESHOLD_USD) * 100);
  const hasPerishableItems = cart.some((item) => item.product.isPerishable);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1F241A]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F5F0] shadow-2xl flex flex-col justify-between border-l border-[#E2DDD5]">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#E2DDD5] flex items-center justify-between bg-[#F3EFE6]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#4A5335]" />
              <h2 className="font-serif text-lg font-bold text-[#1F241A]">
                Harvest Basket ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#63685E] hover:text-[#1F241A] rounded-lg hover:bg-[#EFECE6] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-4 sm:px-6 py-3 bg-[#EFECE6] border-b border-[#E2DDD5] text-xs">
            <div className="flex items-center justify-between text-[#1F241A] font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[#4A5335]" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-[#373E28] font-semibold">
                    🎉 You unlocked Free Bangkok Air Freight!
                  </span>
                ) : (
                  <span>
                    Add {formatPrice(remainingForFreeShipping)} more for Free Air Express
                  </span>
                )}
              </span>
              <span className="font-mono text-[#63685E]">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-[#E2DDD5] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#4A5335] h-full transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="w-12 h-12 text-[#63685E]/40 mx-auto mb-3" />
                <p className="font-serif text-[#1F241A] text-base">{t('emptyCart')}</p>
                <p className="text-xs text-[#63685E] mt-1">Explore authentic Thai curry pastes, teas & organic snacks.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 bg-[#4A5335] text-[#F7F5F0] rounded-xl text-xs font-medium hover:bg-[#373E28] transition-colors"
                >
                  {t('shopNow')}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-[#F3EFE6] rounded-xl border border-[#E2DDD5]"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.nameEn}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-[#EFECE6] border border-[#E2DDD5] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#1F241A] line-clamp-1">
                          {item.product.nameEn}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#63685E] hover:text-rose-700 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#63685E] font-mono mt-0.5 flex items-center gap-1.5">
                        <span>Lot {item.product.lotNumber.split('-')[3] || 'TH'}</span>
                        {item.product.isPerishable && (
                          <span className="text-[#373E28] flex items-center gap-0.5 font-sans font-medium">
                            <ThermometerSnowflake className="w-3 h-3 text-[#727B5A]" />
                            Cold-Pack
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#E2DDD5] rounded-lg bg-[#F7F5F0]">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 text-[#63685E] hover:bg-[#EFECE6] rounded-l transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-medium text-[#1F241A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 text-[#63685E] hover:bg-[#EFECE6] rounded-r transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="text-xs font-mono font-bold text-[#1F241A] tabular-nums">
                        {formatPrice(item.product.priceUsd * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-[#F3EFE6] border-t border-[#E2DDD5] space-y-3">
              {hasPerishableItems && (
                <div className="p-2.5 bg-[#EDF0E8] rounded-xl border border-[#727B5A]/30 text-[#373E28] text-[11px] flex items-start gap-2">
                  <ThermometerSnowflake className="w-4 h-4 text-[#4A5335] shrink-0 mt-0.5" />
                  <span>
                    Basket contains cold-chain items. Shipped with insulated thermal liners and monitored dry ice.
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-[#63685E]">
                <span>{t('subtotal')}</span>
                <span className="font-mono text-sm font-bold text-[#1F241A] tabular-nums">
                  {formatPrice(cartSubtotalUsd)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#63685E]">
                <span>Duties, VAT & Air Express</span>
                <span>Calculated at Next Step</span>
              </div>

              {/* Primary Action Button: Solid Earthy Khaki Green */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3 px-4 bg-[#4A5335] hover:bg-[#373E28] text-[#F7F5F0] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#63685E] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4A5335]" />
                <span>256-bit Encrypted Checkout · PromptPay & Card Ready</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
