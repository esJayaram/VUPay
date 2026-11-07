import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { TwoFactorMethod } from '../types/wallet';
import { generateMockBackupCodes } from '../utils/walletEngine';
import {
  X,
  ShieldCheck,
  Smartphone,
  KeyRound,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
  Download,
  Lock,
} from 'lucide-react';

export const TwoFactorSetupModal: React.FC = () => {
  const { currentUser, activeModal, setActiveModal, enableTwoFactor, showToast } = useWallet();

  const [step, setStep] = useState<'choose_method' | 'configure' | 'backup_codes'>('choose_method');
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod>('authenticator');
  const [secretKey] = useState('VUPY-2026-X84J-992K');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (activeModal !== 'two_factor_setup' || !currentUser) return null;

  const handleMethodSelect = (method: TwoFactorMethod) => {
    setSelectedMethod(method);
    setErrorMsg('');
    setStep('configure');
  };

  const handleVerifyAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const clean = verificationCode.trim();
    if (clean.length !== 6 || !/^\d{6}$/.test(clean)) {
      setErrorMsg('Please enter a valid 6-digit confirmation code. (Demo: 123456 or 482910)');
      return;
    }

    const codes = generateMockBackupCodes();
    setBackupCodes(codes);
    setStep('backup_codes');
  };

  const handleFinishSetup = () => {
    enableTwoFactor(selectedMethod, secretKey);
    setActiveModal(null);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedSecret(true);
    showToast('Secret key copied to clipboard.', 'success');
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedCodes(true);
    showToast('Backup recovery codes copied.', 'success');
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#101B35] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Two-Factor Authentication (2FA)</h2>
              <p className="text-[11px] text-slate-300">Reinforce your wallet security</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close 2FA setup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* STEP 1: CHOOSE METHOD */}
          {step === 'choose_method' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">Choose 2FA Verification Method</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Require an additional verification code when logging in to your VUPAY wallet.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleMethodSelect('authenticator')}
                  className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all cursor-pointer group flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">Authenticator App</p>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Use Google Authenticator, Authy, or 1Password to generate time-based one-time security codes.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleMethodSelect('sms')}
                  className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all cursor-pointer group flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">SMS Verification Codes</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Receive a 6-digit text message code on your registered mobile number (+91 {currentUser.mobile}).
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIGURE (AUTHENTICATOR OR SMS) */}
          {step === 'configure' && (
            <form onSubmit={handleVerifyAndProceed} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {selectedMethod === 'authenticator' ? (
                <div className="space-y-4 text-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Scan QR in Authenticator App</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Open Google Authenticator, tap '+', and scan this code:
                    </p>
                  </div>

                  {/* High-Fidelity SVG QR representation */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block shadow-inner">
                    <svg viewBox="0 0 100 100" className="w-36 h-36 mx-auto text-slate-900 fill-current">
                      <rect x="5" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="12" y="12" width="12" height="12" rx="1" />
                      <rect x="69" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="76" y="12" width="12" height="12" rx="1" />
                      <rect x="5" y="69" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="12" y="76" width="12" height="12" rx="1" />
                      <rect x="36" y="12" width="6" height="6" />
                      <rect x="46" y="12" width="6" height="6" />
                      <rect x="56" y="12" width="6" height="6" />
                      <rect x="36" y="24" width="6" height="6" />
                      <rect x="12" y="44" width="6" height="6" />
                      <rect x="24" y="44" width="6" height="6" />
                      <rect x="36" y="36" width="28" height="28" rx="4" fill="#2563EB" />
                      <circle cx="50" cy="50" r="9" fill="white" />
                      <text x="50" y="53" fontSize="10" fontWeight="bold" fill="#2563EB" textAnchor="middle">
                        2FA
                      </text>
                      <rect x="68" y="40" width="6" height="6" />
                      <rect x="78" y="40" width="6" height="6" />
                      <rect x="40" y="68" width="6" height="6" />
                      <rect x="50" y="68" width="6" height="6" />
                      <rect x="70" y="70" width="6" height="6" />
                    </svg>
                  </div>

                  {/* Secret Key with Copy */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block text-left">Can't scan? Enter manually:</span>
                      <span className="font-mono font-bold text-slate-800">{secretKey}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
                      title="Copy Key"
                    >
                      {copiedSecret ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Verify Registered Mobile</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      We sent a 6-digit test code to <span className="font-mono font-bold text-slate-800">+91 {currentUser.mobile}</span>.
                    </p>
                  </div>
                </div>
              )}

              {/* Code Verification Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Enter 6-Digit Code from {selectedMethod === 'authenticator' ? 'App' : 'SMS'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  autoFocus
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-xl font-bold font-mono tracking-widest py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50"
                />
                <p className="text-[11px] text-slate-400 text-center">Demo Code: <code className="font-bold text-slate-600">123456</code></p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('choose_method')}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={verificationCode.length !== 6}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  Verify & Proceed
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: BACKUP RECOVERY CODES */}
          {step === 'backup_codes' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-sans">Save Your Recovery Backup Codes</h3>
                <p className="text-xs text-slate-500">
                  If you ever lose access to your phone or authenticator app, each code can be used once to access your wallet.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-center font-mono font-bold text-xs text-slate-800">
                {backupCodes.map((code, idx) => (
                  <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCodes}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCodes ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCodes ? 'Codes Copied' : 'Copy All Codes'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinishSetup}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  I've Saved My Codes · Enable 2FA
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
