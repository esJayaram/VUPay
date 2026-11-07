/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { UserDashboard } from './components/UserDashboard';
import { WalletManagement } from './components/WalletManagement';
import { BillPayments } from './components/BillPayments';
import { DeveloperApiView } from './components/DeveloperApiView';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileSettings } from './components/ProfileSettings';

// Modals
import { SendMoneyModal } from './components/SendMoneyModal';
import { ReceiveMoneyModal } from './components/ReceiveMoneyModal';
import { QRScannerModal } from './components/QRScannerModal';
import { AddMoneyModal } from './components/AddMoneyModal';
import { WithdrawMoneyModal } from './components/WithdrawMoneyModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AuthModal } from './components/AuthModal';

import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toast } = useWallet();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Port */}
      <main className="flex-1">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'dashboard' && <UserDashboard />}
        {currentView === 'wallet' && <WalletManagement />}
        {currentView === 'bills' && <BillPayments />}
        {currentView === 'developer' && <DeveloperApiView />}
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'settings' && <ProfileSettings />}
      </main>

      {/* Global Modals */}
      <SendMoneyModal />
      <ReceiveMoneyModal />
      <QRScannerModal />
      <AddMoneyModal />
      <WithdrawMoneyModal />
      <ReceiptModal />
      <AuthModal />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-medium ${
              toast.type === 'success'
                ? 'bg-slate-900 border-emerald-500/50 text-white'
                : toast.type === 'error'
                ? 'bg-rose-900 border-rose-500/50 text-white'
                : 'bg-slate-900 border-blue-500/50 text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}
