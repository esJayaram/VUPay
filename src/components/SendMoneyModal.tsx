import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatINR, validateRecipientIdentifier } from '../utils/walletEngine';
import {
  X,
  Send,
  Zap,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const SendMoneyModal: React.FC = () => {
  const {
    currentUser,
    activeModal,
    setActiveModal,
    sendMoney,
    beneficiaries,
  } = useWallet();

  const [step, setStep] = useState<'input' | 'pin'>('input');
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState<string>('500');
  const [description, setDescription] = useState('');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (activeModal !== 'send' || !currentUser) return null;

  const handleSelectBeneficiary = (b: { identifier: string; name: string }) => {
    setRecipient(b.identifier);
    setRecipientName(b.name);
    setErrorMessage('');
  };

  const handleProceedToPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const valResult = validateRecipientIdentifier(recipient);
    if (!valResult.isValid) {
      setErrorMessage('Please enter a valid 10-digit mobile number or VUPAY ID (e.g. name@vupay).');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter an amount greater than ₹0.');
      return;
    }

    if (numAmount > currentUser.balance) {
      setErrorMessage(`Insufficient wallet balance. Available: ${formatINR(currentUser.balance)}.`);
      return;
    }

    if (currentUser.monthlySpent + numAmount > currentUser.monthlyLimit) {
      setErrorMessage(
        `Transfer exceeds your monthly KYC limit of ${formatINR(currentUser.monthlyLimit)}.`
      );
      return;
    }

    setStep('pin');
  };

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (pin.length !== 4) {
      setErrorMessage('Please enter your 4-digit PIN.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = sendMoney({
        recipientIdentifier: recipient.trim().toLowerCase(),
        recipientName: recipientName || recipient,
        amount: parseFloat(amount),
        description: description || 'Peer-to-peer transfer',
        pin,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Transfer failed.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#101B35] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Send Money Instantly</h2>
              <p className="text-[11px] text-slate-300">0% transfer fees via VUPAY ID or Mobile</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close send money modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Input details */}
        {step === 'input' && (
          <form onSubmit={handleProceedToPin} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick Beneficiaries */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Recent Beneficiaries</label>
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {beneficiaries.map((b) => (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => handleSelectBeneficiary(b)}
                    className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
                  >
                    <div
                      className={`w-9 h-9 rounded-full ${b.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      {b.initials}
                    </div>
                    <span className="text-[10px] text-slate-600 max-w-[50px] truncate">
                      {b.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recipient Mobile or VUPAY ID
              </label>
              <input
                type="text"
                placeholder="e.g. 9845012345 or pooja@vupay"
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                  setErrorMessage('');
                }}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Transfer Amount</label>
                <span className="text-[11px] text-slate-500 font-mono">
                  Balance: {formatINR(currentUser.balance)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-base font-bold font-mono text-slate-400">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-2 text-lg font-bold font-mono text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Quick amount chips */}
              <div className="flex items-center gap-2 mt-2">
                {[500, 1000, 2000, 5000].map((amt) => (
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

            {/* Note / Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Note (Optional)
              </label>
              <input
                type="text"
                placeholder="What is this for? e.g. Dinner split, Rent"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: PIN Verification */}
        {step === 'pin' && (
          <form onSubmit={handleConfirmTransfer} className="p-6 space-y-5 text-center">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Authorize Transfer</h3>
              <p className="text-xs text-slate-500 mt-1">
                Sending <span className="font-bold text-slate-900 font-mono">{formatINR(parseFloat(amount))}</span> to{' '}
                <span className="font-bold text-slate-900">{recipientName || recipient}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Enter 4-Digit VUPAY PIN
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-40 mx-auto text-center tracking-widest text-2xl font-bold font-mono py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Default Demo PIN: <code className="font-bold text-slate-600">1234</code>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || pin.length !== 4}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                {isSubmitting ? 'Verifying...' : 'Authorize & Pay'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
