import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Transaction,
  BankAccount,
  Beneficiary,
  FraudAlert,
  AdminAnalytics,
  TransactionCategory,
  PaymentRail,
  TwoFactorMethod,
  TwoFactorConfig,
} from '../types/wallet';
import {
  initialCurrentUser,
  adminUser,
  initialBankAccounts,
  initialBeneficiaries,
  initialTransactions,
  initialFraudAlerts,
  initialAdminAnalytics,
  sampleAdminUsers,
} from '../data/mockData';
import {
  validateTransaction,
  generateReferenceId,
  assessFraudRisk,
  applyRealtimeEventToLedger,
  generateMockBackupCodes,
} from '../utils/walletEngine';

export type AppView = 'landing' | 'dashboard' | 'wallet' | 'bills' | 'developer' | 'admin' | 'settings';
export type ModalType =
  | 'send'
  | 'receive'
  | 'qr_scan'
  | 'add_money'
  | 'withdraw'
  | 'receipt'
  | 'auth'
  | 'kyc_upgrade'
  | 'two_factor_setup'
  | null;

interface WalletContextType {
  currentUser: UserProfile | null;
  activeRole: 'user' | 'admin';
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  transactions: Transaction[];
  bankAccounts: BankAccount[];
  beneficiaries: Beneficiary[];
  fraudAlerts: FraudAlert[];
  adminAnalytics: AdminAnalytics;
  adminUsers: typeof sampleAdminUsers;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;

  // 2FA Actions
  enableTwoFactor: (method: TwoFactorMethod, secret?: string) => void;
  disableTwoFactor: () => void;

  // Onboarding Tour Actions
  isTourActive: boolean;
  currentTourStep: number;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  skipTour: () => void;
  finishTour: () => void;

  // Real-Time Dashboard Actions
  realtimeConnected: boolean;
  simulateIncomingPayment: (customSender?: string, customAmount?: number) => void;
  lastRealtimeEvent: { title: string; amount: number; time: string } | null;
  
  // Actions
  sendMoney: (params: {
    recipientIdentifier: string;
    recipientName: string;
    amount: number;
    description: string;
    pin: string;
  }) => { success: boolean; error?: string; transaction?: Transaction };

  addMoney: (params: {
    amount: number;
    rail: PaymentRail;
    sourceName: string;
  }) => { success: boolean; error?: string; transaction?: Transaction };

  withdrawMoney: (params: {
    amount: number;
    bankAccountId: string;
  }) => { success: boolean; error?: string; transaction?: Transaction };

  payBill: (params: {
    category: TransactionCategory;
    billerName: string;
    consumerId: string;
    amount: number;
  }) => { success: boolean; error?: string; transaction?: Transaction };

  updateKYC: (params: {
    panNumber: string;
    aadhaarLastFour: string;
  }) => void;

