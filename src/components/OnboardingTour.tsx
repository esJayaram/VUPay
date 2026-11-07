import React, { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Wallet,
  PlusCircle,
  Send,
  QrCode,
  FileSpreadsheet,
} from 'lucide-react';

interface StepInfo {
  targetSelector: string;
  title: string;
  description: string;
  actionHint: string;
  icon: any;
}

const TOUR_STEPS: StepInfo[] = [
  {
    targetSelector: '[data-tour="balance"]',
    title: '1. Available Balance & KYC Limits',
    description:
      'Track your liquid wallet balance in real-time. Use the eye button to toggle privacy in public spaces, and track your monthly spending limit.',
    actionHint: 'Your funds are backed 100% in reserve escrow.',
    icon: Wallet,
  },
  {
    targetSelector: '[data-tour="add-action"]',
    title: '2. Load Funds with Zero Fees',
    description:
      'Add money instantly to your wallet using Google Pay, PhonePe, all Indian debit cards, or Net Banking with zero transaction charges.',
    actionHint: 'Top-ups settle in under 0.4 seconds.',
    icon: PlusCircle,
  },
  {
    targetSelector: '[data-tour="send-action"]',
    title: '3. Instant Peer-to-Peer Transfers',
    description:
      'Transfer money to any 10-digit mobile number or VUPAY UPI handle (e.g. pooja@vupay). Every transfer is secured by your 4-digit PIN.',
    actionHint: 'Click saved contacts for 1-click repeat payments.',
    icon: Send,
  },
  {
    targetSelector: '[data-tour="qr-action"]',
    title: '4. Universal QR Code Scanner',
    description:
      'Scan any UPI QR code or BharatQR at cafes, supermarkets, and transit stations with auto-amount detection and instant digital receipts.',
    actionHint: 'Works across all Indian retail merchants.',
    icon: QrCode,
  },
  {
    targetSelector: '[data-tour="recent-ledger"]',
    title: '5. Double-Entry Audit Ledger & Receipts',
    description:
      'Inspect your complete immutable ledger with audit reference IDs. Filter debits and credits, download official PDF receipts, or export CSV statements.',
    actionHint: 'Mathematical zero-sum ledger verification.',
    icon: FileSpreadsheet,
  },
];

export const OnboardingTour: React.FC = () => {
  const {
    isTourActive,
    currentTourStep,
    nextTourStep,
    prevTourStep,
    skipTour,
    finishTour,
    setActiveModal,
  } = useWallet();

  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const currentStep = TOUR_STEPS[currentTourStep];

  useEffect(() => {
    if (!isTourActive || !currentStep) return;

    const updatePosition = () => {
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setCoords(null);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isTourActive, currentTourStep]);

  if (!isTourActive || !currentStep) return null;

  const isLast = currentTourStep === TOUR_STEPS.length - 1;
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dark Dimmed Backdrop Overlay with punch-hole */}
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] pointer-events-auto transition-opacity" />

      {/* Target Element Spotlight Ring (if target found) */}
      {coords && (
        <div
          className="absolute rounded-2xl ring-4 ring-cyan-400 ring-offset-4 ring-offset-slate-950 shadow-2xl transition-all duration-300 pointer-events-none z-50 animate-pulse"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            height: `${coords.height}px`,
          }}
        />
      )}

      {/* Guided Tooltip Dialog (Anchored Centrally / Bottom Right for optimal ergonomics) */}
      <div className="fixed bottom-8 right-4 sm:right-8 z-50 pointer-events-auto max-w-md w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
        
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-mono">
                Step {currentTourStep + 1} of {TOUR_STEPS.length}
              </span>
              <p className="text-xs font-bold text-slate-900 leading-tight">VUPAY Feature Tour</p>
            </div>
          </div>

          <button
            onClick={skipTour}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Skip onboarding tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 font-sans">{currentStep.title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{currentStep.description}</p>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>{currentStep.actionHint}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentTourStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Nav Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={skipTour}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {currentTourStep > 0 && (
              <button
                onClick={prevTourStep}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            {!isLast ? (
              <button
                onClick={nextTourStep}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={finishTour}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Finish & Start</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
