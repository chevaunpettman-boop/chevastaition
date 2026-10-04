import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { DietaryTag, SpiceLevel, ProductCategory } from '../../types';
import { Filter, X, ThermometerSnowflake, Flame, Sparkles } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    products,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDietary,
    toggleDietary,
    selectedSpice,
    setSelectedSpice,
    onlyPerishable,
    setOnlyPerishable,
    activeFilterBadge,
    resetFilters,
    t,
  } = useStore();

  const categories: { id: string; labelKey: string }[] = [
    { id: 'All', labelKey: 'allCategories' },
    { id: "Women's Fashion", labelKey: 'womensFashion' },
    { id: "Men's Fashion", labelKey: 'mensFashion' },
    { id: 'Bags & Leather Goods', labelKey: 'bagsLeather' },
    { id: 'Footwear', labelKey: 'footwear' },
    { id: 'Beauty & Fragrances', labelKey: 'beautyFragrances' },
    { id: 'Thai Market & Wholefoods', labelKey: 'thaiMarket' },
  ];

  const dietaryTags: DietaryTag[] = ['halal', 'vegan', 'gluten-free', 'organic'];

  // Smart multi-language & phonetic search filtering
  const filteredProducts = products.filter((prod) => {
    // 1. Category check
    if (selectedCategory !== 'All' && prod.category !== selectedCategory) {
      return false;
    }

    // 2. Active Badge check (TRENDING, FLASH DEAL, BESTSELLER, ARTISAN)
    if (activeFilterBadge !== 'ALL') {
      if (prod.badge !== activeFilterBadge) {
        return false;
      }
    }

    // 3. Perishable cold-chain check
    if (onlyPerishable && !prod.isPerishable) {
      return false;
    }

    // 4. Spice check (for wholefoods)
    if (selectedSpice !== null && prod.spiceLevel !== selectedSpice) {
      return false;
    }

    // 5. Dietary check (for wholefoods)
    if (selectedDietary.length > 0) {
      if (!prod.dietary) return false;
      const hasAll = selectedDietary.every((tag) => prod.dietary?.includes(tag));
      if (!hasAll) return false;
    }

    // 6. Multilingual & phonetic text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().replace(/[\s-]/g, '');
      const nameEn = prod.nameEn.toLowerCase().replace(/[\s-]/g, '');
      const nameTh = prod.nameTh.toLowerCase().replace(/[\s-]/g, '');
      const namePhonetic = prod.namePhonetic.toLowerCase().replace(/[\s-]/g, '');
      const brand = prod.brand.toLowerCase().replace(/[\s-]/g, '');
      const subcategory = prod.subcategory.toLowerCase().replace(/[\s-]/g, '');
      const materials = (prod.materials || []).join(' ').toLowerCase();
      const ingredients = (prod.ingredients || []).join(' ').toLowerCase();

      const matches =
        nameEn.includes(query) ||
        nameTh.includes(query) ||
        namePhonetic.includes(query) ||
        brand.includes(query) ||
        subcategory.includes(query) ||
        materials.includes(query) ||
        ingredients.includes(searchQuery.toLowerCase());

      if (!matches) return false;
    }

    return true;
  });

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'All' ||
    activeFilterBadge !== 'ALL' ||
    selectedDietary.length > 0 ||
    selectedSpice !== null ||
    onlyPerishable;

  const isWholefoodsCategory =
    selectedCategory === 'All' || selectedCategory === 'Thai Market & Wholefoods';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2DDD5] pb-4 mb-6 gap-2">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1F241A] tracking-tight">
            {selectedCategory === 'All' ? 'BuyThai Marketplace Collections' : selectedCategory}
          </h2>
          <p className="text-xs text-[#63685E] mt-1">
            Displaying {filteredProducts.length} verified authentic Thai lifestyle & market items
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="self-start sm:self-auto flex items-center gap-1 text-xs text-[#63685E] hover:text-[#1F241A] bg-[#F3EFE6] hover:bg-[#EFECE6] border border-[#E2DDD5] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Main 6 Categories Navigation Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#4A5335] text-[#F7F5F0] shadow-xs font-semibold'
                : 'bg-[#F3EFE6] text-[#63685E] hover:bg-[#EFECE6] hover:text-[#1F241A] border border-[#E2DDD5]'
            }`}
          >
            {t(cat.labelKey)}
          </button>
        ))}
      </div>

      {/* Contextual Filters: Show Dietary/Spice only if viewing Wholefoods or All */}
      {isWholefoodsCategory && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-[#F3EFE6] rounded-xl border border-[#E2DDD5] mb-8 text-xs">
          {/* Dietary preferences */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#1F241A] mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#4A5335]" />
              <span>{t('filterDietary')}:</span>
            </span>
            {dietaryTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleDietary(tag)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors font-medium cursor-pointer ${
                  selectedDietary.includes(tag)
                    ? 'bg-[#4A5335] text-[#F7F5F0] font-semibold shadow-xs'
                    : 'bg-[#F7F5F0] border border-[#E2DDD5] text-[#63685E] hover:border-[#727B5A]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Spice Level & Cold-Chain Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#373E28]" />
              <select
                value={selectedSpice !== null ? selectedSpice : ''}
                onChange={(e) =>
                  setSelectedSpice(e.target.value === '' ? null : (Number(e.target.value) as SpiceLevel))
                }
                aria-label="Filter by Spice Level"
                className="bg-[#F7F5F0] border border-[#E2DDD5] text-[#1F241A] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="">All Spice Levels</option>
                <option value="0">0 - Non-Spicy</option>
                <option value="1">1 - Mild 🌶️</option>
                <option value="2">2 - Medium 🌶️🌶️</option>
                <option value="3">3 - Hot 🌶️🌶️🌶️</option>
                <option value="4">4 - Thai Spicy 🌶️🌶️🌶️🌶️</option>
              </select>
            </div>

            <button
              onClick={() => setOnlyPerishable(!onlyPerishable)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                onlyPerishable
                  ? 'bg-[#373E28] text-[#F7F5F0] border-[#373E28]'
                  : 'bg-[#F7F5F0] border-[#E2DDD5] text-[#1F241A] hover:border-[#727B5A]'
              }`}
            >
              <ThermometerSnowflake className={`w-3.5 h-3.5 ${onlyPerishable ? 'text-[#727B5A]' : 'text-[#4A5335]'}`} />
              <span>{t('filterPerishable')}</span>
            </button>
          </div>
        </div>
      )}

      {/* High-Density Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-[#F3EFE6] rounded-2xl border border-dashed border-[#E2DDD5]">
          <p className="font-serif text-lg text-[#1F241A]">No BuyThai items match your filter criteria.</p>
          <p className="text-xs text-[#63685E] mt-2">
            Try switching category or search for keywords like "Linen", "Kra-Jood", "Jasmine", or "Tom Yum".
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-[#4A5335] text-[#F7F5F0] rounded-xl hover:bg-[#373E28] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
};
