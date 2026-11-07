import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatINR } from '../utils/walletEngine';
import {
  X,
  CreditCard,
  Building2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const WithdrawMoneyModal: React.FC = () => {
  const { currentUser, bankAccounts, activeModal, setActiveModal, withdrawMoney, showToast } = useWallet();
  const [selectedBankId, setSelectedBankId] = useState(bankAccounts[0]?.id || '');
  const [amount, setAmount] = useState('5000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (activeModal !== 'withdraw' || !currentUser) return null;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const num = parseFloat(amount);

    if (!num || num <= 0) {
      setErrorMessage('Please enter an amount greater than ₹0.');
      return;
    }

    if (num > currentUser.balance) {
      setErrorMessage(`Insufficient balance. Available: ${formatINR(currentUser.balance)}.`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const res = withdrawMoney({
        amount: num,
        bankAccountId: selectedBankId,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Withdrawal failed.');
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#101B35] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Withdraw to Bank</h2>
              <p className="text-[11px] text-slate-300">Instant IMPS bank payout · 0% fee</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close withdraw modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleWithdraw} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Amount input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Withdrawal Amount</label>
              <span className="text-[11px] text-slate-500 font-mono">
                Available: {formatINR(currentUser.balance)}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-2 text-base font-bold font-mono text-slate-400">₹</span>
              <input
                type="number"
                min="100"
                step="1"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMessage('');
                }}
                required
                className="w-full pl-8 pr-3 py-2 text-xl font-bold font-mono text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Quick full withdraw button */}
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={() => setAmount(currentUser.balance.toString())}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                Withdraw Full Balance ({formatINR(currentUser.balance)})
              </button>
            </div>
          </div>

          {/* Destination Bank Account */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Destination Bank</label>
            <div className="space-y-2">
              {bankAccounts.map((b) => {
                const isSelected = selectedBankId === b.id;
                return (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setSelectedBankId(b.id)}
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
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900">{b.bankName}</p>
                        {b.isPrimary && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        A/C: {b.accountNumber} · IFSC: {b.ifsc}
                      </p>
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
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isProcessing ? 'Processing IMPS Transfer...' : `Confirm Withdrawal of ${formatINR(parseFloat(amount) || 0)}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
