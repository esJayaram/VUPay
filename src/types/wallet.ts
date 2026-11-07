export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'success' | 'pending' | 'failed';
export type TransactionCategory =
  | 'transfer'
  | 'recharge'
  | 'electricity'
  | 'water'
  | 'internet'
  | 'dth'
  | 'deposit'
  | 'withdrawal'
  | 'merchant_qr';

export type PaymentRail = 'UPI' | 'IMPS' | 'CARD' | 'NETBANKING' | 'WALLET';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  fee: number;
  balanceAfter: number;
  timestamp: string;
  status: TransactionStatus;
  recipient: {
    name: string;
    identifier: string;
    avatar?: string;
  };
  sender: {
    name: string;
    identifier: string;
  };
  description: string;
  category: TransactionCategory;
  referenceId: string;
  idempotencyKey: string;
  paymentRail: PaymentRail;
}

export type KycStatus = 'verified' | 'pending' | 'unverified';
export type KycTier = 1 | 2; // Tier 1: ₹10,000/mo, Tier 2: ₹2,00,000/mo

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  vupayId: string;
  role: 'user' | 'admin';
  kycStatus: KycStatus;
  kycTier: KycTier;
  balance: number;
  isFrozen: boolean;
  pin: string;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  monthlySpent: number;
  monthlyLimit: number;
  panNumber?: string;
  aadhaarLastFour?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  isPrimary: boolean;
  accountType: 'SAVINGS' | 'CURRENT';
}

export interface Beneficiary {
  id: string;
  name: string;
  identifier: string;
  avatarColor: string;
  initials: string;
  phone?: string;
}

export interface FraudAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium';
  rule: string;
  description: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
}

export interface AdminAnalytics {
  totalUsers: number;
  totalTransactions: number;
  totalVolume: number;
  activeUsers: number;
  reserveBalance: number;
  successRate: number;
}
