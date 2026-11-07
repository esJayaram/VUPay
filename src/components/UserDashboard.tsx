import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatINR } from '../utils/walletEngine';
import {
  Send,
  Download,
  PlusCircle,
  QrCode,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Eye,
  EyeOff,
  ShieldCheck,
  Search,
  Bell,
  ChevronRight,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Zap,
  Sparkles,
  Radio,
  RadioTower,
  Wifi,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    setActiveModal,
    transactions,
    beneficiaries,
    setSelectedTransaction,
    startTour,
    realtimeConnected,
    lastRealtimeEvent,
    simulateIncomingPayment,
  } = useWallet();

  const [hideBalance, setHideBalance] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Please sign in to view your dashboard</h2>
      </div>
    );
  }

  // Monthly Cashflow data for Recharts
  const cashflowData = [
    { month: 'Jun', income: 18000, expense: 12400 },
    { month: 'Jul', income: 24000, expense: 18900 },
    { month: 'Aug', income: 22500, expense: 16200 },
    { month: 'Sep', income: 31000, expense: 22800 },
    { month: 'Oct', income: 28500, expense: 24100 },
    { month: 'Nov', income: 7500, expense: currentUser.monthlySpent },
  ];

  // Spending Category Breakdown for Recharts Donut
  const categoryData = [
    { name: 'Peer Transfers', value: 16500, color: '#2563EB' },
    { name: 'Utility & Bills', value: 8900, color: '#16A34A' },
    { name: 'Merchant QR', value: 5200, color: '#22D3EE' },
    { name: 'Food & Travel', value: 3900, color: '#F59E0B' },
  ];

  // Filtered transactions
  const filteredTransactions = transactions
    .filter((tx) => {
      if (filterType === 'all') return true;
      return tx.type === filterType;
    })
    .filter((tx) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        tx.description.toLowerCase().includes(q) ||
        tx.recipient.name.toLowerCase().includes(q) ||
        tx.recipient.identifier.toLowerCase().includes(q) ||
        tx.referenceId.toLowerCase().includes(q)
      );
    });

  const recentTransactions = filteredTransactions.slice(0, 6);

  const notificationsList = [
    {
      id: 'notif_1',
      title: 'Electricity Bill Paid',
      desc: 'BESCOM bill payment of ₹1,450 was successful.',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 'notif_2',
      title: 'Payment Received',
      desc: 'Pooja Rao sent you ₹2,500.00 via UPI.',
      time: '1 day ago',
      read: true,
    },
    {
      id: 'notif_3',
      title: 'KYC Verified (Tier 2)',
      desc: 'Your monthly wallet limit has been raised to ₹2,00,000.',
      time: '3 days ago',
      read: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Welcome back, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Tier {currentUser.kycTier} Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            VUPAY ID: <span className="font-semibold text-slate-700">{currentUser.vupayId}</span> · Phone: +91 {currentUser.mobile}
          </p>
        </div>

        {/* Real-time live status + Tour + notification + Scan QR */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Live Real-Time Feed Indicator & Push Simulator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${realtimeConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${realtimeConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
            <span className="text-[11px] font-semibold text-slate-700 hidden sm:inline">
              Live Feed
            </span>
            <button
              onClick={() => simulateIncomingPayment('Pooja Rao', 2500)}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors cursor-pointer"
              title="Simulate incoming WebSocket payment push"
            >
              + Push Test
            </button>
          </div>

          {/* Guided Onboarding Tour Button */}
          <button
            onClick={startTour}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Guided Tour</span>
          </button>

          {/* Quick notification trigger */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 relative cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-xl p-3 z-30 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-semibold text-xs text-slate-900">Notifications</span>
                  <span className="text-[10px] text-slate-400">All caught up</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notificationsList.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-slate-50 text-xs space-y-0.5">
                      <p className="font-semibold text-slate-800">{n.title}</p>
                      <p className="text-slate-600 text-[11px]">{n.desc}</p>
                      <p className="text-slate-400 text-[10px] pt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            data-tour="qr-action"
            onClick={() => setActiveModal('qr_scan')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>
        </div>
      </div>

      {/* Top Section: Balance Card & Primary Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Main Balance Card (lg:col-span-6) */}
        <div
          data-tour="balance"
          className="lg:col-span-6 bg-[#101B35] text-white rounded-2xl p-7 border border-slate-800 shadow-lg relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-600/20 blur-2xl pointer-events-none" />
          
          <div className="space-y-4 relative">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium tracking-wide uppercase">Primary Wallet Balance</span>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label={hideBalance ? 'Show balance' : 'Hide balance'}
              >
                {hideBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{hideBalance ? 'Show' : 'Hide'}</span>
              </button>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight tabular-nums">
                {hideBalance ? '••••••••' : formatINR(currentUser.balance)}
              </p>
              <p className="text-xs text-slate-400 mt-1">Available for transfers, withdrawals & bills</p>
            </div>

            {/* Monthly Limit Bar */}
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Monthly Limit (Tier {currentUser.kycTier})</span>
                <span className="font-mono tabular-nums">
                  {formatINR(currentUser.monthlySpent)} / {formatINR(currentUser.monthlyLimit)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (currentUser.monthlySpent / currentUser.monthlyLimit) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons inside Card */}
          <div className="grid grid-cols-4 gap-2 pt-6 mt-6 border-t border-slate-800/80">
            <button
              data-tour="send-action"
              onClick={() => setActiveModal('send')}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 text-cyan-300" />
              <span className="text-[11px] font-medium">Send</span>
            </button>

            <button
              data-tour="add-action"
              onClick={() => setActiveModal('add_money')}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-medium">Add</span>
            </button>

            <button
              onClick={() => setActiveModal('receive')}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] font-medium">Request</span>
            </button>

            <button
              onClick={() => setActiveModal('withdraw')}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span className="text-[11px] font-medium">Withdraw</span>
            </button>
          </div>
        </div>

        {/* Quick Contacts / Beneficiaries & Shortcuts (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-sans">Quick Pay Beneficiaries</h2>
                <p className="text-xs text-slate-500">1-click transfer to frequent contacts</p>
              </div>
              <button
                onClick={() => setActiveModal('send')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                + New Contact
              </button>
            </div>

            {/* Quick Contacts Circles */}
            <div className="flex items-center gap-4 overflow-x-auto py-2">
              {beneficiaries.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveModal('send');
                  }}
                  className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-full ${b.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-sm group-hover:ring-2 group-hover:ring-blue-500 group-hover:scale-105 transition-all`}
                  >
                    {b.initials}
                  </div>
                  <span className="text-xs font-medium text-slate-700 max-w-[64px] truncate">
                    {b.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Category Hub Navigation */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-3">
            <button
              onClick={() => setCurrentView('bills')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-left transition-colors cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Electricity Bill</p>
              <p className="text-[10px] text-slate-500">BESCOM, Tata</p>
            </button>

            <button
              onClick={() => setCurrentView('bills')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-left transition-colors cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                <Receipt className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Mobile 5G</p>
              <p className="text-[10px] text-slate-500">Airtel, Jio, Vi</p>
            </button>

            <button
              onClick={() => setCurrentView('wallet')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-left transition-colors cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
                <CreditCard className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Ledger Statement</p>
              <p className="text-[10px] text-slate-500">Export CSV</p>
            </button>
          </div>
        </div>

      </div>

      {/* Analytics & Charts: Income vs Expense & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cashflow Bar Chart (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">Cashflow: Income vs. Expenses</h2>
              <p className="text-xs text-slate-500">Past 6 months wallet debits and credits</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block" /> Credits
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" /> Debits
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#64748B" />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="#64748B"
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, '']}
                  contentStyle={{
                    backgroundColor: '#101B35',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="income" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Donut (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans">Spending Breakdown</h2>
            <p className="text-xs text-slate-500">Distribution by transaction category</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  ₹{cat.value.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Transactions List & Audit Ledger */}
      <div data-tour="recent-ledger" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">Recent Wallet Transactions</h2>
            <p className="text-xs text-slate-500">Double-entry audit log of your wallet debits and credits</p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search description, recipient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-60"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('credit')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterType === 'credit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Credits
              </button>
              <button
                onClick={() => setFilterType('debit')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterType === 'debit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Debits
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-y border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Transaction / Party</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Reference ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No transactions match your query.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => {
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
                            {isCredit ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {isCredit ? tx.sender.name : tx.recipient.name}
                            </p>
                            <p className="text-[11px] text-slate-500">{tx.description}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 capitalize text-slate-600">
                        <span className="font-medium">{tx.category.replace('_', ' ')}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        {tx.referenceId}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(tx.timestamp).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
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

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedTransaction(tx);
                            setActiveModal('receipt');
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <span>Showing {recentTransactions.length} of {transactions.length} ledger records</span>
          <button
            onClick={() => setCurrentView('wallet')}
            className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Ledger Statement</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
