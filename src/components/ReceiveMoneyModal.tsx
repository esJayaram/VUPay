import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatINR } from '../utils/walletEngine';
import {
  X,
  QrCode,
  Copy,
  Check,
  Share2,
  Download,
  Send,
  Zap,
} from 'lucide-react';

export const ReceiveMoneyModal: React.FC = () => {
  const { currentUser, activeModal, setActiveModal, showToast } = useWallet();
  const [activeTab, setActiveTab] = useState<'qr' | 'request'>('qr');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Request form state
  const [requestContact, setRequestContact] = useState('');
  const [requestAmount, setRequestAmount] = useState('1200');
  const [requestNote, setRequestNote] = useState('');

  if (activeModal !== 'receive' || !currentUser) return null;

  const handleCopyVupayId = () => {
    navigator.clipboard.writeText(currentUser.vupayId);
    setCopied(true);
    showToast('VUPAY ID copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Payment request of ₹${requestAmount} sent to ${requestContact}`, 'success');
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#101B35] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Receive & Request Funds</h2>
              <p className="text-[11px] text-slate-300">Share QR or send payment request link</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close receive modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              activeTab === 'qr'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Dynamic Receive QR
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              activeTab === 'request'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Request Money
          </button>
        </div>

        {activeTab === 'qr' ? (
          <div className="p-6 space-y-5 text-center">
            {/* QR Container */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 inline-block shadow-inner">
              <div className="w-52 h-52 bg-white p-3 rounded-xl shadow-xs border border-slate-200 mx-auto flex flex-col items-center justify-center relative">
                {/* Simulated high-fidelity SVG QR pattern */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  {/* Outer corner finders */}
                  <rect x="5" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="12" width="12" height="12" rx="1" />
                  <rect x="69" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="76" y="12" width="12" height="12" rx="1" />
                  <rect x="5" y="69" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="76" width="12" height="12" rx="1" />
                  {/* Interior data pattern simulation */}
                  <rect x="36" y="8" width="6" height="6" />
                  <rect x="46" y="8" width="6" height="6" />
                  <rect x="56" y="8" width="6" height="6" />
                  <rect x="36" y="18" width="6" height="6" />
                  <rect x="56" y="18" width="6" height="6" />
                  <rect x="8" y="36" width="6" height="6" />
                  <rect x="18" y="36" width="6" height="6" />
                  <rect x="28" y="36" width="6" height="6" />
                  <rect x="8" y="46" width="6" height="6" />
                  <rect x="28" y="46" width="6" height="6" />
                  <rect x="8" y="56" width="6" height="6" />
                  <rect x="18" y="56" width="6" height="6" />
                  <rect x="36" y="36" width="28" height="28" rx="4" fill="#2563EB" />
                  {/* Central V badge */}
                  <circle cx="50" cy="50" r="10" fill="white" />
                  <text x="50" y="54" fontSize="12" fontWeight="bold" fill="#2563EB" textAnchor="middle">
                    V
                  </text>
                  <rect x="68" y="36" width="6" height="6" />
                  <rect x="78" y="36" width="6" height="6" />
                  <rect x="88" y="36" width="6" height="6" />
                  <rect x="68" y="46" width="6" height="6" />
                  <rect x="88" y="46" width="6" height="6" />
                  <rect x="36" y="68" width="6" height="6" />
                  <rect x="46" y="68" width="6" height="6" />
                  <rect x="56" y="68" width="6" height="6" />
                  <rect x="36" y="78" width="6" height="6" />
                  <rect x="56" y="78" width="6" height="6" />
                  <rect x="68" y="68" width="6" height="6" />
                  <rect x="78" y="78" width="6" height="6" />
                  <rect x="88" y="88" width="6" height="6" />
                </svg>
              </div>

              <div className="mt-2 text-center">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">{currentUser.vupayId}</p>
                {customAmount && (
                  <p className="text-xs font-bold text-blue-600 mt-1 font-mono">
                    Requested: {formatINR(parseFloat(customAmount) || 0)}
                  </p>
                )}
              </div>
            </div>

            {/* Set Custom Amount input */}
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-semibold text-slate-700">Add Amount to QR (Optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">₹</span>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Copy Button */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCopyVupayId}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'VUPAY ID Copied!' : 'Copy UPI ID'}</span>
              </button>

              <button
                onClick={() => {
                  showToast('QR Code image saved.', 'success');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Save QR
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendRequest} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payer Mobile or VUPAY ID</label>
              <input
                type="text"
                placeholder="e.g. 9845012345 or pooja@vupay"
                value={requestContact}
                onChange={(e) => setRequestContact(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Requested Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm font-bold font-mono text-slate-400">₹</span>
                <input
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  required
                  min="1"
                  className="w-full pl-7 pr-3 py-2 text-base font-bold font-mono text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Note</label>
              <input
                type="text"
                placeholder="e.g. Shared Cab Fare, Dinner split"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send Payment Request Link</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
