import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { WAREHOUSES, calculateVolumetricWeightKg } from '../../data/warehouses';
import { AdminRole } from '../../types';
import {
  BarChart3,
  Boxes,
  Truck,
  ShieldAlert,
  TrendingUp,
  Search,
  Building2,
  ThermometerSnowflake,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    updateProductStock,
    orders,
    adminRole,
    setAdminRole,
    auditLogs,
    addAuditLog,
    formatPrice,
    setActiveView,
    showNotification,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'logistics' | 'rbac'>('analytics');
  const [stockSearch, setStockSearch] = useState('');

  // Volumetric calculator state for logistics
  const [calcL, setCalcL] = useState(25);
  const [calcW, setCalcW] = useState(18);
  const [calcH, setCalcH] = useState(12);
  const [calcPhysicalGrams, setCalcPhysicalGrams] = useState(650);

  const calculatedVolumetric = calculateVolumetricWeightKg(calcL, calcW, calcH);
  const billable = Math.max(calcPhysicalGrams / 1000, calculatedVolumetric);

  // Analytics aggregate calculations
  const totalRevenueUsd = orders.reduce((acc, o) => acc + o.totalUsd, 0);
  const totalShipmentsActive = orders.filter((o) => o.fulfillmentStatus === 'in_transit' || o.fulfillmentStatus === 'processing').length;

  const funnelSteps = [
    { stage: 'Storefront Visits', count: '14,820', rate: '100%' },
    { stage: 'Product Detail Views', count: '9,410', rate: '63.5%' },
    { stage: 'Added to Basket', count: '3,120', rate: '21.0%' },
    { stage: 'Reached Checkout', count: '1,840', rate: '12.4%' },
    { stage: 'Settled & Dispatched', count: `${orders.length * 480}`, rate: '7.8%' },
  ];

  const rolesList: { id: AdminRole; label: string; desc: string }[] = [
    { id: 'super_admin', label: 'Super Admin', desc: 'Full write access, security keys, audit logs' },
    { id: 'logistics_manager', label: 'Logistics Manager', desc: 'Air waybill generation, cold-chain routing' },
    { id: 'inventory_specialist', label: 'Inventory Specialist', desc: 'Batch lots, expiration tracking, stock reorder' },
    { id: 'support_lead', label: 'Customer Support Lead', desc: 'Perishable claims, refunds, customer accounts' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-20">
      {/* Admin Top Navigation - Deep Khaki */}
      <div className="bg-[#373E28] text-[#F7F5F0] border-b border-[#4A5335]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-[#F7F5F0]">
                SiamHarvest Operations Console
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#4A5335] text-[#EDF0E8] border border-[#727B5A]/40 px-2 py-0.5 rounded">
                Live Operations
              </span>
            </div>
            <p className="text-xs text-[#EFECE6]/80 mt-0.5">
              Cross-Border Hubs: Bangkok (BKK) · Chiang Mai (CNX) · Los Angeles (LAX) · Frankfurt (FRA)
            </p>
          </div>

          {/* Active RBAC Role Switcher */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#EFECE6]/80 hidden sm:inline">Active RBAC Role:</span>
            <div className="relative">
              <select
                value={adminRole}
                onChange={(e) => {
                  const newRole = e.target.value as AdminRole;
                  setAdminRole(newRole);
                  addAuditLog('ROLE_SWITCHED', `Switched active session role to ${newRole}`);
                  showNotification(`Active RBAC role set to ${newRole}`);
                }}
                className="bg-[#4A5335] border border-[#727B5A]/50 text-[#F7F5F0] text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#EDF0E8] cursor-pointer"
              >
                {rolesList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setActiveView('store')}
              className="text-xs bg-[#4A5335] hover:bg-[#373E28] text-[#F7F5F0] px-3 py-1.5 rounded-lg transition-colors border border-[#727B5A]/40"
            >
              Exit to Storefront
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 text-xs font-medium border-t border-[#4A5335]/70">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-[#EDF0E8] text-[#F7F5F0] font-semibold'
                : 'border-transparent text-[#EFECE6]/70 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & Funnel</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'inventory'
                ? 'border-[#EDF0E8] text-[#F7F5F0] font-semibold'
                : 'border-transparent text-[#EFECE6]/70 hover:text-white'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Batch & Lot Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'logistics'
                ? 'border-[#EDF0E8] text-[#F7F5F0] font-semibold'
                : 'border-transparent text-[#EFECE6]/70 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Multi-Warehouse Logistics</span>
          </button>

          <button
            onClick={() => setActiveTab('rbac')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'rbac'
                ? 'border-[#EDF0E8] text-[#F7F5F0] font-semibold'
                : 'border-transparent text-[#EFECE6]/70 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>RBAC & Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* TAB 1: ANALYTICS & CONVERSION FUNNEL */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#F3EFE6] p-5 rounded-xl border border-[#E2DDD5] shadow-xs">
                <span className="text-xs text-[#63685E] uppercase tracking-wider font-mono">
                  Gross Merchandise Value (GMV)
                </span>
                <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#1F241A]">
                  {formatPrice(totalRevenueUsd + 12480.0)}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-[#373E28] font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% vs last period</span>
                </div>
              </div>

              <div className="bg-[#F3EFE6] p-5 rounded-xl border border-[#E2DDD5] shadow-xs">
                <span className="text-xs text-[#63685E] uppercase tracking-wider font-mono">
                  Active Air Cargo Consignments
                </span>
                <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#1F241A]">
                  {totalShipmentsActive + 28}
                </div>
                <div className="mt-1 text-xs text-[#63685E]">
                  Departing via TG692 & SQ022
                </div>
              </div>

              <div className="bg-[#F3EFE6] p-5 rounded-xl border border-[#E2DDD5] shadow-xs">
                <span className="text-xs text-[#63685E] uppercase tracking-wider font-mono">
                  PromptPay vs Card Ratio
                </span>
                <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#1F241A]">
                  42% PromptPay
                </div>
                <div className="mt-1 text-xs text-[#63685E]">
                  58% Global Card & Apple Pay
                </div>
              </div>

              <div className="bg-[#F3EFE6] p-5 rounded-xl border border-[#E2DDD5] shadow-xs">
                <span className="text-xs text-[#63685E] uppercase tracking-wider font-mono">
                  Cold-Chain Compliance Rate
                </span>
                <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#373E28]">
                  99.8%
                </div>
                <div className="mt-1 text-xs text-[#63685E]">
                  Sensitech IoT range 2°C–5°C kept
                </div>
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-[#F3EFE6] p-6 rounded-xl border border-[#E2DDD5] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1F241A]">
                    Global Cross-Border Conversion Funnel
                  </h3>
                  <p className="text-xs text-[#63685E]">
                    Track drop-offs from international discovery to customs-cleared order completion
                  </p>
                </div>
                <span className="text-xs font-mono text-[#63685E]">Last 30 Days</span>
              </div>

              <div className="space-y-3">
                {funnelSteps.map((step, idx) => (
                  <div key={idx} className="p-3 bg-[#F7F5F0] rounded-xl border border-[#E2DDD5]">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#1F241A]">{step.stage}</span>
                      <span className="font-mono text-[#63685E]">
                        {step.count} ({step.rate})
                      </span>
                    </div>
                    <div className="w-full bg-[#E2DDD5] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#4A5335] h-full rounded-full"
                        style={{ width: step.rate }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY & BATCH LOT EXPIRY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1F241A]">
                  Lot Traceability & Cold-Storage Stocks
                </h3>
                <p className="text-xs text-[#63685E]">
                  Monitor harvest batch lots, expiration thresholds, and multi-depot stock
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#63685E] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by SKU, lot, or title..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-[#F3EFE6] border border-[#E2DDD5] rounded-xl text-[#1F241A] focus:outline-none focus:border-[#4A5335] w-64"
                />
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-[#F3EFE6] rounded-xl border border-[#E2DDD5] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EFECE6] border-b border-[#E2DDD5] font-mono uppercase text-[11px] text-[#63685E]">
                    <tr>
                      <th className="py-3 px-4">Product & SKU</th>
                      <th className="py-3 px-4">Batch Lot</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4">Temp Regime</th>
                      <th className="py-3 px-4">BKK Hub</th>
                      <th className="py-3 px-4">CNX Depot</th>
                      <th className="py-3 px-4">LAX Fwd</th>
                      <th className="py-3 px-4">FRA Fwd</th>
                      <th className="py-3 px-4 text-right">Quick Stock Adj</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD5]">
                    {products
                      .filter(
                        (p) =>
                          p.nameEn.toLowerCase().includes(stockSearch.toLowerCase()) ||
                          p.sku.toLowerCase().includes(stockSearch.toLowerCase()) ||
                          p.lotNumber.toLowerCase().includes(stockSearch.toLowerCase())
                      )
                      .map((prod) => {
                        const isLowStock = prod.stockByWarehouse['BKK-HUB'] < 100;
                        return (
                          <tr key={prod.id} className="hover:bg-[#EFECE6]/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-semibold text-[#1F241A]">{prod.nameEn}</div>
                              <div className="text-[11px] text-[#63685E] font-mono">
                                {prod.sku} · {prod.brand}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono font-medium text-[#1F241A]">
                              {prod.lotNumber}
                            </td>
                            <td className="py-3 px-4 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] ${
                                  prod.isPerishable ? 'bg-[#EDF0E8] text-[#373E28] font-bold' : 'text-[#63685E]'
                                }`}
                              >
                                {prod.expiryDate}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {prod.isPerishable ? (
                                <span className="inline-flex items-center gap-1 text-[#373E28] font-medium">
                                  <ThermometerSnowflake className="w-3 h-3 text-[#4A5335]" />
                                  <span>2°C–5°C</span>
                                </span>
                              ) : (
                                <span className="text-[#63685E]">Ambient</span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold tabular-nums">
                              <span className={isLowStock ? 'text-amber-800' : 'text-[#1F241A]'}>
                                {prod.stockByWarehouse['BKK-HUB']}
                              </span>
                              {isLowStock && <span className="text-[10px] text-amber-800 ml-1">LOW</span>}
                            </td>
                            <td className="py-3 px-4 font-mono tabular-nums text-[#63685E]">
                              {prod.stockByWarehouse['CNX-DEPOT']}
                            </td>
                            <td className="py-3 px-4 font-mono tabular-nums text-[#63685E]">
                              {prod.stockByWarehouse['LAX-FWD']}
                            </td>
                            <td className="py-3 px-4 font-mono tabular-nums text-[#63685E]">
                              {prod.stockByWarehouse['FRA-FWD']}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() =>
                                    updateProductStock(prod.id, 'BKK-HUB', prod.stockByWarehouse['BKK-HUB'] + 20)
                                  }
                                  className="px-2 py-1 bg-[#F7F5F0] hover:bg-[#EFECE6] border border-[#E2DDD5] text-[#1F241A] rounded font-mono text-[11px]"
                                  title="Add +20 stock at BKK Hub"
                                >
                                  +20
                                </button>
                                <button
                                  onClick={() =>
                                    updateProductStock(
                                      prod.id,
                                      'BKK-HUB',
                                      Math.max(0, prod.stockByWarehouse['BKK-HUB'] - 10)
                                    )
                                  }
                                  className="px-2 py-1 bg-[#F7F5F0] hover:bg-[#EFECE6] border border-[#E2DDD5] text-[#1F241A] rounded font-mono text-[11px]"
                                  title="Reduce 10 stock at BKK Hub"
                                >
                                  -10
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LOGISTICS & VOLUMETRIC CALCULATOR */}
        {activeTab === 'logistics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Fulfillment Centers */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1F241A]">
                  Global Fulfillment Center Grid
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {WAREHOUSES.map((wh) => (
                    <div
                      key={wh.id}
                      className="bg-[#F3EFE6] p-5 rounded-xl border border-[#E2DDD5] shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#373E28] bg-[#EDF0E8] px-2 py-0.5 rounded border border-[#727B5A]/40">
                            {wh.code}
                          </span>
                          <h4 className="font-semibold text-[#1F241A] mt-2 text-sm">{wh.name}</h4>
                          <span className="text-xs text-[#63685E]">{wh.city}, {wh.country}</span>
                        </div>
                        <Building2 className="w-5 h-5 text-[#4A5335]" />
                      </div>

                      <div className="space-y-2 text-xs pt-2 border-t border-[#E2DDD5]">
                        <div>
                          <div className="flex justify-between text-[#63685E] mb-1">
                            <span>Cold Storage Utilization:</span>
                            <span className="font-mono font-medium text-[#1F241A]">{wh.coldCapacityUsedPercent}%</span>
                          </div>
                          <div className="w-full bg-[#E2DDD5] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#4A5335] h-full rounded-full"
                              style={{ width: `${wh.coldCapacityUsedPercent}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[#63685E] mb-1">
                            <span>Ambient Capacity:</span>
                            <span className="font-mono font-medium text-[#1F241A]">{wh.ambientCapacityUsedPercent}%</span>
                          </div>
                          <div className="w-full bg-[#E2DDD5] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#727B5A] h-full rounded-full"
                              style={{ width: `${wh.ambientCapacityUsedPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E2DDD5] flex justify-between text-xs text-[#63685E] font-mono">
                        <span>Active Consignments: {wh.activeShipmentsCount}</span>
                        <span>Handling: ${wh.handlingFeeUsd.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Volumetric Shipping Weight Calculator */}
              <div className="bg-[#F3EFE6] p-6 rounded-xl border border-[#E2DDD5] shadow-xs space-y-4">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1F241A]">
                    IATA Volumetric Weight Tool
                  </h3>
                  <p className="text-xs text-[#63685E] mt-0.5">
                    Formula: (Length × Width × Height in cm) / 5000
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#63685E] mb-1">Length (cm)</label>
                    <input
                      type="number"
                      value={calcL}
                      onChange={(e) => setCalcL(Number(e.target.value))}
                      className="w-full p-2 bg-[#F7F5F0] border border-[#E2DDD5] rounded-lg font-mono text-[#1F241A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#63685E] mb-1">Width (cm)</label>
                    <input
                      type="number"
                      value={calcW}
                      onChange={(e) => setCalcW(Number(e.target.value))}
                      className="w-full p-2 bg-[#F7F5F0] border border-[#E2DDD5] rounded-lg font-mono text-[#1F241A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#63685E] mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={calcH}
                      onChange={(e) => setCalcH(Number(e.target.value))}
                      className="w-full p-2 bg-[#F7F5F0] border border-[#E2DDD5] rounded-lg font-mono text-[#1F241A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#63685E] mb-1">Actual Physical Weight (grams)</label>
                    <input
                      type="number"
                      value={calcPhysicalGrams}
                      onChange={(e) => setCalcPhysicalGrams(Number(e.target.value))}
                      className="w-full p-2 bg-[#F7F5F0] border border-[#E2DDD5] rounded-lg font-mono text-[#1F241A]"
                    />
                  </div>
                </div>

                {/* Calculation Output - Deep Khaki card */}
                <div className="p-4 bg-[#373E28] text-[#F7F5F0] rounded-xl space-y-2 text-xs font-mono border border-[#4A5335]">
                  <div className="flex justify-between text-[#EFECE6]/80">
                    <span>Volumetric Weight:</span>
                    <span>{calculatedVolumetric} kg</span>
                  </div>
                  <div className="flex justify-between text-[#EFECE6]/80">
                    <span>Physical Weight:</span>
                    <span>{(calcPhysicalGrams / 1000).toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#F7F5F0] border-t border-[#4A5335] pt-2 text-sm">
                    <span>Chargeable Weight:</span>
                    <span className="text-[#EDF0E8]">{billable} kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RBAC & AUDIT LOGS */}
        {activeTab === 'rbac' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Roles Description */}
              <div className="bg-[#F3EFE6] p-6 rounded-xl border border-[#E2DDD5] shadow-xs space-y-4">
                <h3 className="font-serif text-base font-bold text-[#1F241A]">
                  Granular RBAC Roles Matrix
                </h3>
                <p className="text-xs text-[#63685E]">
                  Manage operational privileges across procurement, logistics, and compliance
                </p>

                <div className="space-y-3">
                  {rolesList.map((r) => (
                    <div
                      key={r.id}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        adminRole === r.id
                          ? 'border-[#4A5335] bg-[#EDF0E8] font-medium'
                          : 'border-[#E2DDD5] bg-[#F7F5F0] hover:bg-[#EFECE6] text-[#63685E]'
                      }`}
                      onClick={() => {
                        setAdminRole(r.id);
                        showNotification(`Role changed to ${r.label}`);
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#1F241A]">{r.label}</span>
                        {adminRole === r.id && (
                          <span className="text-[10px] font-mono text-[#373E28] font-bold bg-[#F7F5F0] border border-[#727B5A]/40 px-1.5 py-0.5 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#63685E] mt-1">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immutable Audit Logs Table */}
              <div className="lg:col-span-2 bg-[#F3EFE6] p-6 rounded-xl border border-[#E2DDD5] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1F241A]">
                      System Event & Operational Audit Trail
                    </h3>
                    <p className="text-xs text-[#63685E]">
                      Cryptographically signed audit logs conforming to GDPR and Thai PDPA Act B.E. 2562
                    </p>
                  </div>
                  <span className="text-[11px] font-mono bg-[#EDF0E8] text-[#373E28] px-2.5 py-1 rounded-lg border border-[#727B5A]/40 font-semibold">
                    Audit Logging Active
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EFECE6] border-b border-[#E2DDD5] font-mono uppercase text-[10px] text-[#63685E]">
                      <tr>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Actor & Role</th>
                        <th className="py-2.5 px-3">Action</th>
                        <th className="py-2.5 px-3">Resource Target</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DDD5] font-mono text-[11px]">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#EFECE6]/80">
                          <td className="py-2.5 px-3 text-[#63685E] whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-semibold text-[#1F241A]">{log.role}</span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#1F241A]">
                            {log.action}
                          </td>
                          <td className="py-2.5 px-3 text-[#63685E] truncate max-w-xs">
                            {log.resource}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="bg-[#EDF0E8] text-[#373E28] text-[10px] px-2 py-0.5 rounded font-bold border border-[#727B5A]/30">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
