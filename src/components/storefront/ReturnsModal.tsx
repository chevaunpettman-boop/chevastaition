import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  RefreshCw,
  ThermometerSnowflake,
  Camera,
  CheckCircle2,
} from 'lucide-react';

export const ReturnsModal: React.FC = () => {
  const { isReturnsModalOpen, setIsReturnsModalOpen, orders, addAuditLog, showNotification } = useStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [selectedItemSku, setSelectedItemSku] = useState<string>('');
  const [returnReason, setReturnReason] = useState('perishable_damage');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [resolutionMessage, setResolutionMessage] = useState('');

  if (!isReturnsModalOpen) return null;

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();

    const targetItem = currentOrder?.items.find((i) => i.product.sku === selectedItemSku) || currentOrder?.items[0];
    const isPerishable = targetItem?.product.isPerishable;

    if (isPerishable) {
      setResolutionMessage(
        'Perishable Guarantee Activated: Due to food safety standards, you do not need to return the item. A $18.50 Instant SiamHarvest Store Credit voucher has been deposited into your account, and a replacement harvest pack has been queued at Bangkok Central Hub.'
      );
      addAuditLog('PERISHABLE_GUARANTEE_CLAIM_AUTO_APPROVED', `Order ${currentOrder?.id} / ${targetItem?.product.nameEn}`);
    } else {
      setResolutionMessage(
        'Return Authorized: A prepaid DHL/Thai Post international return air waybill has been generated and emailed to your address. Drop off within 30 days.'
      );
      addAuditLog('STANDARD_RETURN_WAYBILL_GENERATED', `Order ${currentOrder?.id}`);
    }

    setClaimSubmitted(true);
    showNotification('Claim processed according to cross-border food safety policy');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F241A]/70 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#F7F5F0] rounded-2xl shadow-2xl border border-[#E2DDD5] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E2DDD5] flex items-center justify-between bg-[#F3EFE6]">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-5 h-5 text-[#4A5335]" />
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1F241A]">
                Self-Service Returns & Food Quality Claims
              </h2>
              <p className="text-[11px] text-[#63685E]">
                Dedicated protocols for perishable culinary items vs ambient goods
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsReturnsModalOpen(false);
              setClaimSubmitted(false);
            }}
            className="p-1.5 text-[#63685E] hover:text-[#1F241A] rounded-lg hover:bg-[#EFECE6]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {claimSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-[#EDF0E8] text-[#373E28] rounded-full flex items-center justify-center mx-auto border border-[#727B5A]/40">
                <CheckCircle2 className="w-7 h-7 text-[#4A5335]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1F241A]">
                Claim Processed Successfully
              </h3>
              <div className="p-4 bg-[#F3EFE6] border border-[#E2DDD5] rounded-xl text-xs text-[#1F241A] leading-relaxed text-left max-w-lg mx-auto">
                {resolutionMessage}
              </div>
              <button
                onClick={() => {
                  setClaimSubmitted(false);
                  setIsReturnsModalOpen(false);
                }}
                className="mt-4 px-6 py-2.5 bg-[#4A5335] text-[#F7F5F0] rounded-xl text-xs font-semibold hover:bg-[#373E28] transition-colors"
              >
                Close & Return to Market
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitClaim} className="space-y-4">
              {/* Policy Explanation Banner */}
              <div className="p-3.5 bg-[#EDF0E8] border border-[#727B5A]/40 rounded-xl text-xs text-[#373E28] space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-4 h-4 text-[#4A5335]" />
                  <span>Fresh & Perishable Item Guarantee</span>
                </div>
                <p className="text-[11px] text-[#373E28]/90 leading-relaxed">
                  Fresh herbs, roots (galangal, lemongrass), and fresh curry pastes never need to be shipped back. Simply upload a photo of the condition, and our automated concierge issues immediate credit or replacement dispatch.
                </p>
              </div>

              {/* Order Selection */}
              <div>
                <label className="block text-xs font-medium text-[#1F241A] mb-1">
                  Select Order
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full p-2.5 bg-[#F3EFE6] border border-[#E2DDD5] rounded-xl text-xs font-medium text-[#1F241A]"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} - {o.date} ({o.items.length} items · ${o.totalUsd.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Item Selection */}
              <div>
                <label className="block text-xs font-medium text-[#1F241A] mb-1">
                  Select Item for Quality Review
                </label>
                <select
                  value={selectedItemSku}
                  onChange={(e) => setSelectedItemSku(e.target.value)}
                  className="w-full p-2.5 bg-[#F3EFE6] border border-[#E2DDD5] rounded-xl text-xs text-[#1F241A]"
                >
                  <option value="">Choose item...</option>
                  {currentOrder?.items.map((i) => (
                    <option key={i.product.sku} value={i.product.sku}>
                      {i.product.nameEn} {i.product.isPerishable ? '(Cold-Chain Fresh)' : '(Ambient)'} - Lot {i.product.lotNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-medium text-[#1F241A] mb-1">
                  Reason for Claim
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full p-2.5 bg-[#F3EFE6] border border-[#E2DDD5] rounded-xl text-xs text-[#1F241A]"
                >
                  <option value="perishable_damage">Fresh Herb Wilting / Thermal Transit Issue</option>
                  <option value="jar_damaged">Damaged Jar / Broken Packaging</option>
                  <option value="wrong_item">Incorrect Item Dispatched</option>
                  <option value="ambient_preference">Taste Preference (30-Day Return for Ambient Pantry)</option>
                </select>
              </div>

              {/* Photo Upload Simulation */}
              <div>
                <label className="block text-xs font-medium text-[#1F241A] mb-1">
                  Photo Evidence (Required for Perishables)
                </label>
                <div
                  onClick={() => setPhotoUploaded(!photoUploaded)}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    photoUploaded
                      ? 'border-[#4A5335] bg-[#EDF0E8] text-[#373E28]'
                      : 'border-[#E2DDD5] hover:border-[#727B5A] bg-[#F3EFE6] text-[#63685E]'
                  }`}
                >
                  <Camera className="w-6 h-6 mx-auto mb-1.5 text-[#4A5335]" />
                  {photoUploaded ? (
                    <div className="text-xs font-semibold text-[#373E28]">
                      ✓ Photo Attached: <span className="font-mono">condition_report_01.jpg</span>
                    </div>
                  ) : (
                    <div className="text-xs">
                      Click to attach or drag inspection photo (e.g. seal or herb condition)
                    </div>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-[#4A5335] hover:bg-[#373E28] text-[#F7F5F0] rounded-xl text-xs font-semibold shadow transition-colors cursor-pointer"
              >
                Submit Claim for Automated Instant Resolution
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
