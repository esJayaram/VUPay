import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatINR } from '../utils/walletEngine';
import {
  Smartphone,
  Zap,
  Droplets,
  Wifi,
  Tv,
  Flame,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { TransactionCategory } from '../types/wallet';

export const BillPayments: React.FC = () => {
  const { currentUser, payBill, showToast } = useWallet();

  const [activeTab, setActiveTab] = useState<TransactionCategory>('recharge');
  
  // Form states
  const [operator, setOperator] = useState('Jio 5G');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [selectedPlanAmount, setSelectedPlanAmount] = useState<number>(299);

  // Utility Bill state
  const [electricityBiller, setElectricityBiller] = useState('BESCOM Bangalore Electricity');
  const [consumerNumber, setConsumerNumber] = useState('9028147291');
  const [billFetched, setBillFetched] = useState(false);
  const [fetchedAmount, setFetchedAmount] = useState<number>(1450);

  // Internet bill state
  const [broadbandProvider, setBroadbandProvider] = useState('Airtel Xstream Fiber');
  const [accountNumber, setAccountNumber] = useState('08044291881');
  const [broadbandAmount, setBroadbandAmount] = useState<number>(999);

  // DTH state
  const [dthOperator, setDthOperator] = useState('Tata Play (Tata Sky)');
  const [subscriberId, setSubscriberId] = useState('3029184712');
  const [dthAmount, setDthAmount] = useState<number>(450);

  // Water state
  const [waterBoard, setWaterBoard] = useState('Bangalore Water Supply (BWSSB)');
  const [waterConsumerId, setWaterConsumerId] = useState('BW-882910');
  const [waterAmount, setWaterAmount] = useState<number>(380);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleFetchBill = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBillFetched(true);
      showToast(`Bill details fetched successfully from ${electricityBiller}`, 'success');
    }, 600);
  };

  const handlePay = (category: TransactionCategory, biller: string, id: string, amount: number) => {
    if (!currentUser) return;
    if (currentUser.balance < amount) {
      showToast(`Insufficient wallet balance. Please add money first.`, 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      payBill({
        category,
        billerName: biller,
        consumerId: id,
        amount,
      });
    }, 500);
  };

  const tabs = [
    { id: 'recharge', label: 'Mobile Recharge', icon: Smartphone },
    { id: 'electricity', label: 'Electricity Bill', icon: Zap },
    { id: 'internet', label: 'Broadband Fiber', icon: Wifi },
    { id: 'dth', label: 'DTH Recharge', icon: Tv },
    { id: 'water', label: 'Water Utility', icon: Droplets },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Bill Payments & Utility Clearances
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Instant settlement for utilities across India with zero convenience fees and automated BBPS-grade receipts
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TransactionCategory);
                setBillFetched(false);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Area (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-6">
          
          {/* TAB 1: MOBILE RECHARGE */}
          {activeTab === 'recharge' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-sans">Prepaid / Postpaid Mobile Recharge</h2>
                <p className="text-xs text-slate-500">Supports all major Indian telecom networks</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-11 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telecom Operator & Circle</label>
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Jio 5G">Reliance Jio 5G - Karnataka</option>
                    <option value="Airtel">Bharti Airtel - Karnataka & Goa</option>
                    <option value="Vodafone Idea (Vi)">Vodafone Idea (Vi) - Metro</option>
                    <option value="BSNL">BSNL GSM - National</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Select Popular Plan</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { amt: 199, desc: '23 Days · 1.5GB/day · Unlimited Calls' },
                      { amt: 299, desc: '28 Days · 2GB/day · 5G Unlimited' },
                      { amt: 666, desc: '84 Days · 1.5GB/day · Best Value' },
                    ].map((plan) => (
                      <button
                        type="button"
                        key={plan.amt}
                        onClick={() => setSelectedPlanAmount(plan.amt)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedPlanAmount === plan.amt
                            ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                        }`}
                      >
                        <p className="font-bold text-sm font-mono">{formatINR(plan.amt, false)}</p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-tight">{plan.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Payable Amount</p>
                    <p className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                      {formatINR(selectedPlanAmount)}
                    </p>
                  </div>

                  <button
                    disabled={isProcessing || mobileNumber.length !== 10}
                    onClick={() => handlePay('recharge', `${operator} (${mobileNumber})`, mobileNumber, selectedPlanAmount)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{isProcessing ? 'Processing...' : 'Pay with VUPAY Wallet'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ELECTRICITY BILL */}
          {activeTab === 'electricity' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-sans">Electricity Bill Payment</h2>
                <p className="text-xs text-slate-500">Direct integration with State Electricity Distribution Boards</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State Electricity Board</label>
                  <select
                    value={electricityBiller}
                    onChange={(e) => setElectricityBiller(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="BESCOM Bangalore Electricity">BESCOM - Bangalore Electricity Supply Co.</option>
                    <option value="Tata Power Mumbai">Tata Power - Mumbai Distribution</option>
                    <option value="Adani Electricity Mumbai">Adani Electricity - Mumbai</option>
                    <option value="BSES Rajdhani Power">BSES Rajdhani Power - Delhi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Consumer / Account ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={consumerNumber}
                      onChange={(e) => setConsumerNumber(e.target.value)}
                      placeholder="Enter 10-digit Consumer ID"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleFetchBill}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Fetch Bill
                    </button>
                  </div>
                </div>

                {billFetched && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Consumer Name:</span>
                      <span className="font-semibold text-slate-900">Arjun Sharma</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Bill Period:</span>
                      <span className="font-mono text-slate-700">Oct 01 - Oct 31, 2026</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Due Date:</span>
                      <span className="font-medium text-amber-600">Nov 15, 2026 (7 days left)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-slate-200 pt-2">
                      <span className="font-bold text-slate-900">Total Due:</span>
                      <span className="font-mono font-extrabold text-base text-blue-600">{formatINR(fetchedAmount)}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Fee: ₹0.00 (Zero Convenience Charges)</span>
                  <button
                    disabled={!billFetched || isProcessing}
                    onClick={() => handlePay('electricity', electricityBiller, consumerNumber, fetchedAmount)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{isProcessing ? 'Processing...' : `Pay ${formatINR(fetchedAmount)}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BROADBAND */}
          {activeTab === 'internet' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-sans">High-Speed Broadband Bill</h2>
                <p className="text-xs text-slate-500">Fiber and wireline broadband clearance</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Provider</label>
                  <select
                    value={broadbandProvider}
                    onChange={(e) => setBroadbandProvider(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Airtel Xstream Fiber">Airtel Xstream Fiber</option>
                    <option value="ACT Fibernet">ACT Fibernet</option>
                    <option value="JioFiber High Speed">JioFiber High Speed</option>
                    <option value="Tata Play Fiber">Tata Play Fiber</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number / Landline</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Bill Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">₹</span>
                    <input
                      type="number"
                      value={broadbandAmount}
                      onChange={(e) => setBroadbandAmount(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Official BBPS Receipt Provided</span>
                  <button
                    disabled={isProcessing}
                    onClick={() => handlePay('internet', broadbandProvider, accountNumber, broadbandAmount)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{isProcessing ? 'Processing...' : `Pay ${formatINR(broadbandAmount)}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DTH RECHARGE */}
          {activeTab === 'dth' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-sans">DTH TV Subscription</h2>
                <p className="text-xs text-slate-500">Instant direct satellite TV recharge</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">DTH Operator</label>
                  <select
                    value={dthOperator}
                    onChange={(e) => setDthOperator(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Tata Play (Tata Sky)">Tata Play (Tata Sky)</option>
                    <option value="Airtel Digital TV">Airtel Digital TV</option>
                    <option value="Dish TV India">Dish TV India</option>
                    <option value="Sun Direct">Sun Direct DTH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subscriber ID / Smartcard</label>
                  <input
                    type="text"
                    value={subscriberId}
                    onChange={(e) => setSubscriberId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recharge Amount</label>
                  <input
                    type="number"
                    value={dthAmount}
                    onChange={(e) => setDthAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Zero Convenience Fee</span>
                  <button
                    disabled={isProcessing}
                    onClick={() => handlePay('dth', dthOperator, subscriberId, dthAmount)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{isProcessing ? 'Processing...' : `Pay ${formatINR(dthAmount)}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WATER UTILITY */}
          {activeTab === 'water' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-sans">Municipal Water Board Bill</h2>
                <p className="text-xs text-slate-500">Government municipal board settlements</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Water Supply Authority</label>
                  <select
                    value={waterBoard}
                    onChange={(e) => setWaterBoard(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Bangalore Water Supply (BWSSB)">Bangalore Water Supply & Sewerage Board (BWSSB)</option>
                    <option value="Delhi Jal Board (DJB)">Delhi Jal Board (DJB)</option>
                    <option value="HMWSSB Hyderabad">Hyderabad Metropolitan Water Supply (HMWSSB)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RR / Consumer Number</label>
                  <input
                    type="text"
                    value={waterConsumerId}
                    onChange={(e) => setWaterConsumerId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bill Amount</label>
                  <input
                    type="number"
                    value={waterAmount}
                    onChange={(e) => setWaterAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Auto-cleared within 60 seconds</span>
                  <button
                    disabled={isProcessing}
                    onClick={() => handlePay('water', waterBoard, waterConsumerId, waterAmount)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{isProcessing ? 'Processing...' : `Pay ${formatINR(waterAmount)}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Info Area & Wallet Summary (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#101B35] text-white p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Debit Source</span>
            <div>
              <p className="text-2xl font-bold font-mono text-white tabular-nums">
                {currentUser ? formatINR(currentUser.balance) : '₹0.00'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Primary VUPAY Liquid Wallet</p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero surcharge or service fee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Direct clearance with utility providers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Downloadable tax-compliant receipt</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-sans">Payment Security Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every utility bill payment is assigned a unique NPCI/BBPS reference hash. In case of any billing dispute, our automated clearing engine guarantees a 100% refund to your wallet within 2 business hours.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
