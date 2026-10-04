import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Shield, Plane, ThermometerSnowflake, FileCheck, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setIsReturnsModalOpen, setIsTrackingOpen, setIsLoyaltyModalOpen } = useStore();

  return (
    <footer className="bg-[#373E28] text-[#EFECE6] border-t border-[#4A5335] mt-20 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-[#4A5335]/70">
          <div className="flex items-start gap-3">
            <Plane className="w-5 h-5 text-[#EDF0E8] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[#F7F5F0] font-medium text-xs uppercase tracking-wider">Direct Air Cargo</h4>
              <p className="text-xs text-[#EFECE6]/80 mt-1">
                Dispatched via daily Thai Airways & partner wide-body flights from Bangkok Suvarnabhumi (BKK).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ThermometerSnowflake className="w-5 h-5 text-[#EDF0E8] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[#F7F5F0] font-medium text-xs uppercase tracking-wider">Cold-Chain Assurance</h4>
              <p className="text-xs text-[#EFECE6]/80 mt-1">
                Active temperature IoT loggers and food-grade cryogenic packs for fresh herbs & curry pastes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-[#EDF0E8] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[#F7F5F0] font-medium text-xs uppercase tracking-wider">Phytosanitary DOA Certified</h4>
              <p className="text-xs text-[#EFECE6]/80 mt-1">
                Every batch certified by Thailand Dept of Agriculture and cleared through US FDA / EU IOSS regimes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#EDF0E8] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[#F7F5F0] font-medium text-xs uppercase tracking-wider">PDPA & GDPR Protected</h4>
              <p className="text-xs text-[#EFECE6]/80 mt-1">
                End-to-end AES-256 encrypted personal data in strict compliance with Thai PDPA Act B.E. 2562.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#4A5335]/70 text-xs">
          <div>
            <h5 className="text-[#F7F5F0] font-semibold mb-3 tracking-wide">Fulfillment Network</h5>
            <ul className="space-y-2 text-[#EFECE6]/80">
              <li>Bangkok Suvarnabhumi Hub (BKK)</li>
              <li>Chiang Mai Northern Depot (CNX)</li>
              <li>Los Angeles Forward Hub (LAX)</li>
              <li>Frankfurt am Main Depot (FRA)</li>
            </ul>
          </div>

          <div>
            <h5 className="text-[#F7F5F0] font-semibold mb-3 tracking-wide">Customer Operations</h5>
            <ul className="space-y-2 text-[#EFECE6]/80">
              <li>
                <button onClick={() => setIsTrackingOpen(true)} className="hover:text-white transition-colors">
                  Air Cargo Tracking
                </button>
              </li>
              <li>
                <button onClick={() => setIsReturnsModalOpen(true)} className="hover:text-white transition-colors flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-[#EDF0E8]" />
                  <span>Returns & Perishable Claims</span>
                </button>
              </li>
              <li>
                <button onClick={() => setIsLoyaltyModalOpen(true)} className="hover:text-white transition-colors">
                  Smile.io Rewards & VIP Tiers
                </button>
              </li>
              <li>
                <span className="text-[#EFECE6]/60">Volumetric Weight Standard (L×W×H/5000)</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[#F7F5F0] font-semibold mb-3 tracking-wide">Security & Verification</h5>
            <ul className="space-y-2 text-[#EFECE6]/80">
              <li>WebAuthn Biometric Passkeys</li>
              <li>Step-Up 2FA Verification (&gt;$150)</li>
              <li>PromptPay EMVCo QR Dynamic Payload</li>
              <li>Automated Duty & IOSS Calculations</li>
            </ul>
          </div>

          <div>
            <h5 className="text-[#F7F5F0] font-semibold mb-3 tracking-wide">Engineering & Platform</h5>
            <ul className="space-y-2 text-[#EFECE6]/80">
              <li>
                <button onClick={() => setActiveView('admin')} className="hover:text-white transition-colors">
                  Operations Console (RBAC)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('architecture')} className="hover:text-white transition-colors">
                  Technical Architecture & Schemas
                </button>
              </li>
              <li>Klaviyo Lifecycle Webhooks</li>
              <li>PostgreSQL High-Concurrency Schema</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EFECE6]/70 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#F7F5F0]">SiamHarvest Global</span>
            <span>·</span>
            <span>Export License #TH-EXP-2026-8801</span>
            <span>·</span>
            <span>DBD Registered (Thailand)</span>
          </div>

          <div className="text-[#EFECE6]/80">
            Exporting authentic Thai pantry, spices, and fresh herbs to 48+ countries worldwide.
          </div>
        </div>
      </div>
    </footer>
  );
};
