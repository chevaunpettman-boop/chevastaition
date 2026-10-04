import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/storefront/HeroBanner';
import { DiscoveryStrip } from './components/storefront/DiscoveryStrip';
import { ProductGrid } from './components/storefront/ProductGrid';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { SizeGuideModal } from './components/storefront/SizeGuideModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { OrderTrackingModal } from './components/storefront/OrderTrackingModal';
import { ReturnsModal } from './components/storefront/ReturnsModal';
import { LoyaltyWidget } from './components/storefront/LoyaltyWidget';
import { BiometricAuthModal } from './components/storefront/BiometricAuthModal';
import { LiveChatWidget } from './components/storefront/LiveChatWidget';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TechArchitectureView } from './components/architecture/TechArchitectureView';
import { CheckCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeView,
    notification,
    isSizeGuideOpen,
    setIsSizeGuideOpen,
    sizeGuideCategory,
  } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#1F241A] font-sans selection:bg-[#4A5335]/20 selection:text-[#1F241A]">
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeView === 'store' && (
          <>
            <HeroBanner />
            <DiscoveryStrip />
            <ProductGrid />
          </>
        )}

        {activeView === 'admin' && <AdminDashboard />}

        {activeView === 'architecture' && <TechArchitectureView />}
      </main>

      {/* Footer with Cross-Border Trust Badges & Hubs */}
      <Footer />

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={sizeGuideCategory}
      />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <ReturnsModal />
      <LoyaltyWidget />
      <BiometricAuthModal />
      <LiveChatWidget />

      {/* Toast Notification Banner - Deep Khaki & Cream */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#373E28] text-[#F7F5F0] text-xs px-4 py-3 rounded-xl shadow-2xl border border-[#4A5335] flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-4 h-4 text-[#EDF0E8] shrink-0" />
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
