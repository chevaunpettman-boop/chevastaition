import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Plane,
  CheckCircle2,
  Clock,
  MapPin,
  ThermometerSnowflake,
  Package,
  Bell,
  Copy,
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    activeTrackingOrder,
    orders,
    setActiveTrackingOrder,
    formatPrice,
    showNotification,
  } = useStore();

  if (!isTrackingOpen) return null;

  const currentOrder = activeTrackingOrder || orders[0];

  const handleCopyWaybill = () => {
    if (currentOrder) {
      navigator.clipboard.writeText(currentOrder.trackingNumber);
      showNotification('Air Waybill copied to clipboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F241A]/70 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#F7F5F0] rounded-2xl shadow-2xl border border-[#E2DDD5] overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-[#4A5335] flex items-center justify-between bg-[#373E28] text-[#F7F5F0]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#4A5335] rounded-xl border border-[#727B5A]/40">
              <Plane className="w-5 h-5 text-[#EDF0E8]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">
                Air Waybill Telemetry & Tracking
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#EFECE6]/80 font-mono mt-0.5">
                <span>AWB: {currentOrder?.trackingNumber}</span>
                <button
                  onClick={handleCopyWaybill}
                  className="hover:text-white p-0.5 transition-colors"
                  title="Copy Tracking Number"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsTrackingOpen(false)}
            className="p-1.5 text-[#EFECE6]/80 hover:text-white rounded-lg hover:bg-[#4A5335]"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Selector (if user has multiple orders) */}
        {orders.length > 1 && (
          <div className="bg-[#EFECE6] border-b border-[#E2DDD5] px-6 py-2 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-semibold text-[#1F241A]">Your Shipments:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveTrackingOrder(o)}
                className={`px-3 py-1 rounded-lg font-mono transition-colors ${
                  currentOrder?.id === o.id
                    ? 'bg-[#4A5335] text-[#F7F5F0] font-bold'
                    : 'bg-[#F3EFE6] text-[#1F241A] hover:bg-[#E2DDD5] border border-[#E2DDD5]'
                }`}
              >
                {o.id} ({o.fulfillmentStatus.replace('_', ' ')})
              </button>
            ))}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Status & IoT Cold Chain Monitor Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F3EFE6] rounded-xl border border-[#E2DDD5]">
              <span className="text-[11px] uppercase tracking-wider text-[#63685E] font-mono block">Status</span>
              <span className="font-serif text-base font-bold text-[#1F241A] capitalize">
                {currentOrder?.fulfillmentStatus.replace('_', ' ')}
              </span>
              <span className="text-xs text-[#63685E] block mt-0.5">
                Carrier: Thai Airways Cargo (TG692)
              </span>
            </div>

            <div className="p-4 bg-[#F3EFE6] rounded-xl border border-[#E2DDD5]">
              <span className="text-[11px] uppercase tracking-wider text-[#63685E] font-mono block">Fulfillment Route</span>
              <span className="font-mono text-sm font-bold text-[#1F241A]">
                {currentOrder?.originWarehouse} → {currentOrder?.destinationHub}
              </span>
              <span className="text-xs text-[#63685E] block mt-0.5">
                Dest: {currentOrder?.shippingCountry} ({currentOrder?.shippingAddress.city})
              </span>
            </div>

            {/* IoT Cold Chain Telemetry in Khaki Green / Sage Accent */}
            <div className="p-4 bg-[#EDF0E8] rounded-xl border border-[#727B5A]/40 text-[#373E28]">
              <span className="text-[11px] uppercase tracking-wider text-[#4A5335] font-mono flex items-center gap-1 font-semibold">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-[#4A5335]" />
                <span>IoT Cold-Chain Telemetry</span>
              </span>
              <div className="font-mono text-lg font-bold text-[#1F241A] mt-1 flex items-baseline gap-1">
                <span>{currentOrder?.coldChainTempCelsius ?? 3.4}°C</span>
                <span className="text-xs font-normal text-[#63685E]">(Target: 2°C–5°C)</span>
              </div>
              <span className="text-[11px] text-[#63685E] block mt-0.5">
                Sensitech IoT data logger verified compliant
              </span>
            </div>
          </div>

          {/* Multi-Leg Shipment Milestones */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F241A] mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#4A5335]" />
              <span>International Air Freight Timeline</span>
            </h3>

            <div className="space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-0.5 before:bg-[#E2DDD5]">
              {currentOrder?.trackingSteps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      step.completed
                        ? 'bg-[#4A5335] text-[#F7F5F0]'
                        : 'bg-[#F3EFE6] text-[#63685E] border-2 border-[#E2DDD5]'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 p-3.5 bg-[#F3EFE6] rounded-xl border border-[#E2DDD5]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-[#1F241A]">{step.status}</h4>
                      <span className="text-[11px] text-[#63685E] font-mono">{step.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#63685E] font-medium mt-1">
                      <MapPin className="w-3 h-3 text-[#4A5335]" />
                      <span>{step.location}</span>
                    </div>

                    <p className="text-xs text-[#63685E] mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items in this Air Consignment */}
          <div className="pt-4 border-t border-[#E2DDD5]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F241A] mb-3">
              Consignment Contents ({currentOrder?.items.length} SKUs)
            </h3>
            <div className="space-y-2">
              {currentOrder?.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-[#F3EFE6] rounded-xl border border-[#E2DDD5] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.nameEn}
                      className="w-10 h-10 object-cover rounded-lg bg-[#EFECE6]"
                    />
                    <div>
                      <div className="font-semibold text-[#1F241A]">{item.product.nameEn}</div>
                      <div className="text-[11px] text-[#63685E] font-mono">
                        Lot: {item.product.lotNumber} · Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#1F241A]">
                    {formatPrice(item.product.priceUsd * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Klaviyo & SMS Notification Settings */}
          <div className="p-3 bg-[#EDF0E8] rounded-xl border border-[#727B5A]/30 flex items-center justify-between text-xs text-[#373E28]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#4A5335] shrink-0" />
              <span>
                Automated flight milestone SMS dispatched to{' '}
                <span className="font-mono font-semibold text-[#1F241A]">{currentOrder?.customerEmail}</span>
              </span>
            </div>
            <span className="font-mono text-[#373E28] font-semibold uppercase text-[10px] bg-[#F7F5F0] px-2 py-0.5 rounded border border-[#727B5A]/40">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
