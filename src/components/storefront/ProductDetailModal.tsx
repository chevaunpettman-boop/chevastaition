import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { calculateVolumetricWeightKg } from '../../data/warehouses';
import {
  X,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  ThermometerSnowflake,
  Package,
  MapPin,
  Warehouse,
  Wind,
  Ruler,
  Star,
  Sparkles,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    formatPrice,
    addToCart,
    setIsSizeGuideOpen,
    setSizeGuideCategory,
    t,
  } = useStore();

  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);

  // Initialize selected variants on product open
  React.useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.colors && selectedProduct.colors.length > 0) {
        setSelectedColor(selectedProduct.colors[0].name);
      } else {
        setSelectedColor('');
      }
      if (selectedProduct.sizes && selectedProduct.sizes.length > 0) {
        setSelectedSize(selectedProduct.sizes[0].size);
      } else {
        setSelectedSize('');
      }
      setQty(1);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const volumetricKg = calculateVolumetricWeightKg(
    selectedProduct.dimensionsCm.l,
    selectedProduct.dimensionsCm.w,
    selectedProduct.dimensionsCm.h
  );

  const handleAddToCart = () => {
    addToCart(selectedProduct, qty, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setSelectedProduct(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F241A]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#F7F5F0] rounded-2xl shadow-2xl border border-[#E2DDD5] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#F3EFE6] hover:bg-[#EFECE6] text-[#1F241A] transition-colors border border-[#E2DDD5]"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Sticky Image & Artisan Provenance */}
        <div className="md:w-1/2 p-6 md:p-8 bg-[#F3EFE6] border-r border-[#E2DDD5] flex flex-col justify-between">
          <div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFECE6] border border-[#E2DDD5] shadow-inner">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.nameEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              {selectedProduct.badge && (
                <div className="absolute top-3 left-3 bg-[#4A5335] text-[#F7F5F0] text-xs font-mono font-bold px-2.5 py-1 rounded-md shadow border border-[#727B5A]/40 uppercase">
                  {selectedProduct.badge}
                </div>
              )}

              {selectedProduct.isPerishable && (
                <div className="absolute bottom-3 left-3 bg-[#373E28]/95 text-[#F7F5F0] text-xs font-mono px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow border border-[#727B5A]/30">
                  <ThermometerSnowflake className="w-4 h-4 text-[#727B5A]" />
                  <span>Cold-Chain Required ({selectedProduct.storageTemp})</span>
                </div>
              )}
            </div>

            {/* Verification & Phytosanitary badge */}
            <div className="mt-4 p-3 bg-[#F7F5F0] rounded-xl border border-[#E2DDD5] text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-[#373E28]">
                <ShieldCheck className="w-4 h-4 text-[#4A5335] shrink-0" />
                <span>BuyThai Authentic Origin Guarantee</span>
              </div>
              <p className="text-[#63685E] leading-relaxed text-[11px]">
                Hand-inspected in Bangkok. Backed by verified artisan provenance and export customs declarations.
              </p>
            </div>
          </div>

          {/* Sourcing Provenance */}
          <div className="mt-6 pt-4 border-t border-[#E2DDD5] flex items-center justify-between text-xs text-[#63685E]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#4A5335]" />
              <span>Province: {selectedProduct.originProvince}, Thailand</span>
            </span>
            <span className="font-mono text-[11px]">SKU: {selectedProduct.sku}</span>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module & Interactive Variations */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-[#F7F5F0]">
          <div>
            {/* Header Lockup */}
            <div className="flex items-center justify-between text-xs text-[#63685E] mb-1">
              <div>
                <span className="text-[#4A5335] font-semibold">{selectedProduct.brand}</span>
                <span className="mx-1.5">·</span>
                <span>{selectedProduct.category}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-[#1F241A] font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-bold">{selectedProduct.rating}</span>
                <span className="text-[#63685E]">({selectedProduct.reviewCount})</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#1F241A] leading-snug">
              {selectedProduct.nameEn}
            </h2>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-thai text-base text-[#63685E] font-medium">{selectedProduct.nameTh}</span>
              <span className="text-[#63685E]/70 italic text-xs">({selectedProduct.namePhonetic})</span>
            </div>

            {/* Price & Discount */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-bold font-mono tabular-nums text-[#1F241A]">
                {formatPrice(selectedProduct.priceUsd)}
              </span>
              {selectedProduct.originalPriceUsd && (
                <span className="text-sm font-mono text-[#63685E] line-through tabular-nums">
                  {formatPrice(selectedProduct.originalPriceUsd)}
                </span>
              )}
              {selectedProduct.discountPercent && (
                <span className="text-xs font-mono font-bold text-[#C86D51] bg-[#C86D51]/10 px-2 py-0.5 rounded">
                  SAVE {selectedProduct.discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-xs sm:text-sm text-[#63685E] leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* COLOR VARIATIONS */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#E2DDD5]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#1F241A]">
                    Shade / Color: <span className="font-normal text-[#4A5335]">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                        selectedColor === c.name
                          ? 'border-[#4A5335] bg-[#EDF0E8] font-bold text-[#1F241A] shadow-xs'
                          : 'border-[#E2DDD5] bg-[#F3EFE6] text-[#63685E] hover:border-[#727B5A]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SIZE VARIATIONS & SIZE GUIDE TRIGGER */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#E2DDD5]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#1F241A]">
                    Select Size: <span className="font-normal text-[#4A5335]">{selectedSize}</span>
                  </span>
                  <button
                    onClick={() => {
                      setSizeGuideCategory(selectedProduct.category);
                      setIsSizeGuideOpen(true);
                    }}
                    className="flex items-center gap-1 text-[11px] text-[#4A5335] hover:underline font-semibold"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>International Size Converter</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((s) => (
                    <button
                      key={s.size}
                      disabled={!s.inStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                        !s.inStock
                          ? 'border-[#E2DDD5] bg-[#EFECE6] text-[#63685E]/40 line-through cursor-not-allowed'
                          : selectedSize === s.size
                          ? 'border-[#4A5335] bg-[#4A5335] text-[#F7F5F0] font-bold shadow-xs'
                          : 'border-[#E2DDD5] bg-[#F3EFE6] text-[#1F241A] hover:border-[#727B5A]'
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SCENT PROFILE VISUALIZER FOR PERFUMES & BEAUTY */}
            {selectedProduct.scentProfile && (
              <div className="mt-4 p-3.5 bg-[#F3EFE6] rounded-xl border border-[#E2DDD5] text-xs space-y-2">
                <div className="font-semibold text-[#1F241A] flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-[#4A5335]" />
                  <span>Siam Botanical Olfactory Pyramid</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-baseline">
                    <span className="w-20 font-mono text-[#63685E] shrink-0">Top Notes:</span>
                    <span className="font-semibold text-[#1F241A]">{selectedProduct.scentProfile.topNotes.join(' · ')}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-20 font-mono text-[#63685E] shrink-0">Heart Notes:</span>
                    <span className="font-semibold text-[#1F241A]">{selectedProduct.scentProfile.middleNotes.join(' · ')}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-20 font-mono text-[#63685E] shrink-0">Base Notes:</span>
                    <span className="font-semibold text-[#1F241A]">{selectedProduct.scentProfile.baseNotes.join(' · ')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Materials or Ingredients */}
            {selectedProduct.materials && (
              <div className="mt-3 p-2.5 bg-[#F3EFE6] rounded-xl border border-[#E2DDD5] text-xs">
                <span className="font-semibold text-[#1F241A]">Craft Materials: </span>
                <span className="text-[#63685E]">{selectedProduct.materials.join(', ')}</span>
              </div>
            )}

            {selectedProduct.ingredients && !selectedProduct.scentProfile && (
              <div className="mt-3 p-2.5 bg-[#F3EFE6] rounded-xl border border-[#E2DDD5] text-xs">
                <span className="font-semibold text-[#1F241A]">Aromatics & Ingredients: </span>
                <span className="text-[#63685E]">{selectedProduct.ingredients.join(', ')}</span>
              </div>
            )}

            {/* Warehouse Stock Matrix */}
            <div className="mt-3">
              <h4 className="text-[11px] font-semibold text-[#1F241A] mb-1.5 flex items-center gap-1">
                <Warehouse className="w-3 h-3 text-[#4A5335]" />
                <span>Global Hub Stock:</span>
              </h4>
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-mono">
                <div className="p-1 bg-[#F3EFE6] rounded-lg border border-[#E2DDD5]">
                  <div className="text-[9px] text-[#63685E]">BKK</div>
                  <div className="font-bold text-[#1F241A]">{selectedProduct.stockByWarehouse['BKK-HUB']}</div>
                </div>
                <div className="p-1 bg-[#F3EFE6] rounded-lg border border-[#E2DDD5]">
                  <div className="text-[9px] text-[#63685E]">CNX</div>
                  <div className="font-bold text-[#1F241A]">{selectedProduct.stockByWarehouse['CNX-DEPOT']}</div>
                </div>
                <div className="p-1 bg-[#F3EFE6] rounded-lg border border-[#E2DDD5]">
                  <div className="text-[9px] text-[#63685E]">LAX</div>
                  <div className="font-bold text-[#1F241A]">{selectedProduct.stockByWarehouse['LAX-FWD']}</div>
                </div>
                <div className="p-1 bg-[#F3EFE6] rounded-lg border border-[#E2DDD5]">
                  <div className="text-[9px] text-[#63685E]">FRA</div>
                  <div className="font-bold text-[#1F241A]">{selectedProduct.stockByWarehouse['FRA-FWD']}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Buy Action Module */}
          <div className="mt-6 pt-4 border-t border-[#E2DDD5] flex items-center gap-3">
            <div className="flex items-center border border-[#E2DDD5] rounded-xl overflow-hidden bg-[#F3EFE6]">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2.5 text-[#1F241A] hover:bg-[#EFECE6] transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-mono font-semibold text-sm text-[#1F241A]">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="p-2.5 text-[#1F241A] hover:bg-[#EFECE6] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                added
                  ? 'bg-[#373E28] text-[#F7F5F0]'
                  : 'bg-[#4A5335] hover:bg-[#373E28] text-[#F7F5F0]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('addedToCart')}</span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  <span>
                    {t('addToCart')} · {formatPrice(selectedProduct.priceUsd * qty)}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
