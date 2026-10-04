import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Language,
  Currency,
  UserAccount,
  Order,
  AdminRole,
  DietaryTag,
  SpiceLevel,
  AuditLogEntry,
} from '../types';
import { SAMPLE_PRODUCTS } from '../data/products';
import { CURRENCY_RATES, COUNTRY_TAX_RULES } from '../data/warehouses';
import { TRANSLATIONS } from '../data/translations';

interface StoreContextType {
  // Navigation & Views
  activeView: 'store' | 'admin' | 'architecture';
  setActiveView: (view: 'store' | 'admin' | 'architecture') => void;

  // Localization & Currency
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
  formatPrice: (amountInUsd: number) => string;

  // Catalog & Inventory
  products: Product[];
  updateProductStock: (productId: string, warehouseCode: 'BKK-HUB' | 'CNX-DEPOT' | 'LAX-FWD' | 'FRA-FWD', newStock: number) => void;

  // Filters & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedDietary: DietaryTag[];
  toggleDietary: (tag: DietaryTag) => void;
  selectedSpice: SpiceLevel | null;
  setSelectedSpice: (spice: SpiceLevel | null) => void;
  onlyPerishable: boolean;
  setOnlyPerishable: (perishable: boolean) => void;
  resetFilters: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalUsd: number;

  // Modals & Overlays
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  isBiometricModalOpen: boolean;
  setIsBiometricModalOpen: (open: boolean) => void;
  isReturnsModalOpen: boolean;
  setIsReturnsModalOpen: (open: boolean) => void;
  isLoyaltyModalOpen: boolean;
  setIsLoyaltyModalOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  sizeGuideCategory: string;
  setSizeGuideCategory: (cat: string) => void;
  activeFilterBadge: string;
  setActiveFilterBadge: (badge: string) => void;

  // User & Loyalty
  user: UserAccount;
  setUser: React.Dispatch<React.SetStateAction<UserAccount>>;
  redeemVoucher: (discountUsd: number, requiredPoints: number) => boolean;
  simulateBiometricLogin: () => Promise<boolean>;

  // Orders & Logistics
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'trackingNumber' | 'trackingSteps'>) => Order;

  // RBAC & Operations
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, resource: string, status?: 'SUCCESS' | 'WARNING' | 'DENIED') => void;

  // Notifications
  notification: string | null;
  showNotification: (msg: string) => void;
}

const INITIAL_USER: UserAccount = {
  id: 'usr-th-99124',
  name: 'Chevaun Pettman',
  email: 'chevaun.pettman@gmail.com',
  phone: '+1 (415) 882-9014',
  country: 'US',
  points: 840,
  tier: 'Gold',
  biometricRegistered: true,
  stepUp2FaEnabled: true,
  savedVouchers: [
    { code: 'SIAMGOLD10', discountUsd: 10, description: '$10 Off on Orders > $60', used: false },
    { code: 'FREESHIPBKK', discountUsd: 15, description: 'Air Freight Shipping Waiver', used: false },
  ],
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-9041',
    date: '2026-10-02',
    customerName: 'Chevaun Pettman',
    customerEmail: 'chevaun.pettman@gmail.com',
    shippingCountry: 'US',
    shippingAddress: {
      street: '742 Evergreen Terrace',
      city: 'San Francisco, CA',
      country: 'United States',
      postalCode: '94107',
    },
    items: [
      { product: SAMPLE_PRODUCTS[0], quantity: 2 },
      { product: SAMPLE_PRODUCTS[2], quantity: 1 },
      { product: SAMPLE_PRODUCTS[1], quantity: 2 },
    ],
    subtotalUsd: 76.50,
    dutiesAndTaxesUsd: 5.74,
    taxRatePercent: 7.5,
    shippingUsd: 12.00,
    discountUsd: 10.00,
    totalUsd: 84.24,
    currency: 'USD',
    paymentMethod: 'promptpay',
    paymentStatus: 'paid',
    fulfillmentStatus: 'in_transit',
    trackingNumber: 'TH-BKK-TG692-9041',
    originWarehouse: 'BKK-HUB',
    destinationHub: 'LAX-FWD',
    coldChainMonitored: true,
    coldChainTempCelsius: 3.4,
    trackingSteps: [
      {
        status: 'Order Verified & Packed',
        timestamp: '2026-10-02 09:15 BKK',
        location: 'Bangkok Suvarnabhumi Export Hub',
        description: 'Packed with food-grade dry ice packs and phytosanitary certificate seal.',
        completed: true,
      },
      {
        status: 'Phytosanitary DOA Clearance',
        timestamp: '2026-10-02 14:30 BKK',
        location: 'Bangkok Customs Air Cargo Terminal',
        description: 'Passed Dept of Agriculture inspection (Export Permit #DOA-TH-98231).',
        completed: true,
      },
      {
        status: 'Air Cargo Departure (Thai Airways TG692)',
        timestamp: '2026-10-03 01:45 BKK',
        location: 'Suvarnabhumi Airport (BKK)',
        description: 'Flight en route to Los Angeles International Airport (LAX). Continuous temp log: 3.4°C.',
        completed: true,
      },
      {
        status: 'US CBP Customs & FDA Biosecurity Clearance',
        timestamp: '2026-10-03 21:10 PST',
        location: 'LAX Cargo Hub, Los Angeles',
        description: 'Cleared US Customs Section 321 entry. Transferred to express last-mile carrier.',
        completed: false,
      },
      {
        status: 'Out for Courier Delivery',
        timestamp: 'Pending',
        location: 'San Francisco Local Distribution Center',
        description: 'Scheduled for climate-controlled refrigerated van dispatch.',
        completed: false,
      },
    ],
  },
  {
    id: 'ORD-2026-8910',
    date: '2026-09-28',
    customerName: 'Chevaun Pettman',
    customerEmail: 'chevaun.pettman@gmail.com',
    shippingCountry: 'US',
    shippingAddress: {
      street: '742 Evergreen Terrace',
      city: 'San Francisco, CA',
      country: 'United States',
      postalCode: '94107',
    },
    items: [
      { product: SAMPLE_PRODUCTS[3], quantity: 2 },
      { product: SAMPLE_PRODUCTS[4], quantity: 1 },
    ],
    subtotalUsd: 62.50,
    dutiesAndTaxesUsd: 4.69,
    taxRatePercent: 7.5,
    shippingUsd: 0.00,
    discountUsd: 0.00,
    totalUsd: 67.19,
    currency: 'USD',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    trackingNumber: 'TH-BKK-TG692-8910',
    originWarehouse: 'BKK-HUB',
    destinationHub: 'LAX-FWD',
    coldChainMonitored: false,
    trackingSteps: [
      {
        status: 'Order Delivered Successfully',
        timestamp: '2026-10-01 11:22 PST',
        location: 'San Francisco, CA',
        description: 'Signature received by customer.',
        completed: true,
      },
    ],
  },
];

