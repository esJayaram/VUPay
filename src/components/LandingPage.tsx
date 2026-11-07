import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatINR } from '../utils/walletEngine';
import {
  ArrowRight,
  Shield,
  Zap,
  QrCode,
  Receipt,
  Lock,
  ChevronDown,
  Terminal,
  ExternalLink,
  Github,
  CheckCircle2,
  Smartphone,
  Globe,
  RefreshCw,
  Coins,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setActiveModal, currentUser, loginAs } = useWallet();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [demoAmount, setDemoAmount] = useState<number>(500);

  const faqs = [
    {
      q: 'What is VUPAY and how does it work?',
      a: 'VUPAY (vupay.in) is a smart, modern digital wallet and open-source payment validation platform. It allows individuals and merchants to store funds, make zero-fee peer-to-peer transfers, pay utility bills, scan any UPI QR code, and integrate idempotent payment APIs into their software applications.',
    },
    {
      q: 'What are the KYC limits on my VUPAY wallet?',
      a: 'Basic Tier 1 KYC allows monthly transactions up to ₹10,000. Completing instant digital verification (PAN & Aadhaar) elevates your account to Tier 2 with a monthly spending limit of ₹2,00,000 with instant bank withdrawals.',
    },
    {
      q: 'Are there any transaction fees for sending money?',
      a: 'VUPAY charges 0% fees for all peer-to-peer wallet transfers, UPI payments, and utility bill settlements. Bank IMPS withdrawals are also processed with zero convenience fees.',
    },
    {
      q: 'How does VUPAY function as an open-source payment engine?',
      a: 'VuPay provides open-source RESTful APIs and validation bridges for developers. It implements double-entry immutable ledgers, cryptographic idempotency guards, and simulated banking webhooks so developers can build payment flows with high confidence.',
    },
    {
      q: 'Is my money secure with VUPAY?',
      a: 'Yes. All wallet balances and session states are secured using 256-bit AES end-to-end encryption. Transactions require a 4-digit PIN, multi-factor authentication, and automated real-time velocity fraud heuristics.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#101B35] text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle geometric gradient backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-cyan-400 uppercase">
                <span>VUPAY.IN</span>
                <span aria-hidden="true">·</span>
                <span>Smart Digital Payments</span>
                <span aria-hidden="true">·</span>
                <span>Open-Source Validation Engine</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white font-sans">
                One Wallet.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                  Endless Possibilities.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                Send money, pay bills, manage expenses, and experience seamless digital payments with VUPAY. Designed for individuals, trusted by merchants, and architected as an open-source fintech validation engine.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    if (currentUser) {
                      setCurrentView('dashboard');
                    } else {
                      loginAs('user');
                    }
                  }}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setCurrentView('developer')}
                  className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white text-sm font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Developer API & Docs</span>
                </button>

                <button
                  onClick={() => loginAs('admin')}
                  className="px-4 py-3.5 text-xs text-amber-300 hover:text-amber-200 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Explore Admin Panel</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero Transaction Fees</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Instant 0.4s UPI Settlement</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>256-bit AES Bank-Grade Vault</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Digital Wallet Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl p-1 bg-gradient-to-b from-blue-500/30 to-cyan-500/10 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
                {/* Visual Image Header */}
                <div className="relative h-44 rounded-t-xl overflow-hidden bg-slate-900">
                  <img
                    src="/src/assets/images/vupay_hero_fintech_1794042024468.jpg"
                    alt="VUPAY Digital Wallet UI on Smartphone"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="font-semibold tracking-wider font-mono">VUPAY PREMIER WALLET</span>
                    <span className="text-cyan-400 font-mono text-[11px]">ACTIVE LEDGER</span>
                  </div>
                </div>

                {/* Interactive Card Body */}
                <div className="p-5 bg-slate-900 rounded-b-xl space-y-4 text-white">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <p className="text-xs text-slate-400">Available Balance</p>
                      <p className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                        {formatINR(currentUser ? currentUser.balance : 24850.0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                        Tier 2 Verified
                      </span>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">arjun@vupay</p>
                    </div>
                  </div>

                  {/* Interactive Quick Transfer Simulator */}
                  <div className="bg-slate-800/70 p-3 rounded-lg border border-slate-700 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Quick Test Transfer</span>
                      <span className="text-slate-400 font-mono">Instant Demo</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {[250, 500, 1000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setDemoAmount(amt)}
                          className={`flex-1 py-1 rounded text-center font-mono cursor-pointer transition-colors ${
                            demoAmount === amt
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        if (!currentUser) {
                          loginAs('user');
                        }
                        setActiveModal('send');
                      }}
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium rounded text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Send ₹{demoAmount} via VUPAY ID</span>
                    </button>
                  </div>

                  {/* Live Mini Ledger Rows */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                      Recent Activity
                    </p>
                    <div className="flex items-center justify-between text-xs py-1 text-slate-300">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                          +
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">Split from Pooja Rao</p>
                          <p className="text-[10px] text-slate-400">UPI Instant · Today</p>
                        </div>
                      </div>
                      <span className="font-mono text-emerald-400 font-semibold tabular-nums">+₹2,500.00</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1 text-slate-300">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-rose-400 flex items-center justify-center font-bold text-[10px]">
                          -
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">Arlo Artisan Cafe</p>
                          <p className="text-[10px] text-slate-400">Merchant QR Scan</p>
                        </div>
                      </div>
                      <span className="font-mono text-slate-300 font-semibold tabular-nums">-₹320.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quantitative Proof Strip */}
      <section className="bg-slate-900 border-y border-slate-800 py-6 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-3 md:pt-0">
              <p className="text-2xl lg:text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">₹180+ Cr</p>
              <p className="text-xs text-slate-400 mt-1">Processed Volume</p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-2xl lg:text-3xl font-extrabold text-white font-mono tabular-nums">0.4s</p>
              <p className="text-xs text-slate-400 mt-1">Average Settlement Speed</p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-2xl lg:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">99.99%</p>
              <p className="text-xs text-slate-400 mt-1">Platform Core Uptime</p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-2xl lg:text-3xl font-extrabold text-blue-400 font-mono tabular-nums">0%</p>
              <p className="text-xs text-slate-400 mt-1">Peer Transfer Fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section - Bento Grid */}
      <section id="features" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            Designed for Modern Finance
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Engineered for speed, built for everyday life.
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            From lightning-fast transfers with just a phone number to instant utility clearance, VUPAY brings all your financial moves into one frictionless interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Item 1: Instant P2P Transfers (col-span-7) */}
          <div className="md:col-span-7 bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-sans">
                Instant Peer-to-Peer Transfers
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Send funds to any VUPAY handle (<span className="font-mono text-blue-600">name@vupay</span>) or 10-digit mobile number in under half a second. All transactions are settled instantly with double-entry cryptographic verification and zero transfer fees.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-700">Supported Rails: UPI · IMPS · Internal Wallet</span>
              <button
                onClick={() => {
                  if (!currentUser) loginAs('user');
                  setActiveModal('send');
                }}
                className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Try a Transfer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Item 2: Scan & Pay Any QR (col-span-5) */}
          <div className="md:col-span-5 bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-sans mb-2">
                Universal QR Code Scanner
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Scan any merchant UPI QR code across India. Auto-detects bill amounts, supports quick tipping, and creates clean digital tax receipts on the fly.
              </p>
            </div>

            <div className="relative rounded-xl overflow-hidden h-36 bg-slate-100">
              <img
                src="/src/assets/images/vupay_merchant_qr_1794042025025.jpg"
                alt="Cafe Checkout with VUPAY QR"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/30 flex items-end p-3">
                <button
                  onClick={() => {
                    if (!currentUser) loginAs('user');
                    setActiveModal('qr_scan');
                  }}
                  className="px-3 py-1.5 bg-white/95 text-slate-900 rounded-lg text-xs font-semibold shadow hover:bg-white cursor-pointer"
                >
                  Open QR Scanner
                </button>
              </div>
            </div>
          </div>

          {/* Bento Item 3: Integrated Utility Hub (col-span-5) */}
          <div className="md:col-span-5 bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-sans">
                Automated Utility Bill Payments
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Recharge mobile numbers (Airtel, Jio, Vi), settle electricity (BESCOM, Tata Power), broadband, water, and DTH in one click. Fetch live bill amounts automatically and download official tax receipts.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  if (!currentUser) loginAs('user');
                  setCurrentView('bills');
                }}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Browse Billers & Recharges</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Item 4: Bank-Grade Security Vault (col-span-7) */}
          <div className="md:col-span-7 bg-[#101B35] text-white rounded-2xl p-7 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-cyan-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white font-sans">
                Cryptographic Security & Fraud Radar
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Protected by 256-bit AES storage, mandatory 4-digit transaction PINs, and automated velocity risk checks that neutralize suspicious unauthorized attempts before funds move.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs text-cyan-300 font-mono">
                <span>· 256-Bit AES</span>
                <span>· PIN Authenticated</span>
                <span>· Escrow Protected</span>
              </div>
            </div>

            <div className="w-full md:w-48 h-36 rounded-xl overflow-hidden shrink-0 border border-slate-700/80">
              <img
                src="/src/assets/images/vupay_security_vault_1794042025523.jpg"
                alt="Fintech Security Vault"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Developer API & Open Source Validation Hub Section */}
      <section id="developer-api" className="py-20 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-cyan-400 uppercase">
                <Terminal className="w-4 h-4" />
                <span>Open-Source Fintech Core</span>
                <span aria-hidden="true">·</span>
                <span>vupay.in Platform</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                Payment validation engine & API bridge for developers.
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                VuPay is built as an open-source fintech developer tool and payment validation engine. It models double-entry accounting ledgers, strict idempotency enforcement, and webhook lifecycle testing for building resilient digital payment applications.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-900/60 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Idempotent Payment Execution</p>
                    <p className="text-xs text-slate-400">Guaranteed exactly-once execution using custom <code className="text-cyan-300 font-mono">Idempotency-Key</code> headers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-900/60 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Double-Entry Ledger Invariants</p>
                    <p className="text-xs text-slate-400">Balance integrity verified with zero balance leakage across debit and credit legs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-900/60 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Open RESTful Sandbox</p>
                    <p className="text-xs text-slate-400">Test live requests right in your browser with verified JSON payload contracts.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setCurrentView('developer')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Launch Live API Sandbox</span>
                </button>

                <a
                  href="https://github.com/vupay/vupay-core"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>View GitHub Repository</span>
                </a>
              </div>
            </div>

            {/* Code / JSON Explorer Preview */}
            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 font-mono text-xs shadow-2xl">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-[11px] text-slate-300">POST /api/v1/wallet/transfer</span>
                  </div>
                  <span className="text-[11px] text-emerald-400">200 OK</span>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-slate-500 mb-1">// Request Headers & Payload</p>
                    <pre className="text-cyan-300">
{`curl -X POST https://vupay.in/api/v1/wallet/transfer \\
  -H "Authorization: Bearer sec_live_9812..." \\
  -H "Idempotency-Key: e9a2c814-38b1..." \\
  -d '{
    "recipient": "pooja@vupay",
    "amount": 2500.00,
    "currency": "INR",
    "description": "Invoice #402"
  }'`}
                    </pre>
                  </div>

                  <div className="border-t border-slate-900 pt-3">
                    <p className="text-slate-500 mb-1">// Verified Response</p>
                    <pre className="text-emerald-300">
{`{
  "status": "success",
  "reference_id": "VUP20261107TRF98231",
  "fee": 0.00,
  "balance_after": 22350.00,
  "settled_at": "2026-11-07T09:00:14.218Z"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            Simple & Transparent
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            How VUPAY Works in 3 Steps
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Get your wallet up and running in under a minute without tedious paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center font-mono text-sm mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Create Your VUPAY ID</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Sign up in 30 seconds using your mobile number. Claim your unique UPI handle (e.g. <span className="font-mono text-blue-600">yourname@vupay</span>) instantly.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center font-mono text-sm mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Load Funds Securely</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Add money via UPI, Debit Card, or Net Banking from any Indian bank. Funds reflect in your available balance with instant zero-fee credit.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center font-mono text-sm mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Pay Anywhere in 1-Click</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Transfer to friends, settle electricity and mobile bills, or scan retail QR codes seamlessly with verified transaction receipts.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
              Real User Experiences
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Loved by individuals, trusted by creators.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="text-slate-700 text-sm leading-relaxed mb-6">
                "VUPAY completely changed how our design agency splits expenses and collects payments. The 0.4s settlement speed and zero fee structure saves us tens of thousands in payment gateway deductions every single month."
              </p>
              <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  SK
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Siddharth Kulkarni</p>
                  <p className="text-[11px] text-slate-500">Founder, Studio Pixelcraft · Bangalore</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="text-slate-700 text-sm leading-relaxed mb-6">
                "Paying electricity and broadband bills used to be an ordeal with multiple portals crashing on due dates. With VUPAY, bill fetch is automatic and the receipt is immediately ready for company reimbursement."
              </p>
              <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  NM
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Neha Menon</p>
                  <p className="text-[11px] text-slate-500">Principal Consultant, TechCorp · Mumbai</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="text-slate-700 text-sm leading-relaxed mb-6">
                "As an indie developer, the open-source API bridge and idempotency architecture of vupay.in made integrating simulated wallet payouts into our developer tools effortlessly smooth."
              </p>
              <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  RV
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Rohan Varma</p>
                  <p className="text-[11px] text-slate-500">Full-Stack Engineer · Hyderabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <div className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            Got Questions?
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-sm font-semibold text-slate-900 cursor-pointer hover:bg-slate-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Conversion Banner */}
      <section className="bg-[#101B35] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience the future of digital payments?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Join thousands of users and developers using VUPAY for fast, zero-fee digital wallet settlements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                if (!currentUser) loginAs('user');
                setCurrentView('dashboard');
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              Open Your VUPAY Wallet
            </button>
            <button
              onClick={() => setCurrentView('developer')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              Read API Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  V
                </div>
                <span className="text-base font-bold text-white tracking-tight">
                  VU<span className="text-cyan-400">PAY</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Smart digital wallet, payment validation engine, and API bridge for modern commerce.
              </p>
              <p className="text-[11px] text-slate-500">Domain: vupay.in</p>
            </div>

            <div>
              <p className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Product</p>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setCurrentView('dashboard')} className="hover:text-white cursor-pointer">
                    Digital Wallet
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('bills')} className="hover:text-white cursor-pointer">
                    Utility Payments
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('qr_scan')} className="hover:text-white cursor-pointer">
                    Scan & Pay QR
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('wallet')} className="hover:text-white cursor-pointer">
                    Audit Ledger
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Developers</p>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setCurrentView('developer')} className="hover:text-white cursor-pointer">
                    API Sandbox & Docs
                  </button>
                </li>
                <li>
                  <a href="https://github.com/vupay/vupay-core" target="_blank" rel="noreferrer" className="hover:text-white">
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <button onClick={() => setCurrentView('developer')} className="hover:text-white cursor-pointer">
                    Double-Entry Architecture
                  </button>
                </li>
                <li>
                  <button onClick={() => loginAs('admin')} className="hover:text-white text-amber-400 cursor-pointer">
                    Admin Risk Console
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Legal & Compliance</p>
              <ul className="space-y-2 text-slate-500">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Grievance Redressal</li>
                <li>Simulated Fintech Demo Notice</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} VUPAY Technologies (vupay.in). All rights reserved.</p>
            <p className="text-center sm:text-right">
              Disclaimer: This application contains simulated payments and demonstration financial ledgers for developer and prototyping purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
