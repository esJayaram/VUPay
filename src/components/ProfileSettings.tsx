import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatINR } from '../utils/walletEngine';
import {
  User,
  ShieldCheck,
  Building,
  Lock,
  Bell,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Fingerprint,
  Plus,
  Smartphone,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const {
    currentUser,
    bankAccounts,
    updateKYC,
    updatePin,
    showToast,
    setActiveModal,
    disableTwoFactor,
  } = useWallet();

  const [activeTab, setActiveTab] = useState<'profile' | 'kyc' | 'banks' | 'security'>('profile');

  // KYC form
  const [panInput, setPanInput] = useState(currentUser?.panNumber || 'ABCPS1234F');
  const [aadhaarInput, setAadhaarInput] = useState(currentUser?.aadhaarLastFour || '4829');

  // PIN change form
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Security toggles
  const [twoFactor, setTwoFactor] = useState(currentUser?.twoFactorEnabled ?? true);
  const [biometric, setBiometric] = useState(currentUser?.biometricEnabled ?? true);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  // Bank accounts add form
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBankName, setNewBankName] = useState('State Bank of India');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newIfsc, setNewIfsc] = useState('');

  if (!currentUser) return null;

  const handleKycUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!panInput || panInput.length < 10) {
      showToast('Please enter a valid 10-character PAN number.', 'error');
      return;
    }
    updateKYC({ panNumber: panInput.toUpperCase(), aadhaarLastFour: aadhaarInput });
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (currentPin !== currentUser.pin) {
      setPinError('Current PIN is incorrect. (Demo default: 1234)');
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinError('New PIN must be exactly 4 numeric digits.');
      return;
    }

    if (newPin !== confirmPin) {
      setPinError('New PIN and Confirm PIN do not match.');
      return;
    }

    updatePin(newPin);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Profile & Security Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal credentials, digital KYC compliance, linked banks, and transaction PIN
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-semibold">
        {[
          { id: 'profile', label: 'Personal Information', icon: User },
          { id: 'kyc', label: 'KYC & Spending Limits', icon: ShieldCheck },
          { id: 'banks', label: 'Linked Bank Accounts', icon: Building },
          { id: 'security', label: 'PIN & Security Controls', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PERSONAL INFORMATION */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 max-w-2xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-500 font-mono">{currentUser.vupayId}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Tier {currentUser.kycTier} Verified Account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                disabled
                value={currentUser.name}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Registered Email</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
              <input
                type="text"
                disabled
                value={`+91 ${currentUser.mobile}`}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">VUPAY Virtual UPI Handle</label>
              <input
                type="text"
                disabled
                value={currentUser.vupayId}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-mono cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KYC & LIMITS */}
      {activeTab === 'kyc' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-4xl">
          <div className="md:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-sans">Current KYC Status</h2>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Tier 2 Full Video KYC Verified</span>
              </div>
              <p className="text-xs text-emerald-700">
                You enjoy the maximum monthly spending limit of ₹2,00,000.00 with unrestricted peer-to-peer transfers and instant bank cashout.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2">
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span>Permanent Account Number (PAN):</span>
                <span className="font-mono font-bold text-slate-800">{currentUser.panNumber || 'ABCPS1234F'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span>Aadhaar Masked Number:</span>
                <span className="font-mono font-bold text-slate-800">XXXX-XXXX-{currentUser.aadhaarLastFour || '4829'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Monthly Limit:</span>
                <span className="font-mono font-bold text-blue-600">{formatINR(currentUser.monthlyLimit)}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-sans">Re-Verify / Update Documents</h2>
            <form onSubmit={handleKycUpgrade} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Enter 10-digit PAN Card Number</label>
                <input
                  type="text"
                  maxLength={10}
                  value={panInput}
                  onChange={(e) => setPanInput(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Last 4 Digits of Aadhaar</label>
                <input
                  type="text"
                  maxLength={4}
                  value={aadhaarInput}
                  onChange={(e) => setAadhaarInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Simulate Instant Document Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: LINKED BANK ACCOUNTS */}
      {activeTab === 'banks' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">Linked Bank Accounts</h2>
              <p className="text-xs text-slate-500">Accounts verified for instant withdrawals and loading</p>
            </div>
            <button
              onClick={() => setShowAddBank(!showAddBank)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Bank
            </button>
          </div>

          <div className="space-y-3">
            {bankAccounts.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">{b.bankName}</p>
                      {b.isPrimary && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Primary Payout
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">
                      A/C: {b.accountNumber} · IFSC: {b.ifsc}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Active
                </span>
              </div>
            ))}
          </div>

          {showAddBank && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3 text-xs">
              <p className="font-bold text-slate-900">Add New Bank Account</p>
              <div>
                <label className="block text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. 5010029104812"
                  value={newAccountNumber}
                  onChange={(e) => setNewAccountNumber(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  placeholder="e.g. SBIN0001042"
                  value={newIfsc}
                  onChange={(e) => setNewIfsc(e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono uppercase"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  showToast(`Bank account for ${newBankName} added successfully.`, 'success');
                  setShowAddBank(false);
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg cursor-pointer"
              >
                Verify & Link Account
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PIN & SECURITY */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-4xl">
          {/* Change PIN */}
          <div className="md:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 font-sans">Change Transaction PIN</h2>
            </div>
            <p className="text-xs text-slate-500">
              Your 4-digit PIN authorizes all peer transfers, bill clearances, and withdrawals.
            </p>

            {pinError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {pinError}
              </div>
            )}

            <form onSubmit={handlePinSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="•••• (Demo: 1234)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono tracking-widest text-center text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono tracking-widest text-center text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono tracking-widest text-center text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Update Transaction PIN
              </button>
            </form>
          </div>

          {/* 2FA & Biometric */}
          <div className="md:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-900 font-sans">Two-Factor Authentication (2FA)</h2>

            {/* 2FA Status Card */}
            <div className={`p-4 rounded-xl border space-y-3 text-xs ${
              currentUser.twoFactorEnabled
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-amber-50/60 border-amber-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentUser.twoFactorEnabled ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                  )}
                  <div>
                    <p className="font-bold text-slate-900">
                      {currentUser.twoFactorEnabled ? '2FA Protection Active' : '2FA Protection Disabled'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {currentUser.twoFactorEnabled
                        ? `Secured via ${currentUser.twoFactorConfig?.method === 'sms' ? 'SMS Codes' : 'Authenticator App (TOTP)'}`
                        : 'Accounts without 2FA are vulnerable to credential stuffing'}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  currentUser.twoFactorEnabled
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {currentUser.twoFactorEnabled ? 'ENFORCED' : 'OFF'}
                </span>
              </div>

              {currentUser.twoFactorEnabled && (
                <div className="pt-2 border-t border-emerald-200/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Active Method:</span>
                    <span className="font-semibold text-slate-900 capitalize">
                      {currentUser.twoFactorConfig?.method === 'sms' ? 'SMS (+91 ' + currentUser.mobile + ')' : 'Google Authenticator'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Recovery Codes:</span>
                    <button
                      type="button"
                      onClick={() => setShowBackupCodes(!showBackupCodes)}
                      className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      {showBackupCodes ? 'Hide Codes' : 'View 4 Backup Codes'}
                    </button>
                  </div>

                  {showBackupCodes && (
                    <div className="p-2.5 rounded-lg bg-white border border-emerald-200 space-y-2">
                      <p className="text-[10px] text-slate-500">
                        Use any code if you lose phone access. Each code works once:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] font-bold text-slate-800 text-center">
                        {(currentUser.twoFactorConfig?.backupCodes || ['8492-3104', '7210-9481', '6301-4829', '9104-5528']).map((code, idx) => (
                          <div key={idx} className="p-1 rounded bg-slate-50 border border-slate-200">
                            {code}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            (currentUser.twoFactorConfig?.backupCodes || ['8492-3104', '7210-9481', '6301-4829', '9104-5528']).join('\n')
                          );
                          setCopiedCodes(true);
                          showToast('Backup codes copied to clipboard.', 'success');
                          setTimeout(() => setCopiedCodes(false), 2000);
                        }}
                        className="w-full py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 rounded border border-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {copiedCodes ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCodes ? 'Copied' : 'Copy All Codes'}</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveModal('two_factor_setup')}
                      className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs cursor-pointer transition-colors"
                    >
                      Change Method / Key
                    </button>
                    <button
                      type="button"
                      onClick={() => disableTwoFactor()}
                      className="py-1.5 px-3 hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Disable
                    </button>
                  </div>
                </div>
              )}

              {!currentUser.twoFactorEnabled && (
                <div className="pt-2 border-t border-amber-200/60">
                  <button
                    type="button"
                    onClick={() => setActiveModal('two_factor_setup')}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Setup Two-Factor Authentication Now
                  </button>
                </div>
              )}
            </div>

            {/* Biometric Toggle */}
            <div className="space-y-4 text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">Biometric / Face ID Unlock</p>
                  <p className="text-slate-500">Authenticate quick transfers via WebAuthn</p>
                </div>
                <button
                  onClick={() => {
                    setBiometric(!biometric);
                    showToast(`Biometric unlock ${!biometric ? 'activated' : 'deactivated'}.`, 'info');
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    biometric ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle Biometric unlock"
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform transform ${
                      biometric ? 'translate-x-6' : 'translate-x-1'
                    } top-1`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
