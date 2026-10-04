import React, { useState } from 'react';
import { DATABASE_SCHEMAS, API_ENDPOINTS, SchemaTable } from '../../data/schemaData';
import {
  Database,
  Terminal,
  Shield,
  Cloud,
  Layers,
  Lock,
  FileText,
} from 'lucide-react';

export const TechArchitectureView: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<SchemaTable>(DATABASE_SCHEMAS[0]);
  const [activeTab, setActiveTab] = useState<'database' | 'apis' | 'security' | 'infrastructure'>('database');

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-20">
      {/* Top Architecture Header - Deep Khaki */}
      <div className="bg-[#373E28] text-[#F7F5F0] border-b border-[#4A5335]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#4A5335] border border-[#727B5A]/40 rounded-xl">
              <Layers className="w-6 h-6 text-[#EDF0E8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-[#F7F5F0] tracking-tight">
                  Technical Architecture & Database Schemas
                </h1>
                <span className="text-[10px] font-mono uppercase bg-[#4A5335] text-[#EDF0E8] border border-[#727B5A]/40 px-2 py-0.5 rounded">
                  PostgreSQL 16 & REST API v1
                </span>
              </div>
              <p className="text-xs text-[#EFECE6]/80 mt-1 max-w-2xl">
                Production-grade multi-region e-commerce specifications designed for high concurrency, cross-border duty calculation, cold-chain IoT tracking, and PDPA/GDPR compliance.
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex space-x-6 text-xs font-medium mt-6 border-t border-[#4A5335]/70 pt-3">
            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'database'
                  ? 'border-[#EDF0E8] text-[#F7F5F0] font-semibold'
                  : 'border-transparent text-[#EFECE6]/70 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Relational Database Schemas (DDL & ERD)</span>
            </button>

            <button
              onClick={() => setActiveTab('apis')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'apis'
                  ? 'border-[#EDF0E8] text-[#F7F5F0] font-semibold'
                  : 'border-transparent text-[#EFECE6]/70 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>RESTful API Routing Contracts</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'security'
                  ? 'border-[#EDF0E8] text-[#F7F5F0] font-semibold'
                  : 'border-transparent text-[#EFECE6]/70 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Security, PDPA/GDPR & WAF</span>
            </button>

            <button
              onClick={() => setActiveTab('infrastructure')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'infrastructure'
                  ? 'border-[#EDF0E8] text-[#F7F5F0] font-semibold'
                  : 'border-transparent text-[#EFECE6]/70 hover:text-white'
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span>Multi-Region Cloud Topology</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* TAB 1: DATABASE SCHEMAS */}
        {activeTab === 'database' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Table Selector Sidebar */}
            <div className="bg-[#F3EFE6] p-4 rounded-xl border border-[#E2DDD5] shadow-xs space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#63685E] mb-3 px-2">
                PostgreSQL Tables ({DATABASE_SCHEMAS.length})
              </h3>
              {DATABASE_SCHEMAS.map((table) => (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                    selectedTable.name === table.name
                      ? 'bg-[#4A5335] text-[#F7F5F0] font-bold'
                      : 'hover:bg-[#EFECE6] text-[#1F241A]'
                  }`}
                >
                  <span>{table.name}</span>
                  <span className="text-[10px] text-[#63685E]">{table.columns.length} cols</span>
                </button>
              ))}
            </div>

            {/* Table Detail View */}
            <div className="lg:col-span-3 bg-[#F3EFE6] p-6 rounded-xl border border-[#E2DDD5] shadow-xs space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-xl font-bold text-[#1F241A]">
                    public.{selectedTable.name}
                  </h2>
                  <span className="text-xs font-mono bg-[#EDF0E8] px-2.5 py-1 rounded-lg text-[#373E28] border border-[#727B5A]/40 font-semibold">
                    Storage Engine: PostgreSQL Relational
                  </span>
                </div>
                <p className="text-xs text-[#63685E] mt-1">{selectedTable.description}</p>
              </div>

              {/* Columns Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#EFECE6] border-b border-[#E2DDD5] text-[#63685E] uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Column Name</th>
                      <th className="py-2.5 px-3">Data Type</th>
                      <th className="py-2.5 px-3">Constraints & Defaults</th>
                      <th className="py-2.5 px-3">Description & Usage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD5] text-[11px]">
                    {selectedTable.columns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-[#EFECE6]/80">
                        <td className="py-2.5 px-3 font-bold text-[#1F241A]">{col.name}</td>
                        <td className="py-2.5 px-3 text-[#373E28] font-semibold">{col.type}</td>
                        <td className="py-2.5 px-3 text-[#63685E]">{col.constraints}</td>
                        <td className="py-2.5 px-3 text-[#63685E] font-sans">{col.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Indexes & Concurrency Optimizations */}
              <div className="p-4 bg-[#373E28] rounded-xl text-[#F7F5F0] font-mono text-xs space-y-2 border border-[#4A5335]">
                <span className="text-[#EDF0E8] font-bold block text-[11px] uppercase tracking-wider">
                  Indexes & Query Optimization:
                </span>
                {selectedTable.indexes.map((idx, i) => (
                  <div key={i} className="text-[#EFECE6] bg-[#1F241A]/70 p-2 rounded-lg border border-[#727B5A]/30">
                    {idx}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APIS & ROUTING */}
        {activeTab === 'apis' && (
          <div className="space-y-4">
            <div className="bg-[#F3EFE6] p-6 rounded-xl border border-[#E2DDD5] shadow-xs">
              <h2 className="font-serif text-lg font-bold text-[#1F241A] mb-1">
                RESTful Cross-Border API Contracts
              </h2>
              <p className="text-xs text-[#63685E] mb-6">
                Microservice routes for inventory synchronization, real-time customs duty quotation, PromptPay QR payload generation, and IoT cold-chain telemetry.
              </p>

              <div className="space-y-4">
                {API_ENDPOINTS.map((ep, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#E2DDD5] bg-[#F7F5F0] space-y-2"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                          ep.method === 'GET'
                            ? 'bg-[#EDF0E8] text-[#373E28] border border-[#727B5A]/40'
                            : 'bg-[#4A5335] text-[#F7F5F0]'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono text-sm font-bold text-[#1F241A]">{ep.path}</span>
                    </div>

                    <p className="text-xs text-[#63685E] font-sans">{ep.summary}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#E2DDD5] text-[#1F241A]">
                      <div className="p-2.5 bg-[#F3EFE6] rounded-lg border border-[#E2DDD5]">
                        <span className="text-[10px] uppercase text-[#63685E] block">Request Params / Payload</span>
                        {ep.params}
                      </div>
                      <div className="p-2.5 bg-[#F3EFE6] rounded-lg border border-[#E2DDD5]">
                        <span className="text-[10px] uppercase text-[#63685E] block">Response Contract</span>
                        {ep.response}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & COMPLIANCE */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#F3EFE6] p-6 rounded-xl border border-[#E2DDD5] shadow-xs space-y-3">
                <div className="p-3 bg-[#EDF0E8] rounded-xl w-fit text-[#373E28] border border-[#727B5A]/30">
                  <Lock className="w-5 h-5 text-[#4A5335]" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#1F241A]">
                  Data Security & Encryption
                </h3>
                <ul className="text-xs text-[#63685E] space-y-2 leading-relaxed">
                  <li>• <strong>In Transit:</strong> TLS 1.3 with strict HSTS (max-age=31536000) and ECDHE key exchange.</li>
                  <li>• <strong>At Rest:</strong> AES-256 transparent database encryption via KMS envelope keys.</li>
                  <li>• <strong>Authentication:</strong> Argon2id password hashing + FIDO2 WebAuthn asymmetric passkeys.</li>
                </ul>
              </div>

              <div className="bg-[#F3EFE6] p-6 rounded-xl border border-[#E2DDD5] shadow-xs space-y-3">
                <div className="p-3 bg-[#EDF0E8] rounded-xl w-fit text-[#373E28] border border-[#727B5A]/30">
                  <Shield className="w-5 h-5 text-[#4A5335]" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#1F241A]">
                  API Protection & WAF
                </h3>
                <ul className="text-xs text-[#63685E] space-y-2 leading-relaxed">
                  <li>• <strong>Rate Limiting:</strong> Redis token bucket (100 req/min authenticated, 30 req/min guest).</li>
                  <li>• <strong>Bot Mitigation:</strong> Cloudflare Enterprise WAF with behavioral challenge on checkout.</li>
                  <li>• <strong>Step-Up 2FA:</strong> Automated risk engine triggers TOTP for orders &gt; $150 or foreign IP jumps.</li>
                </ul>
              </div>

              <div className="bg-[#F3EFE6] p-6 rounded-xl border border-[#E2DDD5] shadow-xs space-y-3">
                <div className="p-3 bg-[#EDF0E8] rounded-xl w-fit text-[#373E28] border border-[#727B5A]/30">
                  <FileText className="w-5 h-5 text-[#4A5335]" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#1F241A]">
                  Privacy Compliance (PDPA & GDPR)
                </h3>
                <ul className="text-xs text-[#63685E] space-y-2 leading-relaxed">
                  <li>• <strong>Thailand PDPA:</strong> Explicit consent ledger under Personal Data Protection Act B.E. 2562.</li>
                  <li>• <strong>GDPR/CCPA:</strong> Automated Right to be Forgotten and self-service data export archives.</li>
                  <li>• <strong>Audit Trails:</strong> Append-only immutable log stream with operator IP and actor role tracking.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MULTI-REGION CLOUD TOPOLOGY */}
        {activeTab === 'infrastructure' && (
          <div className="bg-[#F3EFE6] p-6 rounded-xl border border-[#E2DDD5] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1F241A] mb-1">
                Multi-Region High Availability & Edge Acceleration
              </h2>
              <p className="text-xs text-[#63685E]">
                Active-active cloud topology across Asia-Pacific, North America, and Europe with sub-50ms catalog latency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-[#F7F5F0] rounded-xl border border-[#E2DDD5] space-y-2">
                <div className="font-bold text-[#1F241A] flex items-center justify-between">
                  <span>Region 1: asia-southeast1</span>
                  <span className="text-[#373E28] bg-[#EDF0E8] border border-[#727B5A]/40 px-2 py-0.5 rounded text-[10px]">PRIMARY WRITE</span>
                </div>
                <div className="text-[#63685E]">Bangkok & Singapore Edge</div>
                <p className="text-[11px] text-[#63685E] font-sans">
                  Hosts master transactional database, DOA phytosanitary clearance worker, and PromptPay payment listeners.
                </p>
              </div>

              <div className="p-4 bg-[#F7F5F0] rounded-xl border border-[#E2DDD5] space-y-2">
                <div className="font-bold text-[#1F241A] flex items-center justify-between">
                  <span>Region 2: us-west1</span>
                  <span className="text-[#373E28] bg-[#EDF0E8] border border-[#727B5A]/40 px-2 py-0.5 rounded text-[10px]">READ REPLICA</span>
                </div>
                <div className="text-[#63685E]">Oregon & Los Angeles Cross-Dock</div>
                <p className="text-[11px] text-[#63685E] font-sans">
                  Serves North American catalog queries with zero-latency read replication and Section 321 customs hooks.
                </p>
              </div>

              <div className="p-4 bg-[#F7F5F0] rounded-xl border border-[#E2DDD5] space-y-2">
                <div className="font-bold text-[#1F241A] flex items-center justify-between">
                  <span>Region 3: europe-west3</span>
                  <span className="text-[#373E28] bg-[#EDF0E8] border border-[#727B5A]/40 px-2 py-0.5 rounded text-[10px]">READ REPLICA</span>
                </div>
                <div className="text-[#63685E]">Frankfurt am Main Hub</div>
                <p className="text-[11px] text-[#63685E] font-sans">
                  EU IOSS duty settlement engine and real-time cold-chain temperature telemetry ingest from air flights.
                </p>
              </div>
            </div>

            {/* Disaster Recovery Specification */}
            <div className="p-4 bg-[#373E28] text-[#F7F5F0] rounded-xl space-y-2 text-xs border border-[#4A5335]">
              <span className="font-bold text-[#EDF0E8] font-mono uppercase text-[11px] tracking-wider block">
                Disaster Recovery & SLA Invariants:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono pt-1">
                <div>
                  <div className="text-[#EFECE6]/80 text-[10px]">RTO (Recovery Time)</div>
                  <div className="font-bold text-white text-sm">&lt; 90 seconds</div>
                </div>
                <div>
                  <div className="text-[#EFECE6]/80 text-[10px]">RPO (Data Loss Point)</div>
                  <div className="font-bold text-white text-sm">&lt; 1 second (WAL)</div>
                </div>
                <div>
                  <div className="text-[#EFECE6]/80 text-[10px]">Global Edge Latency</div>
                  <div className="font-bold text-[#EDF0E8] text-sm">&lt; 38ms (CDN)</div>
                </div>
                <div>
                  <div className="text-[#EFECE6]/80 text-[10px]">Availability Target</div>
                  <div className="font-bold text-white text-sm">99.99% Uptime</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
