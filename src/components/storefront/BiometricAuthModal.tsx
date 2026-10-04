import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Fingerprint, ShieldCheck, Check } from 'lucide-react';

export const BiometricAuthModal: React.FC = () => {
  const {
    isBiometricModalOpen,
    setIsBiometricModalOpen,
    user,
    setUser,
    simulateBiometricLogin,
    showNotification,
  } = useStore();

  const [isVerifying, setIsVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isBiometricModalOpen) return null;

  const handleTriggerBiometric = async () => {
    setIsVerifying(true);
    const result = await simulateBiometricLogin();
    setIsVerifying(false);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsBiometricModalOpen(false);
      }, 1200);
    }
  };

  const toggle2Fa = () => {
    setUser((prev) => ({ ...prev, stepUp2FaEnabled: !prev.stepUp2FaEnabled }));
    showNotification(`Step-Up 2FA ${!user.stepUp2FaEnabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F241A]/70 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#F7F5F0] rounded-2xl shadow-2xl border border-[#E2DDD5] overflow-hidden text-center p-6">
        <button
          onClick={() => setIsBiometricModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-[#63685E] hover:text-[#1F241A] rounded-lg hover:bg-[#EFECE6]"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Biometric Icon */}
        <div className="w-16 h-16 rounded-full bg-[#EDF0E8] text-[#4A5335] flex items-center justify-center mx-auto mb-4 border border-[#727B5A]/40 shadow-inner">
          {success ? (
            <Check className="w-8 h-8 text-[#373E28] animate-in zoom-in-50 duration-200" />
          ) : (
            <Fingerprint className={`w-8 h-8 ${isVerifying ? 'animate-pulse text-[#4A5335]' : ''}`} />
          )}
        </div>

        <h3 className="font-serif text-xl font-bold text-[#1F241A]">
          {success ? 'Identity Authenticated' : 'FIDO2 / WebAuthn Biometrics'}
        </h3>

        <p className="text-xs text-[#63685E] mt-1 max-w-xs mx-auto">
          Passkey authentication using device Face ID or Touch ID for swift checkout & fraud prevention.
        </p>

        {/* Account Info Card */}
        <div className="my-5 p-3.5 bg-[#F3EFE6] rounded-xl border border-[#E2DDD5] text-left text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#63685E]">Authenticated Account:</span>
            <span className="font-semibold text-[#1F241A]">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#63685E]">Email:</span>
            <span className="font-mono text-[#1F241A]">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#63685E]">Loyalty Status:</span>
            <span className="font-semibold text-[#4A5335]">{user.tier} ({user.points} pts)</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#E2DDD5]">
            <span className="text-[#63685E] font-medium">High-Risk Step-Up 2FA:</span>
            <button
              onClick={toggle2Fa}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold transition-colors ${
                user.stepUp2FaEnabled
                  ? 'bg-[#EDF0E8] text-[#373E28] border border-[#727B5A]/40'
                  : 'bg-[#E2DDD5] text-[#63685E]'
              }`}
            >
              {user.stepUp2FaEnabled ? 'ACTIVE (SECURE)' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Action Button - Earthy Khaki Green */}
        <button
          onClick={handleTriggerBiometric}
          disabled={isVerifying || success}
          className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow flex items-center justify-center gap-2 ${
            success
              ? 'bg-[#373E28] text-[#F7F5F0]'
              : 'bg-[#4A5335] hover:bg-[#373E28] text-[#F7F5F0]'
          }`}
        >
          {isVerifying ? (
            <span>Scanning Biometrics...</span>
          ) : success ? (
            <>
              <Check className="w-4 h-4" />
              <span>Verified via Apple Touch ID / Face ID</span>
            </>
          ) : (
            <>
              <Fingerprint className="w-4 h-4 text-[#EDF0E8]" />
              <span>Sign In with Touch ID / Face ID</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-[#63685E] mt-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4A5335]" />
          <span>FIDO2 WebAuthn cryptographic handshake</span>
        </p>
      </div>
    </div>
  );
};
