import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Plus, ThermometerSnowflake, Check, Star, Sparkles, Wind } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice, addToCart, setSelectedProduct, t } = useStore();
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(
      product,
      1,
      product.colors?.[0]?.name,
      product.sizes?.[0]?.size
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'FLASH DEAL':
        return 'bg-[#C86D51] text-[#F7F5F0]';
      case 'TRENDING':
        return 'bg-[#373E28] text-[#F7F5F0]';
      case 'BESTSELLER':
        return 'bg-[#4A5335] text-[#F7F5F0]';
      case 'ARTISAN':
        return 'bg-[#727B5A] text-[#F7F5F0]';
      default:
        return 'bg-[#4A5335] text-[#F7F5F0]';
    }
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group flex flex-col bg-[#F3EFE6] border border-[#E2DDD5] rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] bg-[#EFECE6] overflow-hidden">
        <img
          src={product.image}
          alt={product.nameEn}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Dynamic Badge Tag (Flash Deal, Trending, etc.) */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs ${getBadgeStyle(
                product.badge
              )}`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Cold-Chain Indicator */}
        {product.isPerishable && (
          <div className="absolute bottom-2.5 left-2.5 bg-[#373E28]/95 backdrop-blur-sm text-[#F7F5F0] text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 shadow-xs border border-[#727B5A]/40">
            <ThermometerSnowflake className="w-3 h-3 text-[#727B5A]" />
            <span>{product.storageTemp?.split(' ')[0]}</span>
          </div>
        )}

        {/* Scent Profile Indicator */}
        {product.scentProfile && (
          <div className="absolute bottom-2.5 left-2.5 bg-[#F7F5F0]/95 backdrop-blur-sm text-[#373E28] text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 shadow-xs border border-[#E2DDD5]">
            <Wind className="w-3 h-3 text-[#4A5335]" />
            <span>Fragrance Notes</span>
          </div>
        )}

        {/* Quick Add Floating Button */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-2.5 right-2.5 p-2 rounded-lg shadow-md transition-all ${
            justAdded
              ? 'bg-[#373E28] text-[#F7F5F0]'
              : 'bg-[#4A5335] hover:bg-[#373E28] text-[#F7F5F0] hover:scale-105'
          }`}
          title={t('addToCart')}
          aria-label={t('addToCart')}
        >
          {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Product Information Body */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Metadata & Subcategory Bar */}
          <div className="flex items-center justify-between text-[11px] text-[#63685E] mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-[#4A5335] uppercase tracking-wider">{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{product.originProvince}</span>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-0.5 text-[#1F241A] font-mono shrink-0">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="font-bold text-[11px]">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Primary Name */}
          <h3 className="font-semibold text-[#1F241A] text-sm leading-snug group-hover:text-[#4A5335] transition-colors line-clamp-1">
            {product.nameEn}
          </h3>

          {/* Thai Script and Phonetic Reading */}
          <div className="mt-0.5 flex items-baseline gap-1.5 text-xs truncate">
            <span className="font-thai text-[#63685E] font-medium text-[11px]">{product.nameTh}</span>
            <span className="text-[#63685E]/70 font-serif italic text-[10px]">({product.namePhonetic})</span>
          </div>

          {/* Color Swatches if available */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  className="w-3.5 h-3.5 rounded-full border border-[#E2DDD5] shadow-2xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              <span className="text-[10px] text-[#63685E] font-mono ml-1">
                {product.colors.length} shades
              </span>
            </div>
          )}

          {/* Scent notes summary if available */}
          {product.scentProfile && (
            <div className="mt-1.5 text-[10px] text-[#63685E] line-clamp-1 italic font-serif">
              Notes: {product.scentProfile.topNotes.slice(0, 2).join(', ')} & {product.scentProfile.baseNotes[0]}
            </div>
          )}

          {/* Short description for market items without colors */}
          {!product.colors && !product.scentProfile && (
            <p className="mt-1 text-[11px] text-[#63685E] line-clamp-1 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Bottom Price & Sales Velocity Row */}
        <div className="pt-2 border-t border-[#E2DDD5]/80 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold font-mono tabular-nums text-[#1F241A]">
              {formatPrice(product.priceUsd)}
            </span>
            {product.originalPriceUsd && (
              <span className="text-xs font-mono text-[#63685E] line-through tabular-nums">
                {formatPrice(product.originalPriceUsd)}
              </span>
            )}
            {product.discountPercent && (
              <span className="text-[10px] font-mono font-bold text-[#C86D51]">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          <div className="text-[10px] text-[#63685E] font-mono">
            {product.salesCount > 1000
              ? `${(product.salesCount / 1000).toFixed(1)}k sold`
              : `${product.salesCount} sold`}
          </div>
        </div>
      </div>
    </div>
  );
};
