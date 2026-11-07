import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatINR } from '../utils/walletEngine';
import {
  X,
  PlusCircle,
  CreditCard,
  Building,
  Smartphone,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { PaymentRail } from '../types/wallet';

export const AddMoneyModal: React.FC = () => {
  const { currentUser, activeModal, setActiveModal, addMoney } = useWallet();
  const [amount, setAmount] = useState('2500');
  const [selectedMethod, setSelectedMethod] = useState<{
    rail: PaymentRail;
    name: string;
  }>({
    rail: 'UPI',
    name: 'Google Pay / PhonePe UPI',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (activeModal !== 'add_money' || !currentUser) return null;

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      addMoney({
        amount: num,
        rail: selectedMethod.rail,
        sourceName: selectedMethod.name,
      });
    }, 450);
  };

  const paymentOptions = [
    {
      rail: 'UPI' as PaymentRail,
      name: 'Instant UPI (Google Pay / PhonePe)',
      desc: 'Instant 0.4s auto-credit · Zero fee',
      icon: Smartphone,
    },
    {
      rail: 'CARD' as PaymentRail,
      name: 'Debit Card (Visa / Mastercard / RuPay)',
      desc: 'All Indian domestic debit cards',
      icon: CreditCard,
    },
    {
      rail: 'NETBANKING' as PaymentRail,
      name: 'Net Banking (HDFC, ICICI, SBI, Axis)',
      desc: 'Direct bank account authorization',
      icon: Building,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#101B35] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Add Money to Wallet</h2>
              <p className="text-[11px] text-slate-300">0% convenience fee on all top-ups</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close add money modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAddFunds} className="p-6 space-y-5">
          {/* Amount input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Enter Top-Up Amount</label>
              <span className="text-[11px] text-slate-500 font-mono">
                Current: {formatINR(currentUser.balance)}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-2 text-base font-bold font-mono text-slate-400">₹</span>
              <input
                type="number"
                min="10"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-2 text-xl font-bold font-mono text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-2 mt-2">
              {[1000, 2500, 5000, 10000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="flex-1 py-1 text-center text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono cursor-pointer transition-colors"
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Funding Rail</label>
            <div className="space-y-2">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedMethod.name === opt.name;
                return (
                  <button
                    type="button"
                    key={opt.name}
                    onClick={() => setSelectedMethod({ rail: opt.rail, name: opt.name })}
                    className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">{opt.name}</p>
                      <p className="text-[11px] text-slate-500">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing || !amount || parseFloat(amount) <= 0}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isProcessing ? 'Processing Top-up...' : `Add ${formatINR(parseFloat(amount) || 0)} Instantly`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
