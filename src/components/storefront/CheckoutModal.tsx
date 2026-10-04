import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { COUNTRY_TAX_RULES, calculateVolumetricWeightKg } from '../../data/warehouses';
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  AlertTriangle,
  Gift,
  Plane,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotalUsd,
    formatPrice,
    currency,
    createOrder,
    setIsTrackingOpen,
    user,
    t,
  } = useStore();

  // Form State
  const [destinationCountry, setDestinationCountry] = useState('US');
  const [street, setStreet] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('San Francisco');
  const [postalCode, setPostalCode] = useState('94107');
  const [customerName, setCustomerName] = useState(user.name);
  const [customerEmail, setCustomerEmail] = useState(user.email);
  const [customerPhone, setCustomerPhone] = useState(user.phone);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'promptpay' | 'applepay' | 'truemoney'>('promptpay');
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string>('');
  const [klaviyoOptIn, setKlaviyoOptIn] = useState(true);

  // Step-Up 2FA State
  const [is2FaStepActive, setIs2FaStepActive] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  // Calculation of taxes & duties based on country rule
  const taxRule = COUNTRY_TAX_RULES[destinationCountry] || COUNTRY_TAX_RULES.US;
  const isDutyApplicable = cartSubtotalUsd > taxRule.dutyThresholdUsd;
  const dutiesUsd = isDutyApplicable ? (cartSubtotalUsd * taxRule.dutyRatePercent) / 100 : 0;
  const vatOrSalesTaxUsd = (cartSubtotalUsd * taxRule.taxRatePercent) / 100;
  const dutiesAndTaxesUsd = dutiesUsd + vatOrSalesTaxUsd;

  // Volumetric weight calculation
  const totalPhysicalGrams = cart.reduce((acc, i) => acc + i.product.weightGrams * i.quantity, 0);
  const totalVolumetricKg = cart.reduce((acc, i) => {
    const vol = calculateVolumetricWeightKg(i.product.dimensionsCm.l, i.product.dimensionsCm.w, i.product.dimensionsCm.h);
    return acc + vol * i.quantity;
  }, 0);
  const billableWeightKg = Math.max(totalPhysicalGrams / 1000, totalVolumetricKg);

  // Air freight shipping fee (Free if cart >= $85)
  const shippingUsd = cartSubtotalUsd >= 85.0 ? 0.0 : 14.50;

  // Voucher discount
  const activeVoucher = user.savedVouchers.find((v) => v.code === selectedVoucherCode && !v.used);
  const discountUsd = activeVoucher ? activeVoucher.discountUsd : 0;

  const totalUsd = Math.max(0, cartSubtotalUsd + dutiesAndTaxesUsd + shippingUsd - discountUsd);

  const isHighRiskTransaction = totalUsd > 150;

  const handleProceedToPayment = () => {
    if (isHighRiskTransaction && !is2FaStepActive) {
      setIs2FaStepActive(true);
      return;
    }
    handleSubmitOrder();
  };

  const handleVerify2FaAndSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIs2FaStepActive(false);
      handleSubmitOrder();
    }, 1000);
  };

  const handleSubmitOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const created = createOrder({
        customerEmail,
        customerName,
        shippingCountry: destinationCountry,
        shippingAddress: { street, city, country: taxRule.countryName, postalCode },
        items: cart,
        subtotalUsd: cartSubtotalUsd,
        dutiesAndTaxesUsd,
        taxRatePercent: taxRule.taxRatePercent,
        shippingUsd,
        discountUsd,
        totalUsd,
        currency,
        paymentMethod,
        paymentStatus: 'paid',
        fulfillmentStatus: 'processing',
        originWarehouse: 'BKK-HUB',
        destinationHub: destinationCountry === 'US' ? 'LAX-FWD' : destinationCountry === 'DE' || destinationCountry === 'GB' ? 'FRA-FWD' : 'BKK-HUB',
        coldChainMonitored: cart.some((i) => i.product.coldChainRequired),
      });

      setIsProcessing(false);
      setIsCheckoutOpen(false);
      setIsTrackingOpen(true);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F241A]/75 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#F7F5F0] rounded-2xl shadow-2xl border border-[#E2DDD5] overflow-hidden my-8">
        {/* Top Header */}
        <div className="p-5 border-b border-[#E2DDD5] flex items-center justify-between bg-[#F3EFE6]">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#4A5335]" />
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1F241A]">
                Cross-Border Global Checkout
              </h2>
              <p className="text-[11px] text-[#63685E]">
                Direct export customs handling & automated duty settlement
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-[#63685E] hover:text-[#1F241A] rounded-lg hover:bg-[#EFECE6]"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-Up 2FA Overlay if triggered */}
        {is2FaStepActive ? (
          <div className="p-8 text-center max-w-md mx-auto">
            <div className="w-12 h-12 bg-[#EDF0E8] text-[#373E28] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#727B5A]/40">
              <ShieldCheck className="w-6 h-6 text-[#4A5335]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1F241A]">
              {t('stepUp2FaTitle')}
            </h3>
            <p className="text-xs text-[#63685E] mt-2 leading-relaxed">
              {t('stepUp2FaDesc')} A security token was dispatched to{' '}
              <span className="font-mono font-semibold text-[#1F241A]">{customerPhone}</span>.
            </p>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 my-6">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  defaultValue={idx === 0 ? '7' : idx === 1 ? '4' : idx === 2 ? '9' : ''}
                  className="w-10 h-12 text-center text-lg font-mono font-bold border-2 border-[#E2DDD5] rounded-xl focus:border-[#4A5335] bg-white text-[#1F241A] focus:outline-none"
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIs2FaStepActive(false)}
                className="px-4 py-2 text-xs text-[#63685E] hover:text-[#1F241A]"
              >
                Back to details
              </button>
              <button
                onClick={handleVerify2FaAndSubmit}
                disabled={isProcessing}
                className="px-6 py-2.5 bg-[#4A5335] hover:bg-[#373E28] text-[#F7F5F0] rounded-xl text-xs font-semibold shadow transition-colors flex items-center gap-2"
              >
                {isProcessing ? 'Verifying...' : 'Authorize Transaction'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E2DDD5]">
            {/* Left: Shipping & Cross-Border Customs Details */}
            <div className="p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F241A] flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#4A5335]" />
                <span>1. International Delivery Destination</span>
              </h3>

              {/* Destination Country Selector */}
              <div>
                <label className="block text-xs font-medium text-[#1F241A] mb-1">
                  Destination Country / Customs Regime
                </label>
                <select
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  className="w-full text-xs bg-[#F3EFE6] border border-[#E2DDD5] rounded-xl p-2.5 font-medium text-[#1F241A] focus:outline-none focus:ring-1 focus:ring-[#4A5335]"
                >
                  <option value="US">United States (CBP Section 321 Duty-Free &lt;$800)</option>
                  <option value="TH">Thailand (Domestic 7% VAT)</option>
                  <option value="GB">United Kingdom (HMRC 20% VAT & Phytosanitary)</option>
                  <option value="DE">Germany & EU (IOSS 19% Import VAT Cleared)</option>
                  <option value="JP">Japan (Customs Consumption Tax & MAFF)</option>
                  <option value="AU">Australia (BICON Biosecurity Clearance)</option>
                </select>
                <p className="text-[11px] text-[#63685E] mt-1">
                  Regime: <span className="font-semibold text-[#1F241A]">{taxRule.customsRegime}</span>
                </p>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#63685E] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 bg-[#F3EFE6] border border-[#E2DDD5] rounded-lg text-[#1F241A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#63685E] mb-1">Email (Klaviyo Updates)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2 bg-[#F3EFE6] border border-[#E2DDD5] rounded-lg text-[#1F241A]"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[11px] text-[#63685E] mb-1">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full p-2 bg-[#F3EFE6] border border-[#E2DDD5] rounded-lg text-[#1F241A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-[#63685E] mb-1">City / Region</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 bg-[#F3EFE6] border border-[#E2DDD5] rounded-lg text-[#1F241A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#63685E] mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full p-2 bg-[#F3EFE6] border border-[#E2DDD5] rounded-lg font-mono text-[#1F241A]"
                  />
                </div>
              </div>

              {/* Volumetric Weight Summary Box */}
              <div className="p-3 bg-[#F3EFE6] rounded-xl border border-[#E2DDD5] text-xs space-y-1">
                <div className="flex justify-between font-mono text-[11px] text-[#63685E]">
                  <span>Physical Cargo Weight:</span>
                  <span>{(totalPhysicalGrams / 1000).toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between font-mono text-[11px] text-[#63685E]">
                  <span>Volumetric Weight (L×W×H/5000):</span>
                  <span>{totalVolumetricKg.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between font-mono text-[11px] font-bold text-[#1F241A] border-t border-[#E2DDD5] pt-1">
                  <span>Billable Air Freight Weight:</span>
                  <span>{billableWeightKg.toFixed(2)} kg</span>
                </div>
              </div>

              {/* Klaviyo Lifecycle Marketing Consent */}
              <label className="flex items-center gap-2 text-xs text-[#63685E] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={klaviyoOptIn}
                  onChange={(e) => setKlaviyoOptIn(e.target.checked)}
                  className="rounded text-[#4A5335] focus:ring-[#4A5335]"
                />
                <span>Receive automated flight tracking SMS & Thai recipe cards (Klaviyo)</span>
              </label>
            </div>

            {/* Right: Payment Gateway & Order Breakdown */}
            <div className="p-6 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F241A] flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-[#4A5335]" />
                  <span>2. Payment Gateway</span>
                </h3>

                {/* Payment Selection Tabs */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'promptpay'
                        ? 'border-[#4A5335] bg-[#EDF0E8] text-[#373E28] font-semibold'
                        : 'border-[#E2DDD5] bg-[#F3EFE6] hover:bg-[#EFECE6] text-[#63685E]'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-[#4A5335]" />
                    <span>PromptPay</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#4A5335] bg-[#EDF0E8] text-[#373E28] font-semibold'
                        : 'border-[#E2DDD5] bg-[#F3EFE6] hover:bg-[#EFECE6] text-[#63685E]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#4A5335]" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('applepay')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'applepay'
                        ? 'border-[#4A5335] bg-[#EDF0E8] text-[#373E28] font-semibold'
                        : 'border-[#E2DDD5] bg-[#F3EFE6] hover:bg-[#EFECE6] text-[#63685E]'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#4A5335]" />
                    <span>Apple / Google</span>
                  </button>
                </div>

                {/* PromptPay QR Interactive View */}
                {paymentMethod === 'promptpay' && (
                  <div className="p-3.5 bg-[#373E28] text-[#F7F5F0] rounded-xl text-center space-y-2 border border-[#727B5A]/40">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#F7F5F0]">
                      <span>Thai QR Payment (พร้อมเพย์)</span>
                    </div>

                    <div className="w-36 h-36 bg-white p-2 mx-auto rounded-xl shadow flex flex-col items-center justify-center relative">
                      <div className="w-full h-full bg-[#1F241A] rounded-lg flex flex-col items-center justify-center text-white p-2">
                        <QrCode className="w-20 h-20 text-[#F7F5F0]" />
                        <span className="text-[8px] font-mono tracking-widest text-[#727B5A] mt-1">EMVCo COMPLIANT</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#EFECE6]/80 font-mono">
                      Biller ID: 0105562098124 · Ref: ORD-9041
                    </div>

                    <div className="text-xs font-bold text-[#F7F5F0] font-mono">
                      Amount: ฿{(totalUsd * 36.5).toFixed(2)} THB (${totalUsd.toFixed(2)} USD)
                    </div>

                    <p className="text-[10px] text-[#EFECE6]/70">
                      Scan using K PLUS, SCB EASY, Krungthai NEXT, or Bangkok Bank app.
                    </p>
                  </div>
                )}

                {/* Credit Card inputs */}
                {paymentMethod === 'card' && (
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-[11px] text-[#63685E] mb-1">Card Number</label>
                      <input
                        type="text"
                        defaultValue="•••• •••• •••• 4242"
                        className="w-full p-2 bg-[#F3EFE6] border border-[#E2DDD5] rounded-lg font-mono text-[#1F241A]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-[#63685E] mb-1">Expiry</label>
                        <input
                          type="text"
                          defaultValue="10/29"
                          className="w-full p-2 bg-[#F3EFE6] border border-[#E2DDD5] rounded-lg font-mono text-[#1F241A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#63685E] mb-1">CVC</label>
                        <input
                          type="text"
                          defaultValue="891"
                          className="w-full p-2 bg-[#F3EFE6] border border-[#E2DDD5] rounded-lg font-mono text-[#1F241A]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Smile.io Loyalty Voucher Redemption */}
                {user.savedVouchers.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#E2DDD5]">
                    <label className="text-[11px] font-semibold text-[#1F241A] flex items-center gap-1 mb-1">
                      <Gift className="w-3.5 h-3.5 text-[#4A5335]" />
                      <span>Apply Smile.io Rewards Voucher</span>
                    </label>
                    <select
                      value={selectedVoucherCode}
                      onChange={(e) => setSelectedVoucherCode(e.target.value)}
                      className="w-full text-xs bg-[#F3EFE6] border border-[#E2DDD5] rounded-lg p-2 text-[#1F241A]"
                    >
                      <option value="">No voucher applied</option>
                      {user.savedVouchers.map((v) => (
                        <option key={v.code} value={v.code}>
                          {v.code} - {v.description}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Order Financial Calculation Breakdown */}
              <div className="pt-3 border-t border-[#E2DDD5] space-y-1.5 text-xs text-[#63685E]">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-mono tabular-nums text-[#1F241A]">{formatPrice(cartSubtotalUsd)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Local VAT/GST & Customs ({taxRule.taxRatePercent}%)</span>
                  <span className="font-mono tabular-nums text-[#1F241A]">{formatPrice(dutiesAndTaxesUsd)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Bangkok Air Cargo Uplift</span>
                  <span className="font-mono tabular-nums">
                    {shippingUsd === 0 ? <span className="text-[#373E28] font-bold">FREE</span> : formatPrice(shippingUsd)}
                  </span>
                </div>

                {discountUsd > 0 && (
                  <div className="flex justify-between text-[#373E28] font-medium">
                    <span>Loyalty Voucher Discount</span>
                    <span className="font-mono tabular-nums">-{formatPrice(discountUsd)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-[#1F241A] border-t border-[#E2DDD5] pt-2">
                  <span>{t('total')}</span>
                  <span className="font-mono tabular-nums">{formatPrice(totalUsd)}</span>
                </div>
              </div>

              {/* Risk check indicator */}
              {isHighRiskTransaction && (
                <div className="p-2.5 bg-[#EDF0E8] border border-[#727B5A]/40 rounded-xl text-[11px] text-[#373E28] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#4A5335] shrink-0" />
                  <span>Order exceeds $150 threshold. Step-up 2FA will verify upon submission.</span>
                </div>
              )}

              {/* Final Submit Button - Earthy Khaki Green */}
              <button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="w-full py-3 bg-[#4A5335] hover:bg-[#373E28] text-[#F7F5F0] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Processing Cross-Border Settlement...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#EDF0E8]" />
                    <span>
                      Pay {formatPrice(totalUsd)} & Dispatch via BKK Hub
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
