import React, { useState } from 'react';
import { X, Ruler, Check } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: "Women's Fashion" | "Men's Fashion" | "Footwear" | string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category }) => {
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');
  const [activeTab, setActiveTab] = useState<'apparel' | 'shoes'>(
    category === 'Footwear' ? 'shoes' : 'apparel'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F241A]/70 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#F7F5F0] rounded-2xl shadow-2xl border border-[#E2DDD5] overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-[#E2DDD5] flex items-center justify-between bg-[#F3EFE6]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#EDF0E8] rounded-xl border border-[#727B5A]/30">
              <Ruler className="w-5 h-5 text-[#4A5335]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1F241A]">
                BuyThai International Size & Fitting Guide
              </h2>
              <p className="text-[11px] text-[#63685E]">
                Accurate conversion across Asian, US, UK, and European standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#63685E] hover:text-[#1F241A] rounded-lg hover:bg-[#EFECE6]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="px-6 py-3 bg-[#EFECE6] border-b border-[#E2DDD5] flex items-center justify-between text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('apparel')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'apparel'
                  ? 'bg-[#4A5335] text-[#F7F5F0]'
                  : 'bg-[#F7F5F0] text-[#63685E] border border-[#E2DDD5]'
              }`}
            >
              Apparel (Tops & Sets)
            </button>
            <button
              onClick={() => setActiveTab('shoes')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'shoes'
                  ? 'bg-[#4A5335] text-[#F7F5F0]'
                  : 'bg-[#F7F5F0] text-[#63685E] border border-[#E2DDD5]'
              }`}
            >
              Footwear & Slides
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#F7F5F0] p-1 rounded-lg border border-[#E2DDD5]">
            <button
              onClick={() => setUnit('cm')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                unit === 'cm' ? 'bg-[#4A5335] text-white' : 'text-[#63685E]'
              }`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('inch')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                unit === 'inch' ? 'bg-[#4A5335] text-white' : 'text-[#63685E]'
              }`}
            >
              INCH
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6">
          {activeTab === 'apparel' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#F3EFE6] border-b border-[#E2DDD5] text-[#63685E] uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Size Label</th>
                    <th className="py-2.5 px-3">US / CA</th>
                    <th className="py-2.5 px-3">UK / AU</th>
                    <th className="py-2.5 px-3">EU</th>
                    <th className="py-2.5 px-3">Asia Tag</th>
                    <th className="py-2.5 px-3">Bust/Chest ({unit})</th>
                    <th className="py-2.5 px-3">Waist ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DDD5] text-[11px] text-[#1F241A]">
                  <tr className="hover:bg-[#F3EFE6]/60">
                    <td className="py-2.5 px-3 font-bold text-[#4A5335]">XS</td>
                    <td className="py-2.5 px-3">0 - 2</td>
                    <td className="py-2.5 px-3">4 - 6</td>
                    <td className="py-2.5 px-3">32 - 34</td>
                    <td className="py-2.5 px-3 font-semibold">S (Asia)</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '82 - 86' : '32 - 34"'}</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '64 - 68' : '25 - 27"'}</td>
                  </tr>
                  <tr className="hover:bg-[#F3EFE6]/60">
                    <td className="py-2.5 px-3 font-bold text-[#4A5335]">S</td>
                    <td className="py-2.5 px-3">4 - 6</td>
                    <td className="py-2.5 px-3">8 - 10</td>
                    <td className="py-2.5 px-3">36 - 38</td>
                    <td className="py-2.5 px-3 font-semibold">M (Asia)</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '86 - 92' : '34 - 36"'}</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '68 - 74' : '27 - 29"'}</td>
                  </tr>
                  <tr className="hover:bg-[#F3EFE6]/60">
                    <td className="py-2.5 px-3 font-bold text-[#4A5335]">M</td>
                    <td className="py-2.5 px-3">8 - 10</td>
                    <td className="py-2.5 px-3">12 - 14</td>
                    <td className="py-2.5 px-3">40 - 42</td>
                    <td className="py-2.5 px-3 font-semibold">L (Asia)</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '92 - 98' : '36 - 38.5"'}</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '74 - 80' : '29 - 31.5"'}</td>
                  </tr>
                  <tr className="hover:bg-[#F3EFE6]/60">
                    <td className="py-2.5 px-3 font-bold text-[#4A5335]">L</td>
                    <td className="py-2.5 px-3">12</td>
                    <td className="py-2.5 px-3">16</td>
                    <td className="py-2.5 px-3">44</td>
                    <td className="py-2.5 px-3 font-semibold">XL (Asia)</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '98 - 104' : '38.5 - 41"'}</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '80 - 86' : '31.5 - 34"'}</td>
                  </tr>
                  <tr className="hover:bg-[#F3EFE6]/60">
                    <td className="py-2.5 px-3 font-bold text-[#4A5335]">XL</td>
                    <td className="py-2.5 px-3">14</td>
                    <td className="py-2.5 px-3">18</td>
                    <td className="py-2.5 px-3">46</td>
                    <td className="py-2.5 px-3 font-semibold">XXL (Asia)</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '104 - 110' : '41 - 43.5"'}</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '86 - 92' : '34 - 36.5"'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#F3EFE6] border-b border-[#E2DDD5] text-[#63685E] uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">EU Size</th>
                    <th className="py-2.5 px-3">US Men</th>
                    <th className="py-2.5 px-3">US Women</th>
                    <th className="py-2.5 px-3">UK</th>
                    <th className="py-2.5 px-3">Japan (cm)</th>
                    <th className="py-2.5 px-3">Foot Length ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DDD5] text-[11px] text-[#1F241A]">
                  <tr className="hover:bg-[#F3EFE6]/60">
                    <td className="py-2.5 px-3 font-bold text-[#4A5335]">EU 37</td>
                    <td className="py-2.5 px-3">5</td>
                    <td className="py-2.5 px-3">6.5</td>
                    <td className="py-2.5 px-3">4</td>
                    <td className="py-2.5 px-3">23.5</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '23.5 cm' : '9.25"'}</td>
                  </tr>
                  <tr className="hover:bg-[#F3EFE6]/60">
                    <td className="py-2.5 px-3 font-bold text-[#4A5335]">EU 38</td>
                    <td className="py-2.5 px-3">6</td>
                    <td className="py-2.5 px-3">7.5</td>
                    <td className="py-2.5 px-3">5</td>
                    <td className="py-2.5 px-3">24.0</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '24.0 cm' : '9.45"'}</td>
                  </tr>
                  <tr className="hover:bg-[#F3EFE6]/60">
                    <td className="py-2.5 px-3 font-bold text-[#4A5335]">EU 39</td>
                    <td className="py-2.5 px-3">7</td>
                    <td className="py-2.5 px-3">8.5</td>
                    <td className="py-2.5 px-3">6</td>
                    <td className="py-2.5 px-3">24.5</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '24.5 cm' : '9.65"'}</td>
                  </tr>
                  <tr className="hover:bg-[#F3EFE6]/60">
                    <td className="py-2.5 px-3 font-bold text-[#4A5335]">EU 40</td>
                    <td className="py-2.5 px-3">7.5</td>
                    <td className="py-2.5 px-3">9.0</td>
                    <td className="py-2.5 px-3">6.5</td>
                    <td className="py-2.5 px-3">25.0</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '25.0 cm' : '9.85"'}</td>
                  </tr>
                  <tr className="hover:bg-[#F3EFE6]/60">
                    <td className="py-2.5 px-3 font-bold text-[#4A5335]">EU 41</td>
                    <td className="py-2.5 px-3">8.5</td>
                    <td className="py-2.5 px-3">10.0</td>
                    <td className="py-2.5 px-3">7.5</td>
                    <td className="py-2.5 px-3">26.0</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '26.0 cm' : '10.2"'}</td>
                  </tr>
                  <tr className="hover:bg-[#F3EFE6]/60">
                    <td className="py-2.5 px-3 font-bold text-[#4A5335]">EU 42</td>
                    <td className="py-2.5 px-3">9.0</td>
                    <td className="py-2.5 px-3">10.5</td>
                    <td className="py-2.5 px-3">8.0</td>
                    <td className="py-2.5 px-3">26.5</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? '26.5 cm' : '10.4"'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-5 p-3.5 bg-[#EDF0E8] border border-[#727B5A]/30 rounded-xl text-xs text-[#373E28] space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#4A5335]" />
              <span>Fitting Note for Thai Garments</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#373E28]/90">
              Thai artisanal apparel is designed with a modern relaxed drape. If you prefer a tailored fit or fall between measurements, we recommend choosing your standard Western size. All items qualify for hassle-free 30-day cross-border exchanges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
