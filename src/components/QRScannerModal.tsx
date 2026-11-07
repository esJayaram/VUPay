import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatINR } from '../utils/walletEngine';
import {
  X,
  QrCode,
  Camera,
  CheckCircle2,
  Lock,
  ArrowRight,
  Store,
  Sparkles,
} from 'lucide-react';

export const QRScannerModal: React.FC = () => {
  const { currentUser, activeModal, setActiveModal, sendMoney, showToast } = useWallet();

  const [scannedMerchant, setScannedMerchant] = useState<{
    name: string;
    vupayId: string;
    amount: number;
    category: string;
  } | null>(null);

  const [pin, setPin] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);

  if (activeModal !== 'qr_scan' || !currentUser) return null;

  const presetMerchants = [
    {
      name: 'Arlo Artisan Cafe',
      vupayId: 'arlo.cafe@vupay',
      amount: 320,
      category: 'Coffee & Bakery',
    },
    {
      name: 'Fresh Grocers Supermarket',
      vupayId: 'freshgrocers@vupay',
      amount: 840,
      category: 'Groceries',
    },
    {
      name: 'Namma Metro Transit',
      vupayId: 'metro.bengaluru@vupay',
      amount: 60,
      category: 'Public Transport',
    },
    {
      name: 'Indian Oil Petrol Pump',
      vupayId: 'ioc.koramangala@vupay',
      amount: 1200,
      category: 'Fuel & Service',
    },
  ];

  const handleSelectPreset = (m: typeof presetMerchants[0]) => {
    setScannedMerchant(m);
  };

  const handlePayMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedMerchant) return;

    if (currentUser.balance < scannedMerchant.amount) {
      showToast('Insufficient wallet balance. Please add funds.', 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      sendMoney({
        recipientIdentifier: scannedMerchant.vupayId,
        recipientName: scannedMerchant.name,
        amount: scannedMerchant.amount,
        description: `QR Payment at ${scannedMerchant.name}`,
        pin,
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#101B35] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Scan & Pay Any QR</h2>
              <p className="text-[11px] text-slate-300">UPI & BharatQR Interoperable</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close scanner modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!scannedMerchant ? (
          <div className="p-6 space-y-6">
            {/* Viewfinder Simulation */}
            <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 flex items-center justify-center shadow-lg">
              {/* Corner guides */}
              <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-cyan-400" />

              {/* Laser line moving animation */}
              <div className="absolute inset-x-6 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse top-1/2" />

              <div className="text-center space-y-2 p-4">
                <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">Point camera at any UPI QR code</p>
                <p className="text-[10px] text-slate-500 font-mono">Live Prober Active</p>
              </div>
            </div>

            {/* Click to Simulate Scan with preset merchants */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-blue-600" />
                <span>Simulate Scanning a Merchant QR:</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {presetMerchants.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => handleSelectPreset(m)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all cursor-pointer group"
                  >
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                      {m.name}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>{m.category}</span>
                      <span className="font-mono font-bold text-slate-900">₹{m.amount}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePayMerchant} className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{scannedMerchant.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{scannedMerchant.vupayId}</p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Verified Merchant
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-600">Total Payable:</span>
                <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
                  {formatINR(scannedMerchant.amount)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter 4-Digit VUPAY PIN to Pay
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-widest text-xl font-bold font-mono py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1 text-center">Demo PIN: 1234</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setScannedMerchant(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Scan Another
              </button>
              <button
                type="submit"
                disabled={isProcessing || pin.length !== 4}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                {isProcessing ? 'Paying...' : `Pay ${formatINR(scannedMerchant.amount)}`}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