  updatePin: (newPin: string) => boolean;
  toggleUserFreeze: (userId: string) => void;
  resolveFraudAlert: (alertId: string) => void;
  approveKYC: (userId: string) => void;
  loginAs: (role: 'user' | 'admin' | 'guest') => void;
  logout: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialCurrentUser);
  const [activeRole, setActiveRole] = useState<'user' | 'admin'>('user');
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [beneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(initialFraudAlerts);
  const [adminAnalytics, setAdminAnalytics] = useState<AdminAnalytics>(initialAdminAnalytics);
  const [adminUsers, setAdminUsers] = useState(sampleAdminUsers);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Onboarding Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);

  // Real-Time Dashboard State
  const [realtimeConnected, setRealtimeConnected] = useState(true);
  const [lastRealtimeEvent, setLastRealtimeEvent] = useState<{ title: string; amount: number; time: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('tour') === '1' || urlParams.get('tour') === 'true') {
        setCurrentView('dashboard');
        setIsTourActive(true);
        setCurrentTourStep(0);
      }
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#22D3EE', '#16A34A', '#101B35'],
      });
    } catch {
      // safe fallback in headless environments
    }
  };

  // SEND MONEY
  const sendMoney = ({
    recipientIdentifier,
    recipientName,
    amount,
    description,
    pin,
  }: {
    recipientIdentifier: string;
    recipientName: string;
    amount: number;
    description: string;
    pin: string;
  }) => {
    if (!currentUser) {
      return { success: false, error: 'User session not found.' };
    }

    if (pin !== currentUser.pin) {
      return { success: false, error: 'Incorrect 4-digit Transaction PIN. (Demo PIN: 1234)' };
    }

    const validation = validateTransaction(currentUser, amount, transactions);
    if (!validation.allowed) {
      return { success: false, error: validation.error };
    }

    // Double-entry execution
    const newBalance = Number((currentUser.balance - amount).toFixed(2));
    const newMonthlySpent = Number((currentUser.monthlySpent + amount).toFixed(2));
    const referenceId = generateReferenceId('TRF');
    const idempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const newTx: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'debit',
      amount,
      fee: 0,
      balanceAfter: newBalance,
      timestamp: new Date().toISOString(),
      status: 'success',
      recipient: {
        name: recipientName || recipientIdentifier,
        identifier: recipientIdentifier,
      },
      sender: {
        name: currentUser.name,
        identifier: currentUser.vupayId,
      },
      description: description || 'Peer-to-peer transfer',
      category: 'transfer',
      referenceId,
      idempotencyKey,
      paymentRail: 'UPI',
    };

    // Fraud risk heuristics
    const risk = assessFraudRisk({
      amount,
      recentTransactionsCount: 1,
      isNewRecipient: !beneficiaries.some((b) => b.identifier === recipientIdentifier),
      userBalance: currentUser.balance,
    });

    if (risk.flagged) {
      const newAlert: FraudAlert = {
        id: `alert_${Date.now()}`,
        severity: 'medium',
        rule: 'HIGH_VALUE_VELOCITY',
        description: risk.reason || 'Flagged by internal risk engine.',
        userId: currentUser.id,
        userName: currentUser.name,
        amount,
        timestamp: new Date().toISOString(),
        status: 'active',
      };
      setFraudAlerts((prev) => [newAlert, ...prev]);
    }

    // Update state
    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            balance: newBalance,
            monthlySpent: newMonthlySpent,
          }
        : null
    );

    setTransactions((prev) => [newTx, ...prev]);
    setAdminAnalytics((prev) => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1,
      totalVolume: prev.totalVolume + amount,
    }));

    setSelectedTransaction(newTx);
    setActiveModal('receipt');
    triggerConfetti();
    showToast(`Successfully sent ₹${amount.toLocaleString('en-IN')} to ${recipientName || recipientIdentifier}`, 'success');

    return { success: true, transaction: newTx };
  };

  // ADD MONEY
  const addMoney = ({
    amount,
    rail,
    sourceName,
  }: {
    amount: number;
    rail: PaymentRail;
    sourceName: string;
  }) => {
    if (!currentUser) return { success: false, error: 'User session not found.' };
    if (amount <= 0) return { success: false, error: 'Enter an amount greater than ₹0.' };

    const newBalance = Number((currentUser.balance + amount).toFixed(2));
    const referenceId = generateReferenceId('DEP');
    const newTx: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'credit',
      amount,
      fee: 0,
      balanceAfter: newBalance,
      timestamp: new Date().toISOString(),
      status: 'success',
      recipient: {
        name: currentUser.name,
        identifier: currentUser.vupayId,
      },
      sender: {
        name: sourceName || 'Linked Bank Account',
        identifier: '•••• 4092',
      },
      description: `Wallet top-up via ${rail}`,
      category: 'deposit',
      referenceId,
      idempotencyKey: `dep_${Date.now()}`,
      paymentRail: rail,
    };

    setCurrentUser((prev) => (prev ? { ...prev, balance: newBalance } : null));
    setTransactions((prev) => [newTx, ...prev]);
    setSelectedTransaction(newTx);
    setActiveModal('receipt');
    triggerConfetti();
    showToast(`Added ₹${amount.toLocaleString('en-IN')} to your VUPAY wallet!`, 'success');

    return { success: true, transaction: newTx };
  };

  // WITHDRAW MONEY
  const withdrawMoney = ({
    amount,
    bankAccountId,
  }: {
    amount: number;
    bankAccountId: string;
  }) => {
    if (!currentUser) return { success: false, error: 'User session not found.' };
    if (currentUser.balance < amount) {
      return { success: false, error: 'Insufficient wallet balance for withdrawal.' };
    }

    const targetBank = bankAccounts.find((b) => b.id === bankAccountId) || bankAccounts[0];
    const newBalance = Number((currentUser.balance - amount).toFixed(2));
    const referenceId = generateReferenceId('WDL');

    const newTx: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'debit',
      amount,
      fee: 0,
      balanceAfter: newBalance,
      timestamp: new Date().toISOString(),
      status: 'success',
      recipient: {
        name: `${targetBank.bankName} (${targetBank.accountNumber})`,
        identifier: targetBank.ifsc,
      },
      sender: {
        name: currentUser.name,
        identifier: currentUser.vupayId,
      },
      description: `IMPS Instant Withdrawal to ${targetBank.bankName}`,
      category: 'withdrawal',
      referenceId,
      idempotencyKey: `wdl_${Date.now()}`,
      paymentRail: 'IMPS',
    };

    setCurrentUser((prev) => (prev ? { ...prev, balance: newBalance } : null));
    setTransactions((prev) => [newTx, ...prev]);
    setSelectedTransaction(newTx);
    setActiveModal('receipt');
    triggerConfetti();
    showToast(`Withdrew ₹${amount.toLocaleString('en-IN')} to ${targetBank.bankName}`, 'success');

    return { success: true, transaction: newTx };
  };

  // PAY BILL
  const payBill = ({
    category,
    billerName,
    consumerId,
    amount,
  }: {
    category: TransactionCategory;
    billerName: string;
    consumerId: string;
    amount: number;
  }) => {
    if (!currentUser) return { success: false, error: 'User session not found.' };
    if (currentUser.balance < amount) {
      return { success: false, error: 'Insufficient balance to pay this bill.' };
    }

    const newBalance = Number((currentUser.balance - amount).toFixed(2));
    const newMonthlySpent = Number((currentUser.monthlySpent + amount).toFixed(2));
    const referenceId = generateReferenceId(category.slice(0, 3));

    const newTx: Transaction = {
      id: `txn_${Date.now()}`,
      type: 'debit',
      amount,
      fee: 0,
      balanceAfter: newBalance,
      timestamp: new Date().toISOString(),
      status: 'success',
      recipient: {
        name: billerName,
        identifier: consumerId,
      },
      sender: {
        name: currentUser.name,
        identifier: currentUser.vupayId,
      },
      description: `${billerName} Utility Payment (${consumerId})`,
      category,
      referenceId,
      idempotencyKey: `bill_${Date.now()}`,
      paymentRail: 'WALLET',
    };

    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            balance: newBalance,
            monthlySpent: newMonthlySpent,
          }
        : null
    );
    setTransactions((prev) => [newTx, ...prev]);
    setSelectedTransaction(newTx);
    setActiveModal('receipt');
    triggerConfetti();
    showToast(`Paid ₹${amount.toLocaleString('en-IN')} for ${billerName}`, 'success');

    return { success: true, transaction: newTx };
  };

  // UPDATE KYC
  const updateKYC = ({ panNumber, aadhaarLastFour }: { panNumber: string; aadhaarLastFour: string }) => {
    if (!currentUser) return;
    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            kycTier: 2,
            kycStatus: 'verified',
            monthlyLimit: 200000,
            panNumber,
            aadhaarLastFour,
          }
        : null
    );
    showToast('KYC documents verified! Your monthly limit is now ₹2,00,000.', 'success');
  };

  // UPDATE PIN
  const updatePin = (newPin: string) => {
    if (!currentUser || newPin.length !== 4) return false;
    setCurrentUser((prev) => (prev ? { ...prev, pin: newPin } : null));
    showToast('Transaction PIN updated successfully.', 'success');
    return true;
  };

  // ADMIN: FREEZE / UNFREEZE
  const toggleUserFreeze = (userId: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isFrozen: !u.isFrozen } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, isFrozen: !prev.isFrozen } : null));
    }
    showToast(`Account restriction updated for ${userId}`, 'info');
  };

  // ADMIN: RESOLVE FRAUD ALERT
  const resolveFraudAlert = (alertId: string) => {
    setFraudAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'resolved' } : a))
    );
    showToast('Fraud alert marked as resolved.', 'success');
  };

  // ADMIN: APPROVE KYC
  const approveKYC = (userId: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, kycStatus: 'verified', kycTier: 2 } : u))
    );
    showToast(`KYC verification approved for user ${userId}.`, 'success');
  };

  // LOGIN SWITCHER
  const loginAs = (role: 'user' | 'admin' | 'guest') => {
    if (role === 'user') {
      setCurrentUser(initialCurrentUser);
      setActiveRole('user');
      setCurrentView('dashboard');
      showToast('Logged in as Arjun Sharma (Verified Wallet User)', 'success');
    } else if (role === 'admin') {
      setCurrentUser(adminUser);
      setActiveRole('admin');
      setCurrentView('admin');
      showToast('Logged in as Priya Patel (Risk & Ops Administrator)', 'success');
    } else {
      setCurrentUser(null);
      setCurrentView('landing');
    }
    setActiveModal(null);
  };

  const enableTwoFactor = (method: TwoFactorMethod, secret = 'VUPY-2026-X84J-992K') => {
    if (!currentUser) return;
    const backupCodes = generateMockBackupCodes();
    const config: TwoFactorConfig = {
      enabled: true,
      method,
      secret,
      backupCodes,
      verifiedPhone: currentUser.mobile,
    };
    setCurrentUser((prev) => (prev ? { ...prev, twoFactorEnabled: true, twoFactorConfig: config } : null));
    showToast(`Two-Factor Authentication enabled via ${method === 'authenticator' ? 'Authenticator App' : 'SMS OTP'}!`, 'success');
  };

  const disableTwoFactor = () => {
    if (!currentUser) return;
    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            twoFactorEnabled: false,
            twoFactorConfig: {
              enabled: false,
              method: null,
              backupCodes: [],
            },
          }
        : null
    );
    showToast('Two-Factor Authentication disabled.', 'info');
  };

  const startTour = () => {
    setCurrentView('dashboard');
    setIsTourActive(true);
    setCurrentTourStep(0);
  };

  const nextTourStep = () => {
    setCurrentTourStep((s) => s + 1);
  };

  const prevTourStep = () => {
    setCurrentTourStep((s) => Math.max(0, s - 1));
  };

  const skipTour = () => {
    setIsTourActive(false);
    showToast('Onboarding tour dismissed. Access anytime from the Dashboard.', 'info');
  };

  const finishTour = () => {
    setIsTourActive(false);
    triggerConfetti();
    showToast('🎉 Onboarding tour completed! You are ready to make fast moves.', 'success');
  };

  const simulateIncomingPayment = (customSender = 'Sneha Verma', customAmount = 750) => {
    if (!currentUser) return;
    const event = {
      id: `rtx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      amount: customAmount,
      senderName: customSender,
      senderIdentifier: `${customSender.toLowerCase().replace(/\s+/g, '.')}@vupay`,
      note: 'Instant Real-time Transfer',
      timestamp: new Date().toISOString(),
      recipientName: currentUser.name,
      recipientIdentifier: currentUser.vupayId,
    };

    const res = applyRealtimeEventToLedger(currentUser.balance, transactions, event);
    if (!res.isDuplicate && res.newTransaction) {
      setCurrentUser((prev) => (prev ? { ...prev, balance: res.newBalance } : null));
      setTransactions(res.updatedTransactions);
      setLastRealtimeEvent({
        title: `Received ₹${customAmount.toLocaleString('en-IN')}`,
        amount: customAmount,
        time: 'Just now',
      });
      showToast(`⚡ Real-Time Push: Received ₹${customAmount.toLocaleString('en-IN')} from ${customSender}`, 'success');
      triggerConfetti();
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    setActiveRole('user');
    showToast('Logged out securely.', 'info');
  };

  return (
    <WalletContext.Provider
      value={{
        currentUser,
        activeRole,
        currentView,
        setCurrentView,
        transactions,
        bankAccounts,
        beneficiaries,
        fraudAlerts,
        adminAnalytics,
        adminUsers,
        activeModal,
        setActiveModal,
        selectedTransaction,
        setSelectedTransaction,
        enableTwoFactor,
        disableTwoFactor,
        isTourActive,
        currentTourStep,
        startTour,
        nextTourStep,
        prevTourStep,
        skipTour,
        finishTour,
        realtimeConnected,
        simulateIncomingPayment,
        lastRealtimeEvent,
        sendMoney,
        addMoney,
        withdrawMoney,
        payBill,
        updateKYC,
        updatePin,
        toggleUserFreeze,
        resolveFraudAlert,
        approveKYC,
        loginAs,
        logout,
        showToast,
        toast,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
