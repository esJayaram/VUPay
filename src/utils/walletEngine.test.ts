import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatINR,
  validateRecipientIdentifier,
  validateTransaction,
  calculateLedgerBalance,
  assessFraudRisk,
  KYC_TIER_LIMITS,
  validate2FACode,
  applyRealtimeEventToLedger,
} from './walletEngine';
import { UserProfile, Transaction } from '../types/wallet';

const mockUser: UserProfile = {
  id: 'usr_001',
  name: 'Arjun Sharma',
  email: 'arjun.sharma@example.com',
  mobile: '9876543210',
  vupayId: 'arjun@vupay',
  role: 'user',
  kycStatus: 'verified',
  kycTier: 2,
  balance: 25000,
  isFrozen: false,
  pin: '1234',
  twoFactorEnabled: true,
  biometricEnabled: false,
  monthlySpent: 15000,
  monthlyLimit: 200000,
};

test('formatINR correctly formats standard Indian Rupee notation', () => {
  assert.equal(formatINR(500), '₹500.00');
  assert.equal(formatINR(125000), '₹1,25,000.00');
  assert.equal(formatINR(10000000), '₹1,00,00,000.00');
  assert.equal(formatINR(0), '₹0.00');
});

test('validateRecipientIdentifier recognizes valid VUPAY handles and Indian phone numbers', () => {
  const vupayRes = validateRecipientIdentifier('arjun@vupay');
  assert.equal(vupayRes.isValid, true);
  assert.equal(vupayRes.type, 'vupay_id');
  assert.equal(vupayRes.cleanValue, 'arjun@vupay');

  const mobileRes = validateRecipientIdentifier('9876543210');
  assert.equal(mobileRes.isValid, true);
  assert.equal(mobileRes.type, 'mobile');
  assert.equal(mobileRes.cleanValue, '9876543210');

  const plus91Res = validateRecipientIdentifier('+91 9876543210');
  assert.equal(plus91Res.isValid, true);
  assert.equal(plus91Res.type, 'mobile');

  const invalidRes = validateRecipientIdentifier('random_string');
  assert.equal(invalidRes.isValid, false);
});

test('validateTransaction approves valid transfers and rejects overdrafts', () => {
  // Valid transfer
  const valid = validateTransaction(mockUser, 5000);
  assert.equal(valid.allowed, true);

  // Insufficient funds
  const overdraft = validateTransaction(mockUser, 30000);
  assert.equal(overdraft.allowed, false);
  assert.equal(overdraft.code, 'INSUFFICIENT_FUNDS');

  // Negative amount
  const negative = validateTransaction(mockUser, -100);
  assert.equal(negative.allowed, false);
  assert.equal(negative.code, 'INVALID_AMOUNT');
});

test('validateTransaction blocks transactions if account is frozen', () => {
  const frozenUser = { ...mockUser, isFrozen: true };
  const res = validateTransaction(frozenUser, 500);
  assert.equal(res.allowed, false);
  assert.equal(res.code, 'ACCOUNT_FROZEN');
});

test('validateTransaction enforces KYC tier monthly spending limits', () => {
  const tier1User: UserProfile = {
    ...mockUser,
    kycTier: 1,
    monthlyLimit: KYC_TIER_LIMITS[1], // 10000
    monthlySpent: 8500,
    balance: 50000,
  };

  // 8500 + 2000 = 10500 > 10000 limit
  const res = validateTransaction(tier1User, 2000);
  assert.equal(res.allowed, false);
  assert.equal(res.code, 'LIMIT_EXCEEDED');
});

test('validateTransaction catches idempotency duplicate keys', () => {
  const existingTx: Transaction = {
    id: 'tx_1',
    type: 'debit',
    amount: 1000,
    fee: 0,
    balanceAfter: 24000,
    timestamp: new Date().toISOString(),
    status: 'success',
    recipient: { name: 'Pooja', identifier: 'pooja@vupay' },
    sender: { name: 'Arjun', identifier: 'arjun@vupay' },
    description: 'Dinner',
    category: 'transfer',
    referenceId: 'VUP123456',
    idempotencyKey: 'idem-key-abc-123',
    paymentRail: 'WALLET',
  };

  const res = validateTransaction(mockUser, 1000, [existingTx], 'idem-key-abc-123');
  assert.equal(res.allowed, false);
  assert.equal(res.code, 'DUPLICATE_IDEMPOTENCY');
});

test('calculateLedgerBalance correctly tallies credit and debit double-entries', () => {
  const entries: Pick<Transaction, 'type' | 'amount' | 'fee' | 'status'>[] = [
    { type: 'credit', amount: 10000, fee: 0, status: 'success' },
    { type: 'debit', amount: 2500, fee: 0, status: 'success' },
    { type: 'debit', amount: 500, fee: 0, status: 'success' },
    { type: 'debit', amount: 9999, fee: 0, status: 'failed' }, // should be ignored
  ];

  const calculated = calculateLedgerBalance(5000, entries);
  // 5000 + 10000 - 2500 - 500 = 12000
  assert.equal(calculated, 12000);
});

test('assessFraudRisk flags rapid transaction velocity and extreme debit ratios', () => {
  const normal = assessFraudRisk({
    amount: 500,
    recentTransactionsCount: 1,
    isNewRecipient: false,
    userBalance: 25000,
  });
  assert.equal(normal.flagged, false);

  const rapid = assessFraudRisk({
    amount: 55000,
    recentTransactionsCount: 6,
    isNewRecipient: true,
    userBalance: 60000,
  });
  assert.equal(rapid.flagged, true);
  assert.ok(rapid.score >= 50);
});

test('validate2FACode verifies 6-digit TOTP/SMS codes and emergency backup codes', () => {
  // Valid 6-digit TOTP
  const totpRes = validate2FACode('123456');
  assert.equal(totpRes.valid, true);
  assert.equal(totpRes.isBackupCode, false);

  // Valid backup code
  const backupRes = validate2FACode('8492-3104', {
    enabled: true,
    method: 'authenticator',
    backupCodes: ['8492-3104', '7210-9481'],
  });
  assert.equal(backupRes.valid, true);
  assert.equal(backupRes.isBackupCode, true);

  // Invalid code
  const invalidRes = validate2FACode('abc');
  assert.equal(invalidRes.valid, false);
});

test('applyRealtimeEventToLedger updates balance and guards against duplicate events', () => {
  const initialBal = 20000;
  const existing: Transaction[] = [];
  const event = {
    id: 'rtx_event_991',
    amount: 1500,
    senderName: 'Sneha Verma',
    senderIdentifier: 'sneha.v@vupay',
    note: 'Consultation fee',
    timestamp: new Date().toISOString(),
    recipientName: 'Arjun Sharma',
    recipientIdentifier: 'arjun@vupay',
  };

  const firstPass = applyRealtimeEventToLedger(initialBal, existing, event);
  assert.equal(firstPass.isDuplicate, false);
  assert.equal(firstPass.newBalance, 21500);
  assert.equal(firstPass.updatedTransactions.length, 1);
  assert.equal(firstPass.updatedTransactions[0].amount, 1500);

  // Duplicate replay guard
  const secondPass = applyRealtimeEventToLedger(firstPass.newBalance, firstPass.updatedTransactions, event);
  assert.equal(secondPass.isDuplicate, true);
  assert.equal(secondPass.newBalance, 21500);
  assert.equal(secondPass.updatedTransactions.length, 1);
});

