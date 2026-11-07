import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  X,
  Lock,
  Smartphone,
  Mail,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { activeModal, setActiveModal, loginAs, showToast } = useWallet();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile');
  const [authType, setAuthType] = useState<'otp' | 'password'>('otp');

  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(['4', '8', '2', '9', '1', '0']);
  const [timer, setTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let interval: any;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  if (activeModal !== 'auth') return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier) {
      setErrorMessage('Please enter your mobile number or email.');
      return;
    }
    setOtpSent(true);
    setTimer(30);
    showToast('6-digit OTP sent to your registered mobile (Demo OTP: 482910)', 'info');
  };

  const handleVerifyOtpAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpValues.join('');
    if (entered.length < 6) {
      setErrorMessage('Please enter the complete 6-digit OTP.');
      return;
    }

    loginAs('user');
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }
    loginAs('user');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpValues];
    newOtp[index] = val.slice(-1);
    setOtpValues(newOtp);

    // auto-focus next
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#101B35] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              V
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                {authMode === 'login' ? 'Sign In to VUPAY' : 'Create Free VUPAY Account'}
              </h2>
              <p className="text-[11px] text-slate-300">Your Money. Your Way.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close auth modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Quick 1-Click Demo Profiles:
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loginAs('user')}
              className="flex-1 py-1.5 px-3 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Arjun (Customer)</span>
            </button>
            <button
              onClick={() => loginAs('admin')}
              className="flex-1 py-1.5 px-3 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Priya (Admin)</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Auth Form */}
          {!otpSent ? (
            <form onSubmit={authType === 'otp' ? handleSendOtp : handlePasswordLogin} className="space-y-4">
              {/* Method Toggle: Mobile vs Email */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('mobile');
                    setIdentifier('9876543210');
                  }}
                  className={`flex-1 py-1.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    loginMethod === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile Number
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    setIdentifier('arjun.sharma@vupay.in');
                  }}
                  className={`flex-1 py-1.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    loginMethod === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {loginMethod === 'mobile' ? 'Mobile Phone' : 'Email Address'}
                </label>
                <div className="relative">
                  {loginMethod === 'mobile' && (
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">+91</span>
                  )}
                  <input
                    type={loginMethod === 'mobile' ? 'tel' : 'email'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder={loginMethod === 'mobile' ? '9876543210' : 'you@example.com'}
                    className={`w-full py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono ${
                      loginMethod === 'mobile' ? 'pl-11 pr-3' : 'px-3'
                    }`}
                  />
                </div>
              </div>

              {authType === 'password' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Account Password</label>
                    <button
                      type="button"
                      onClick={() => showToast('Password reset link sent to registered email.', 'info')}
                      className="text-[11px] text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Toggle OTP or Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setAuthType(authType === 'otp' ? 'password' : 'otp')}
                  className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  {authType === 'otp' ? 'Login with Password instead' : 'Login with OTP SMS instead'}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{authType === 'otp' ? 'Send 6-Digit OTP' : 'Sign In with Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* OTP Verification UI */
            <form onSubmit={handleVerifyOtpAndLogin} className="space-y-5 text-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enter Verification Code</h3>
                <p className="text-xs text-slate-500 mt-1">
                  We sent a 6-digit code to <span className="font-mono font-bold text-slate-800">{identifier}</span>
                </p>
              </div>

              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2">
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-10 h-12 text-center text-lg font-bold font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                ))}
              </div>

              <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
                <span>Didn't receive code?</span>
                {timer > 0 ? (
                  <span className="font-mono text-slate-400">Resend in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTimer(30)}
                    className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Edit Number
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  Verify & Enter
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 text-center border-t border-slate-100 text-[11px] text-slate-500">
            By signing in, you agree to VUPAY's Terms of Service and Privacy Policy.
          </div>
        </div>

      </div>
    </div>
  );
};