const INITIAL_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-10492',
    timestamp: '2026-10-04 10:35:12',
    actorEmail: 'admin@siamharvest.com',
    role: 'super_admin',
    action: 'INVENTORY_CYCLE_COUNT_APPROVED',
    resource: 'Warehouse BKK-HUB / Lot LOT-TH-2026-BKK-084',
    ipAddress: '203.144.144.168',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-10491',
    timestamp: '2026-10-04 09:12:45',
    actorEmail: 'logistics@siamharvest.com',
    role: 'logistics_manager',
    action: 'AIR_WAYBILL_MANIFEST_GEN',
    resource: 'Shipment TH-BKK-TG692-9041 (Flight TG692)',
    ipAddress: '171.96.220.10',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-10490',
    timestamp: '2026-10-04 08:44:03',
    actorEmail: 'support@siamharvest.com',
    role: 'support_lead',
    action: 'PERISHABLE_REPLACEMENT_CREDIT',
    resource: 'Order ORD-2026-8804 (Damaged Lemongrass)',
    ipAddress: '110.168.21.5',
    status: 'SUCCESS',
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeView, setActiveView] = useState<'store' | 'admin' | 'architecture'>('store');

  // Localization & Currency
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');

  // Products
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel | null>(null);
  const [onlyPerishable, setOnlyPerishable] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    // initial sample cart item for instant delight
    return [
      { product: SAMPLE_PRODUCTS[0], quantity: 1 },
      { product: SAMPLE_PRODUCTS[1], quantity: 1 },
    ];
  });

  // Modals & Overlays
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(INITIAL_ORDERS[0]);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [isReturnsModalOpen, setIsReturnsModalOpen] = useState(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState("Women's Fashion");
  const [activeFilterBadge, setActiveFilterBadge] = useState('ALL');

  // User & RBAC
  const [user, setUser] = useState<UserAccount>(INITIAL_USER);
  const [adminRole, setAdminRole] = useState<AdminRole>('super_admin');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_LOGS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Notifications
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const addAuditLog = (action: string, resource: string, status: 'SUCCESS' | 'WARNING' | 'DENIED' = 'SUCCESS') => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorEmail: adminRole === 'super_admin' ? 'admin@siamharvest.com' : 'operator@siamharvest.com',
      role: adminRole,
      action,
      resource,
      ipAddress: '203.144.144.168',
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const formatPrice = (amountInUsd: number): string => {
    const currData = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    const converted = amountInUsd * currData.rateFromUsd;
    if (currency === 'THB' || currency === 'JPY') {
      return `${currData.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currData.symbol}${converted.toFixed(2)}`;
  };

  const toggleDietary = (tag: DietaryTag) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDietary([]);
    setSelectedSpice(null);
    setOnlyPerishable(false);
    setActiveFilterBadge('ALL');
  };

  const addToCart = (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity, selectedColor, selectedSize }];
    });
    showNotification(`Added ${product.nameEn} to your BuyThai shopping bag`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotalUsd = cart.reduce((acc, item) => acc + item.product.priceUsd * item.quantity, 0);

  const updateProductStock = (
    productId: string,
    warehouseCode: 'BKK-HUB' | 'CNX-DEPOT' | 'LAX-FWD' | 'FRA-FWD',
    newStock: number
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            stockByWarehouse: {
              ...prod.stockByWarehouse,
              [warehouseCode]: Math.max(0, newStock),
            },
          };
        }
        return prod;
      })
    );
    addAuditLog('STOCK_LEVEL_OVERRIDE', `Product ${productId} at ${warehouseCode} updated to ${newStock}`);
    showNotification(`Stock updated for ${warehouseCode}`);
  };

  const redeemVoucher = (discountUsd: number, requiredPoints: number): boolean => {
    if (user.points < requiredPoints) {
      showNotification(`Insufficient points. You need ${requiredPoints} pts.`);
      return false;
    }
    setUser((prev) => ({
      ...prev,
      points: prev.points - requiredPoints,
      savedVouchers: [
        ...prev.savedVouchers,
        {
          code: `REWARD${discountUsd}_${Math.floor(100 + Math.random() * 900)}`,
          discountUsd,
          description: `$${discountUsd} Off Voucher (Redeemed with ${requiredPoints} pts)`,
          used: false,
        },
      ],
    }));
    showNotification(`Successfully redeemed $${discountUsd} voucher!`);
    return true;
  };

  const simulateBiometricLogin = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser((prev) => ({ ...prev, biometricRegistered: true }));
        showNotification('Touch ID / Face ID verified successfully via WebAuthn');
        resolve(true);
      }, 900);
    });
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'trackingNumber' | 'trackingSteps'>): Order => {
    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNum = `TH-BKK-TG692-${orderId.split('-')[2]}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      trackingNumber: trackingNum,
      coldChainMonitored: orderData.items.some((i) => i.product.coldChainRequired),
      coldChainTempCelsius: orderData.items.some((i) => i.product.coldChainRequired) ? 3.6 : undefined,
      trackingSteps: [
        {
          status: 'Order Placed & Payment Confirmed',
          timestamp: `${new Date().toLocaleTimeString()} BKK`,
          location: 'Bangkok Logistics Gateway',
          description: `Payment authenticated via ${orderData.paymentMethod}. Routed to nearest fulfillment center.`,
          completed: true,
        },
        {
          status: 'Phytosanitary & Export Customs Check',
          timestamp: 'Scheduled Today',
          location: 'Bangkok Suvarnabhumi Export Terminal',
          description: 'Department of Agriculture export seal & cold chain packing preparation.',
          completed: false,
        },
        {
          status: 'International Air Freight Uplift',
          timestamp: 'Scheduled Flight',
          location: 'Suvarnabhumi Airport (BKK)',
          description: 'Direct air cargo dispatch.',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    // add loyalty points (5 points per dollar)
    const earnedPoints = Math.round(newOrder.totalUsd * 5);
    setUser((prev) => ({
      ...prev,
      points: prev.points + earnedPoints,
    }));
    clearCart();
    setActiveTrackingOrder(newOrder);
    addAuditLog('ORDER_CREATED', `Order ${orderId} placed for $${newOrder.totalUsd.toFixed(2)}`);
    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        formatPrice,
        products,
        updateProductStock,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedDietary,
        toggleDietary,
        selectedSpice,
        setSelectedSpice,
        onlyPerishable,
        setOnlyPerishable,
        resetFilters,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotalUsd,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        activeTrackingOrder,
        setActiveTrackingOrder,
        isBiometricModalOpen,
        setIsBiometricModalOpen,
        isReturnsModalOpen,
        setIsReturnsModalOpen,
        isLoyaltyModalOpen,
        setIsLoyaltyModalOpen,
        isChatOpen,
        setIsChatOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        sizeGuideCategory,
        setSizeGuideCategory,
        activeFilterBadge,
        setActiveFilterBadge,
        user,
        setUser,
        redeemVoucher,
        simulateBiometricLogin,
        orders,
        createOrder,
        adminRole,
        setAdminRole,
        auditLogs,
        addAuditLog,
        notification,
        showNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
