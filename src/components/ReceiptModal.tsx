import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatINR } from '../utils/walletEngine';
import {
  X,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  Download,
} from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeModal, setActiveModal, selectedTransaction, showToast } = useWallet();
  const [copied, setCopied] = useState(false);

  if (activeModal !== 'receipt' || !selectedTransaction) return null;

  const tx = selectedTransaction;
  const isCredit = tx.type === 'credit';

  const handleCopyRef = () => {
    navigator.clipboard.writeText(tx.referenceId);
    setCopied(true);
    showToast('Reference ID copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Printable Receipt Card Body */}
        <div id="printable-receipt" className="p-6 space-y-6 bg-white">
          
          {/* Top Brand & Status */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                V
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  VU<span className="text-cyan-500">PAY</span>
                </span>
                <p className="text-[10px] text-slate-400 font-mono">vupay.in · Digital Wallet</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Settled
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="print:hidden p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Close receipt modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Amount Paid */}
          <div className="text-center py-2 space-y-1">
            <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">
              {isCredit ? 'Amount Credited to Wallet' : 'Amount Debited'}
            </p>
            <p
              className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight tabular-nums ${
                isCredit ? 'text-emerald-600' : 'text-slate-900'
              }`}
            >
              {isCredit ? '+' : '-'}
              {formatINR(tx.amount)}
            </p>
            <p className="text-xs text-slate-500 font-medium">{tx.description}</p>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Reference ID:</span>
              <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-800">
                <span>{tx.referenceId}</span>
                <button
                  onClick={handleCopyRef}
                  className="print:hidden text-slate-400 hover:text-blue-600 cursor-pointer"
                  title="Copy Reference ID"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Timestamp:</span>
              <span className="font-mono text-slate-700">
                {new Date(tx.timestamp).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Payment Rail:</span>
              <span className="font-mono font-semibold text-slate-800">{tx.paymentRail}</span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
              <span className="text-slate-500">Sender:</span>
              <div className="text-right">
                <p className="font-semibold text-slate-800">{tx.sender.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">{tx.sender.identifier}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
              <span className="text-slate-500">Recipient:</span>
              <div className="text-right">
                <p className="font-semibold text-slate-800">{tx.recipient.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">{tx.recipient.identifier}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
              <span className="text-slate-500">Convenience Fee:</span>
              <span className="font-mono font-semibold text-emerald-600">₹0.00 (Zero Fee)</span>
            </div>
          </div>

          {/* Verification Barcode & Cryptographic Seal */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Double-Entry Verified</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">IDEM: {tx.idempotencyKey.slice(0, 16)}</span>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden when printing) */}
        <div className="print:hidden p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={() => setActiveModal(null)}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
