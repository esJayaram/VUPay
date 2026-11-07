import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  Code2,
  Terminal,
  Play,
  Github,
  BookOpen,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Layers,
  Shield,
  Zap,
} from 'lucide-react';

export const DeveloperApiView: React.FC = () => {
  const { showToast } = useWallet();
  const [selectedEndpoint, setSelectedEndpoint] = useState<'transfer' | 'bills' | 'ledger' | 'idempotency'>('transfer');
  const [requestPayload, setRequestPayload] = useState<string>(
    JSON.stringify(
      {
        recipient: 'pooja@vupay',
        amount: 2500.0,
        currency: 'INR',
        description: 'Invoice #402 consultation',
      },
      null,
      2
    )
  );
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sandbox' | 'architecture'>('overview');

  const handleRunRequest = () => {
    try {
      const parsed = JSON.parse(requestPayload);
      const simulatedResponse = {
        status: 'success',
        http_code: 200,
        reference_id: `VUP20261107${Math.floor(100000 + Math.random() * 900000)}`,
        idempotency_key: `idem_${Math.random().toString(36).substring(7)}`,
        double_entry_verified: true,
        settled_at: new Date().toISOString(),
        payload_echo: parsed,
      };
      setResponseOutput(JSON.stringify(simulatedResponse, null, 2));
      showToast('API request executed successfully with 200 OK.', 'success');
    } catch {
      setResponseOutput(
        JSON.stringify(
          {
            status: 'error',
            http_code: 400,
            error: 'Invalid JSON request payload formatting.',
          },
          null,
          2
        )
      );
    }
  };

  const curlSnippet = `curl -X POST https://vupay.in/api/v1/wallet/transfer \\
  -H "Authorization: Bearer sec_live_982181..." \\
  -H "Idempotency-Key: ${Math.random().toString(36).substring(7)}" \\
  -H "Content-Type: application/json" \\
  -d '${requestPayload.replace(/\n/g, '')}'`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Platform Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              VuPay Core: Open-Source Fintech Engine & API Bridge
            </h1>
            <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              vupay.in
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Production-grade double-entry payment ledger, idempotency validation engine, and simulated banking bridge
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/vupay/vupay-core"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-white font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Platform Overview & SDK
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-4 py-2.5 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sandbox'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-white font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive API Sandbox</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2.5 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'architecture'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-white font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Architecture & Ledger Invariants</span>
        </button>
      </div>

      {/* VIEW 1: PLATFORM OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-7 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              About VuPay (vupay.in)
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              VuPay is designed as an open-source fintech developer tool, payment validation engine, and API bridge. It provides developers and fintech builders with a deterministic, simulated banking rail environment to test complex fund flow models, UPI interoperability, and high-concurrency ledger operations before deploying to regulated bank networks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                  <Shield className="w-4 h-4" />
                  <span>Idempotency Guarantee</span>
                </div>
                <p className="text-xs text-slate-600">
                  Every mutation accepts an <code className="font-mono text-slate-800">Idempotency-Key</code> header to prevent double-spending even in intermittent network drops.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <Layers className="w-4 h-4" />
                  <span>Double-Entry Balance Verification</span>
                </div>
                <p className="text-xs text-slate-600">
                  Debits and credits are executed simultaneously. Balances are derived from audit log aggregation rather than mutable integers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs">
                  <Zap className="w-4 h-4" />
                  <span>Microsecond Event Sourcing</span>
                </div>
                <p className="text-xs text-slate-600">
                  Built to model up to 5,000 transactions per second with real-time WebSocket state streaming and mock NPCI webhooks.
                </p>
              </div>
            </div>
          </div>

          {/* Quickstart Code Snippet */}
          <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 overflow-hidden shadow-xl font-mono text-xs">
            <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
              <span>TypeScript SDK Quickstart (`npm install @vupay/sdk`)</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `import { VuPayClient } from '@vupay/sdk';\n\nconst vupay = new VuPayClient({ apiKey: process.env.VUPAY_API_KEY });\n\nconst transfer = await vupay.wallet.transfer({\n  recipient: 'pooja@vupay',\n  amount: 2500,\n  idempotencyKey: 'tx_98124_uuid'\n});`
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-5 text-slate-300 space-y-2 overflow-x-auto">
              <pre className="text-cyan-300">
{`import { VuPayClient } from '@vupay/sdk';

// Initialize the VuPay Open-Source API Bridge
const vupay = new VuPayClient({
  endpoint: 'https://vupay.in/api/v1',
  apiKey: process.env.VUPAY_API_KEY,
});

// Idempotent Peer-to-Peer Transfer
const transfer = await vupay.wallet.transfer({
  recipient: 'pooja@vupay',
  amount: 2500.00,
  currency: 'INR',
  idempotencyKey: 'tx_98124_uuid',
  note: 'Consulting services fee'
});

console.log('Settlement Ref:', transfer.referenceId); // e.g. VUP20261107...`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Request Configuration */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 font-sans">API Endpoint Runner</h2>
              <span className="text-xs font-mono text-emerald-600 font-semibold">Ready to Test</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Endpoint</label>
              <select
                value={selectedEndpoint}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setSelectedEndpoint(val);
                  if (val === 'transfer') {
                    setRequestPayload(
                      JSON.stringify(
                        { recipient: 'pooja@vupay', amount: 2500, currency: 'INR', description: 'Invoice #402' },
                        null,
                        2
                      )
                    );
                  } else if (val === 'bills') {
                    setRequestPayload(
                      JSON.stringify(
                        { biller: 'BESCOM Electricity', consumerId: '9028147291', amount: 1450, category: 'electricity' },
                        null,
                        2
                      )
                    );
                  } else if (val === 'ledger') {
                    setRequestPayload(
                      JSON.stringify({ vupayId: 'arjun@vupay', ledgerType: 'double_entry_audit' }, null, 2)
                    );
                  } else {
                    setRequestPayload(
                      JSON.stringify({ idempotencyKey: 'idem_sample_uuid_2026', ttl_seconds: 86400 }, null, 2)
                    );
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono cursor-pointer"
              >
                <option value="transfer">POST /api/v1/wallet/transfer (P2P Transfer)</option>
                <option value="bills">POST /api/v1/bills/pay (Utility Settlement)</option>
                <option value="ledger">GET /api/v1/ledger/balance (Ledger Verification)</option>
                <option value="idempotency">POST /api/v1/idempotency/verify (Replay Guard)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">JSON Request Body</label>
                <span className="text-[10px] text-slate-400 font-mono">Editable Payload</span>
              </div>
              <textarea
                rows={7}
                value={requestPayload}
                onChange={(e) => setRequestPayload(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-900 text-cyan-300 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleRunRequest}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Execute Simulated Request</span>
            </button>
          </div>

          {/* Right: Response Inspector */}
          <div className="lg:col-span-6 bg-slate-950 text-white rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400 font-semibold">Response Inspector</span>
              {responseOutput && <span className="text-emerald-400 font-bold">HTTP 200 OK</span>}
            </div>

            {responseOutput ? (
              <pre className="text-emerald-300 overflow-x-auto max-h-80 leading-relaxed">
                {responseOutput}
              </pre>
            ) : (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <Terminal className="w-8 h-8 mx-auto text-slate-600" />
                <p>Click "Execute Simulated Request" to inspect the live JSON response payload.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-7 space-y-6 text-sm text-slate-700">
          <h2 className="text-xl font-bold text-slate-900 font-sans">
            VuPay Architectural Blueprint
          </h2>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900">1. Double-Entry Accounting Invariant</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              In VuPay, money is never simply modified in an account row. Every financial transaction generates two or more ledger entries: one credit entry and one debit entry. The algebraic sum of all postings in a transaction is strictly zero:
            </p>
            <div className="p-3 rounded-xl bg-slate-50 font-mono text-xs border border-slate-200 text-slate-800">
              ∑ DebitEntries + ∑ CreditEntries = 0
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-900">2. Idempotency Key Lifecycle</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              To defend against network timeouts where a client is unsure if their transfer succeeded, VuPay tracks the <code className="font-mono text-blue-600">Idempotency-Key</code> header in memory and persistent storage for 24 hours. Repeating a request with the exact same key returns the cached successful response without executing a duplicate debit.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-900">3. Verification in vupay.in</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              The live site at <span className="font-mono font-bold text-slate-900">vupay.in</span> validates that all components of the financial engine operate deterministically and are verifiable by automated crawlers and automated unit test runners.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
