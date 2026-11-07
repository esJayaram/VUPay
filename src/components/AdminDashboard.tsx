import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatINR } from '../utils/walletEngine';
import {
  Users,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  CreditCard,
  Building,
  RefreshCw,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    adminAnalytics,
    adminUsers,
    transactions,
    fraudAlerts,
    toggleUserFreeze,
    resolveFraudAlert,
    approveKYC,
    setSelectedTransaction,
    setActiveModal,
  } = useWallet();

  const [activeTab, setActiveTab] = useState<'monitoring' | 'users' | 'kyc' | 'fraud' | 'analytics'>('monitoring');
  const [userSearch, setUserSearch] = useState('');
  const [txnSearch, setTxnSearch] = useState('');

  // Hourly velocity chart data
  const hourlyData = [
    { hour: '00:00', volume: 1400000, txnCount: 120 },
    { hour: '04:00', volume: 800000, txnCount: 65 },
    { hour: '08:00', volume: 4200000, txnCount: 480 },
    { hour: '12:00', volume: 8900000, txnCount: 940 },
    { hour: '16:00', volume: 11500000, txnCount: 1250 },
    { hour: '20:00', volume: 7800000, txnCount: 810 },
  ];

  // Filtered users
  const filteredUsers = adminUsers.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.vupayId.toLowerCase().includes(q) || u.mobile.includes(q);
  });

  // Filtered transactions
  const filteredTxns = transactions.filter((t) => {
    if (!txnSearch) return true;
    const q = txnSearch.toLowerCase();
    return (
      t.referenceId.toLowerCase().includes(q) ||
      t.recipient.name.toLowerCase().includes(q) ||
      t.sender.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Operations & Risk Console
            </h1>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              ADMIN MODE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time platform ledger surveillance, liquidity reserve monitoring, KYC validation & fraud alerts
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>Surveillance Engine Active · 100% Invariants Intact</span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {adminAnalytics.totalUsers.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">+142 registered today</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Transactions</span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {adminAnalytics.totalTransactions.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500 font-mono">0.4s avg settlement</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Settled Volume</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            ₹{(adminAnalytics.totalVolume / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">+18.4% MoM growth</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Reserve Pool</span>
            <Building className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            ₹{(adminAnalytics.reserveBalance / 10000000).toFixed(1)} Cr
          </p>
          <p className="text-[11px] text-slate-500">Escrow backed 100%</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Fraud Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-600 font-mono tabular-nums">
            {fraudAlerts.filter((a) => a.status !== 'resolved').length}
          </p>
          <p className="text-[11px] text-rose-500 font-medium">Require risk review</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-semibold">
        {[
          { id: 'monitoring', label: 'Transaction Monitoring', count: transactions.length },
          { id: 'users', label: 'User Management & Freeze', count: adminUsers.length },
          { id: 'kyc', label: 'KYC Verification Queue', count: adminUsers.filter((u) => u.kycStatus === 'pending').length },
          { id: 'fraud', label: 'Fraud Radar & Velocity', count: fraudAlerts.filter((a) => a.status !== 'resolved').length },
          { id: 'analytics', label: 'Hourly Velocity Analytics' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: TRANSACTION MONITORING */}
      {activeTab === 'monitoring' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">Live System Transactions</h2>
              <p className="text-xs text-slate-500">Every double-entry debit and credit across the VUPAY network</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search reference, recipient, sender..."
                value={txnSearch}
                onChange={(e) => setTxnSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-y border-slate-200 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTxns.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{tx.referenceId}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{tx.sender.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{tx.sender.identifier}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{tx.recipient.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{tx.recipient.identifier}</p>
                    </td>
                    <td className="py-3 px-4 capitalize font-medium text-slate-600">
                      {tx.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(tx.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                      {formatINR(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[11px] font-semibold text-emerald-600 inline-flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Success
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedTransaction(tx);
                          setActiveModal('receipt');
                        }}
                        className="px-2 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 rounded cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT & FREEZE */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">User Accounts & Freeze Controls</h2>
              <p className="text-xs text-slate-500">Monitor balances and enforce compliance restrictions</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user name or handle..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-y border-slate-200 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">VUPAY Handle</th>
                  <th className="py-3 px-4">KYC Tier</th>
                  <th className="py-3 px-4 text-right">Wallet Balance</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-center">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">+91 {u.mobile}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{u.vupayId}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-700">Tier {u.kycTier}</span>
                      <span className="text-[10px] text-slate-400 block capitalize">{u.kycStatus}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatINR(u.balance)}
                    </td>
                    <td className="py-3 px-4">
                      {u.isFrozen ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3" /> Restricted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <Unlock className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleUserFreeze(u.id)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                          u.isFrozen
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {u.isFrozen ? 'Unfreeze Wallet' : 'Restrict / Freeze'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KYC QUEUE */}
      {activeTab === 'kyc' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans">Pending Digital KYC Submissions</h2>
            <p className="text-xs text-slate-500">Aadhaar and PAN documentation awaiting compliance clearance</p>
          </div>

          <div className="space-y-3">
            {adminUsers
              .filter((u) => u.kycStatus === 'pending')
              .map((u) => (
                <div
                  key={u.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">{u.name}</p>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        Requested Tier 2 Upgrade
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      VUPAY ID: {u.vupayId} · Mobile: +91 {u.mobile}
                    </p>
                    <p className="text-xs text-slate-600">
                      Submitted: PAN Card (Verified with NSDL) · Aadhaar Offline XML
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approveKYC(u.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Approve & Raise Limit to ₹2L
                    </button>
                  </div>
                </div>
              ))}

            {adminUsers.filter((u) => u.kycStatus === 'pending').length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">
                All KYC submissions are fully cleared. No pending verification requests!
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FRAUD RADAR */}
      {activeTab === 'fraud' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans">Fraud Alert & Velocity Radar</h2>
            <p className="text-xs text-slate-500">Heuristic rules triggered by high-velocity outbound transfers</p>
          </div>

          <div className="space-y-3">
            {fraudAlerts.map((alert) => {
              const isResolved = alert.status === 'resolved';
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    isResolved ? 'border-slate-200 bg-slate-50' : 'border-rose-200 bg-rose-50/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                            alert.severity === 'critical'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {alert.severity} RISK
                        </span>
                        <span className="font-bold text-xs text-slate-900">{alert.rule}</span>
                        {isResolved && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700">{alert.description}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        User: {alert.userName} ({alert.userId}) · Amount: {formatINR(alert.amount)}
                      </p>
                    </div>

                    {!isResolved && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => resolveFraudAlert(alert.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          Mark Legitimate
                        </button>
                        <button
                          onClick={() => toggleUserFreeze(alert.userId)}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          Freeze Account
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: HOURLY VELOCITY ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans">Hourly Settlement Velocity</h2>
            <p className="text-xs text-slate-500">Processed transaction volume across the 24-hour cycle</p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis dataKey="hour" fontSize={12} stroke="#64748B" />
                <YAxis
                  fontSize={11}
                  stroke="#64748B"
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, 'Volume']}
                  contentStyle={{
                    backgroundColor: '#101B35',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="volume" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
