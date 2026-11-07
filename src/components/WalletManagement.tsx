import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatINR } from '../utils/walletEngine';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
  CreditCard,
  Send,
  Download,
  Search,
  Filter,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  XCircle,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const WalletManagement: React.FC = () => {
  const {
    currentUser,
    transactions,
    setActiveModal,
    setSelectedTransaction,
    showToast,
  } = useWallet();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  if (!currentUser) return null;

  // Filter logic
  const filtered = transactions.filter((tx) => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = tx.recipient.name.toLowerCase().includes(q) || tx.sender.name.toLowerCase().includes(q);
      const matchDesc = tx.description.toLowerCase().includes(q);
      const matchRef = tx.referenceId.toLowerCase().includes(q);
      const matchId = tx.recipient.identifier.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchRef && !matchId) return false;
    }
    return true;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Type', 'Category', 'Reference ID', 'Amount (INR)', 'Fee', 'Party Name', 'Party ID', 'Description', 'Timestamp', 'Status'];
    const rows = filtered.map((tx) => [
      tx.id,
      tx.type,
      tx.category,
      tx.referenceId,
      tx.amount,
      tx.fee,
      `"${tx.type === 'credit' ? tx.sender.name : tx.recipient.name}"`,
      `"${tx.type === 'credit' ? tx.sender.identifier : tx.recipient.identifier}"`,
      `"${tx.description}"`,
      tx.timestamp,
      tx.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VUPAY_Statement_${currentUser.id}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded official ledger statement in CSV format.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Wallet Management & Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time balance tracking, limits overview, and immutable double-entry ledger
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Statement (CSV)</span>
          </button>

          <button
            onClick={() => setActiveModal('add_money')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Money</span>
          </button>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Balance */}
        <div className="bg-[#101B35] text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Available Balance</span>
            <p className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {formatINR(currentUser.balance)}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">Status: Active & Liquid</span>
            <button
              onClick={() => setActiveModal('withdraw')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" /> Withdraw to Bank
            </button>
          </div>
        </div>

        {/* Card 2: Tier 2 Limits */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Monthly Transfer Limit</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Tier {currentUser.kycTier} Full KYC
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatINR(currentUser.monthlyLimit)}
            </p>
          </div>

          <div className="space-y-1 pt-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Utilized this month</span>
              <span className="font-mono">{formatINR(currentUser.monthlySpent)}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${Math.min(100, (currentUser.monthlySpent / currentUser.monthlyLimit) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Direct Actions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Fast Money Moves</span>
            <p className="text-xs text-slate-600">Zero-fee peer transfers and instant bank cashout</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <button
              onClick={() => setActiveModal('send')}
              className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Send Money
            </button>
            <button
              onClick={() => setActiveModal('receive')}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Request Link
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search reference ID, contact, note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="transfer">Peer Transfers</option>
              <option value="merchant_qr">Merchant QR</option>
              <option value="electricity">Electricity</option>
              <option value="internet">Broadband</option>
              <option value="recharge">Mobile Recharge</option>
              <option value="deposit">Deposit Top-up</option>
              <option value="withdrawal">Bank Withdrawal</option>
            </select>

            {/* Type Segmented */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              {(['all', 'credit', 'debit'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                    typeFilter === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Status Segmented */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-y border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Transaction / Party</th>
                <th className="py-3 px-4">Category & Rail</th>
                <th className="py-3 px-4">Audit Reference ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Debit / Credit</th>
                <th className="py-3 px-4 text-right">Balance After</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No transactions match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isCredit = tx.type === 'credit';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {isCredit ? tx.sender.name : tx.recipient.name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono">
                              {isCredit ? tx.sender.identifier : tx.recipient.identifier}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-medium capitalize text-slate-800">{tx.category.replace('_', ' ')}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{tx.paymentRail}</p>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {tx.referenceId}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(tx.timestamp).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-emerald-600">
                          <CheckCircle className="w-3.5 h-3.5" /> Success
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`font-mono font-bold text-sm tabular-nums ${
                            isCredit ? 'text-emerald-600' : 'text-slate-900'
                          }`}
                        >
                          {isCredit ? '+' : '-'}
                          {formatINR(tx.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-500 tabular-nums">
                        {formatINR(tx.balanceAfter)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedTransaction(tx);
                            setActiveModal('receipt');
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
          <span>Showing {filtered.length} entries</span>
          <span className="font-mono text-slate-400">Double-entry ledger status: Balanced</span>
        </div>
      </div>
    </div>
  );
};
