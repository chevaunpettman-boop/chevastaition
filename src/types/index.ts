export type Language = 'en' | 'th' | 'ja' | 'zh' | 'de';

export type Currency = 'USD' | 'THB' | 'EUR' | 'GBP' | 'JPY' | 'AUD';

export type ProductCategory =
  | "Women's Fashion"
  | "Men's Fashion"
  | "Bags & Leather Goods"
  | 'Footwear'
  | 'Beauty & Fragrances'
  | 'Thai Market & Wholefoods';

export type DietaryTag = 'halal' | 'vegan' | 'gluten-free' | 'organic' | 'vegetarian';

export type SpiceLevel = 0 | 1 | 2 | 3 | 4; // 0: Non-Spicy, 1: Mild, 2: Medium, 3: Hot, 4: Thai Spicy

export interface ProductDimensions {
  l: number; // cm
  w: number; // cm
  h: number; // cm
}

export interface ColorVariant {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface SizeVariant {
  size: string;
  standard: 'US' | 'EU' | 'UK' | 'Asia';
  inStock: boolean;
}

export interface ScentProfile {
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  intensity: 'Delicate' | 'Moderate' | 'Intense';
  longevityHours: number;
}

export interface Product {
  id: string;
  sku: string;
  nameEn: string;
  nameTh: string;
  namePhonetic: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  shortDescription: string;
  priceUsd: number;
  originalPriceUsd?: number;
  discountPercent?: number;
  badge?: 'TRENDING' | 'FLASH DEAL' | 'BESTSELLER' | 'ARTISAN' | 'HOT';
  salesCount: number;
  rating: number;
  reviewCount: number;
  image: string;
  galleryImages?: string[];
  dietary?: DietaryTag[];
  spiceLevel?: SpiceLevel;
  isPerishable?: boolean;
  storageTemp?: string;
  coldChainRequired?: boolean;
  weightGrams: number;
  dimensionsCm: ProductDimensions;
  originProvince: string;
  brand: string;
  lotNumber: string;
  batchDate: string;
  expiryDate?: string;
  stockByWarehouse: {
    'BKK-HUB': number;
    'CNX-DEPOT': number;
    'LAX-FWD': number;
    'FRA-FWD': number;
  };
  ingredients?: string[];
  materials?: string[];
  colors?: ColorVariant[];
  sizes?: SizeVariant[];
  scentProfile?: ScentProfile;
  phytosanitaryCertified?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface TrackingStep {
  status: string;
  timestamp: string;
  location: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  date: string;
  customerEmail: string;
  customerName: string;
  shippingCountry: string;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  items: CartItem[];
  subtotalUsd: number;
  dutiesAndTaxesUsd: number;
  taxRatePercent: number;
  shippingUsd: number;
  discountUsd: number;
  totalUsd: number;
  currency: Currency;
  paymentMethod: 'card' | 'promptpay' | 'applepay' | 'googlepay' | 'truemoney';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  fulfillmentStatus: 'processing' | 'phytosanitary_cleared' | 'in_transit' | 'customs_cleared' | 'delivered';
  trackingNumber: string;
  originWarehouse: string;
  destinationHub: string;
  coldChainMonitored: boolean;
  coldChainTempCelsius?: number;
  trackingSteps: TrackingStep[];
}

export interface Warehouse {
  id: string;
  code: 'BKK-HUB' | 'CNX-DEPOT' | 'LAX-FWD' | 'FRA-FWD';
  name: string;
  city: string;
  country: string;
  type: 'Central Export Hub' | 'Artisanal Sourcing Depot' | 'Forward Cross-Dock';
  coldCapacityUsedPercent: number;
  ambientCapacityUsedPercent: number;
  activeShipmentsCount: number;
  handlingFeeUsd: number;
}

export type AdminRole = 'super_admin' | 'logistics_manager' | 'inventory_specialist' | 'support_lead';

export interface RBACUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: {
    canViewAnalytics: boolean;
    canEditInventory: boolean;
    canOverrideColdChain: boolean;
    canProcessRefunds: boolean;
    canManageRoles: boolean;
    canExportAuditLogs: boolean;
  };
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  points: number;
  tier: 'Silver' | 'Gold' | 'Jade' | 'Royal Elephant';
  biometricRegistered: boolean;
  stepUp2FaEnabled: boolean;
  savedVouchers: Array<{
    code: string;
    discountUsd: number;
    description: string;
    used: boolean;
  }>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorEmail: string;
  role: AdminRole;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
}
