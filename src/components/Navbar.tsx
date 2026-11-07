import React, { useState } from 'react';
import { useWallet, AppView } from '../context/WalletContext';
import {
  Wallet,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Code2,
  Sliders,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activeRole,
    currentView,
    setCurrentView,
    setActiveModal,
    loginAs,
    logout,
  } = useWallet();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#101B35]/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2 group text-left cursor-pointer whitespace-nowrap shrink-0"
          aria-label="VUPAY Home"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-sm group-hover:bg-cyan-500 transition-colors">
            V
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            VU<span className="text-cyan-400">PAY</span>
          </span>
        </button>

        {/* Zone 2: 4-5 Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('landing')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 cursor-pointer ${
              currentView === 'landing' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''
            }`}
          >
            Overview
          </button>
          
          {currentUser ? (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 cursor-pointer ${
                  currentView === 'dashboard' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick('wallet')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 cursor-pointer ${
                  currentView === 'wallet' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''
                }`}
              >
                Wallet & Ledger
              </button>
              <button
                onClick={() => handleNavClick('bills')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 cursor-pointer ${
                  currentView === 'bills' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''
                }`}
              >
                Utility Bills
              </button>
            </>
          ) : (
            <>
              <a
                href="#features"
                onClick={(e) => {
                  if (currentView !== 'landing') {
                    e.preventDefault();
                    setCurrentView('landing');
                    setTimeout(() => {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="whitespace-nowrap shrink-0 transition-colors hover:text-white py-1"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  if (currentView !== 'landing') {
                    e.preventDefault();
                    setCurrentView('landing');
                    setTimeout(() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="whitespace-nowrap shrink-0 transition-colors hover:text-white py-1"
              >
                How It Works
              </a>
              <a
                href="#security"
                onClick={(e) => {
                  if (currentView !== 'landing') {
                    e.preventDefault();
                    setCurrentView('landing');
                    setTimeout(() => {
                      document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="whitespace-nowrap shrink-0 transition-colors hover:text-white py-1"
              >
                Security
              </a>
            </>
          )}

          <button
            onClick={() => handleNavClick('developer')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 flex items-center gap-1.5 cursor-pointer ${
              currentView === 'developer' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Developer API
          </button>

          <button
            onClick={() => {
              if (activeRole !== 'admin') {
                loginAs('admin');
              } else {
                handleNavClick('admin');
              }
            }}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 flex items-center gap-1.5 cursor-pointer ${
              currentView === 'admin' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Admin Panel
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Control */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-white transition-colors cursor-pointer"
                aria-expanded={profileDropdownOpen}
                aria-label="User profile options"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-semibold text-white">{currentUser.name}</p>
                    <p className="text-slate-400 font-mono">{currentUser.vupayId}</p>
                    <p className="text-emerald-400 text-[11px] mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Tier {currentUser.kycTier} Verified
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNavClick('dashboard');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Wallet className="w-3.5 h-3.5" /> Wallet Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNavClick('settings');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-200 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" /> Profile & Security
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      if (activeRole === 'admin') {
                        loginAs('user');
                      } else {
                        loginAs('admin');
                      }
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 text-amber-400 flex items-center gap-2 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" /> Switch to {activeRole === 'admin' ? 'Customer View' : 'Admin Console'}
                  </button>
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800 text-rose-400 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveModal('auth')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              Sign In to Wallet
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-slate-900 border-b border-slate-800 text-sm">
          <button
            onClick={() => handleNavClick('landing')}
            className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white rounded-md"
          >
            Overview
          </button>
          {currentUser && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white rounded-md"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick('wallet')}
                className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white rounded-md"
              >
                Wallet & Ledger
              </button>
              <button
                onClick={() => handleNavClick('bills')}
                className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white rounded-md"
              >
                Utility Bills
              </button>
            </>
          )}
          <button
            onClick={() => handleNavClick('developer')}
            className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white rounded-md"
          >
            Developer API & Open Source
          </button>
          <button
            onClick={() => {
              if (activeRole !== 'admin') {
                loginAs('admin');
              } else {
                handleNavClick('admin');
              }
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-amber-400 hover:text-amber-300 rounded-md"
          >
            Admin Panel
          </button>
        </div>
      )}
    </header>
  );
};
