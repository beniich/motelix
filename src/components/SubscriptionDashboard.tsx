/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Sparkles, 
  Check, 
  HelpCircle, 
  CreditCard, 
  Zap, 
  Lock, 
  Download, 
  Info, 
  Gift, 
  Search, 
  Sliders, 
  RefreshCw, 
  FileText, 
  CheckCircle, 
  PhoneCall, 
  Globe 
} from 'lucide-react';

interface SubscriptionDashboardProps {
  logs: any[];
  onAddLog: (fresh: any) => void;
}

export default function SubscriptionDashboard({ logs, onAddLog }: SubscriptionDashboardProps) {
  // Billing cycle toggles: Monthly vs Annual
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  // Modal state for checkout
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [isSubmittingCheck, setIsSubmittingCheck] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Active coupon engine
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0); 
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccessMsg, setVoucherSuccessMsg] = useState('');

  // Interactive checkout card details
  const [cardHolder, setCardHolder] = useState('Alexander Vance');
  const [cardNumber, setCardNumber] = useState('4111 8888 2222 9999');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('808');

  // Currently active subscribed tier info
  const [currentTier, setCurrentTier] = useState<string>('Free Tier');
  const [activePromoCode, setActivePromoCode] = useState<string>('');

  // Enterprise Dynamic Slider scale (Rooms/Suites slider)
  const [enterpriseSuitesCount, setEnterpriseSuitesCount] = useState<number>(100);

  // FAQ Accordion State
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(null);

  // Core Ledger state for tracking invoices with paid transitions
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [invoices, setInvoices] = useState<any[]>([
    { id: 'INV-2026-003', date: '2026-06-01', amount: 999.00, plan: 'Elite Key License (100 Rooms)', status: 'PAID', method: 'Stripe Visa •••• 9999', rooms: 100 },
    { id: 'INV-2026-002', date: '2026-05-01', amount: 399.00, plan: 'Pro Key License (5 Properties)', status: 'PAID', method: 'Amex Card •••• 4001', rooms: 50 },
    { id: 'INV-2026-001', date: '2026-04-01', amount: 0.00, plan: 'Lobby Secure Base Code', status: 'COMPLIMENTARY', method: 'Biometrics Approved', rooms: 10 },
    { id: 'INV-PENDING-04', date: '2026-06-11', amount: 120.00, plan: 'Volumetric Telemetry Overage', status: 'UNPAID', method: 'Automatic Gateway Pending', rooms: 150 },
  ]);

  // Pricing constants (with annual discount rates pre-computed)
  const PLANS_CONFIG = {
    free: {
      name: 'Free Tier',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Essential Tools for Small Properties',
      features: [
        'Single Property Access',
        'Basic Analytics Dashboard',
        'Limited Cyber-Compliance',
        'Standard Email Support',
        '10 Telemetry Scan Pools'
      ]
    },
    pro: {
      name: 'Pro Tier',
      monthlyPrice: 499,
      annualPrice: 399,
      description: 'Advanced Solutions for Growing Hotels',
      features: [
        'Multi-Property Management (Up to 5)',
        'Real-Time Security Monitoring',
        'Expanded Compliance Suite',
        '24/7 Priority Email Support',
        'Full Sensor Volumetric Logs',
        'API Access Credentials'
      ]
    },
    elite: {
      name: 'Elite Tier',
      monthlyPrice: 1299,
      annualPrice: 999,
      description: 'The Ultimate Command Center for Luxury Chains',
      features: [
        'Global Portfolio Control (Unlimited)',
        'AI-Powered Threat Detection',
        'Full Regulatory Compliance (GDPR, CCPA)',
        'Dedicated Account Manager',
        'Unlimited User Accounts',
        'Custom Integrations & Onboarding',
        'VIP Concierge Support'
      ]
    }
  };

  // Get current raw price
  const getPlanPrice = (key: 'free' | 'pro' | 'elite') => {
    const config = PLANS_CONFIG[key];
    const rawPrice = billingCycle === 'monthly' ? config.monthlyPrice : config.annualPrice;
    if (key === 'elite' && enterpriseSuitesCount > 100) {
      // Add volume surcharge for extreme limits
      const excess = enterpriseSuitesCount - 100;
      return rawPrice + Math.round(excess * 1.5);
    }
    return rawPrice;
  };

  // Coupon validator
  const handleApplyVoucher = () => {
    setVoucherError('');
    setVoucherSuccessMsg('');
    const code = voucherCode.trim().toUpperCase();

    if (code === 'AURUM_CLUB') {
      setAppliedDiscount(0.3); // 30% discount
      setVoucherSuccessMsg('AURUM CLUB voucher validated successfully: -30% VIP discount applied!');
      onAddLog({
        id: `voucher-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        module: 'BILLING',
        message: 'Promotional Voucher [AURUM_CLUB] validated for 30% markdown.',
        type: 'OK'
      });
    } else if (code === 'CYBER_COMPLIANCE') {
      setAppliedDiscount(0.5); // 50% discount
      setVoucherSuccessMsg('Cyber compliance sponsor code validated: -50% off first year!');
      onAddLog({
        id: `voucher-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        module: 'BILLING',
        message: 'Security Sponsor Voucher [CYBER_COMPLIANCE] applied for 50% discount.',
        type: 'OK'
      });
    } else if (code === 'ELITE_FREE') {
      setAppliedDiscount(1.0); // 100% discount
      setVoucherSuccessMsg('Luxe VIP code approved: absolute comped complimentary tier activated!');
      onAddLog({
        id: `voucher-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        module: 'BILLING',
        message: '100% complimentary VIP voucher [ELITE_FREE] registered.',
        type: 'OK'
      });
    } else if (!code) {
      setVoucherError('Please enter a voucher registration token.');
    } else {
      setVoucherError('Invalid promo code or compliance token expired.');
    }
  };

  // Simulated Checkout processing
  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPlan) return;
    setIsSubmittingCheck(true);

    onAddLog({
      id: `billing-transit-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'BILLING',
      message: `Establishing secure SSL transit pipe to Stripe servers for account elevation...`,
      type: 'INFO'
    });

    setTimeout(() => {
      setIsSubmittingCheck(false);
      setCheckoutSuccess(true);
      setCurrentTier(checkoutPlan);
      setActivePromoCode(appliedDiscount > 0 ? voucherCode.toUpperCase() : '');
      
      onAddLog({
        id: `billing-success-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        module: 'BILLING',
        message: `Account tier elevated successfully to [${checkoutPlan}] (Secured through Stripe).`,
        type: 'OK'
      });
    }, 2000);
  };

  // Close checkout and reset temporary coupon details
  const closeCheckoutModal = () => {
    setCheckoutPlan(null);
    setCheckoutSuccess(false);
    setVoucherCode('');
    setAppliedDiscount(0);
    setVoucherError('');
    setVoucherSuccessMsg('');
  };

  return (
    <div id="subscription-telemetry-root" className="space-y-8 text-left bg-[#020617] text-slate-100 min-h-screen p-1 sm:p-6 rounded-3xl transition-all relative overflow-hidden">
      
      {/* Background SVG Hexagonal Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-repeat" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' stroke='%23ffffff' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: '80px 80px'
      }}></div>

      {/* Decorative Gradient ambient light aura */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

      {/* CLIENT HEADER */}
      <header className="relative z-10 text-center max-w-4xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/40 rounded-full border border-slate-800 backdrop-blur-md">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-mono tracking-widest text-[#10b981] font-bold uppercase">
            Aurum Cyber-Compliance Secure
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 dark:text-white tracking-tight leading-tight">
          Elite Platform <span className="italic font-light text-slate-300">Subscription Plans</span>
        </h1>
        
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Secure your hotel's operational command center. Optimize weight sensor telemetry, active drone routes, and luxury smart lockers with complete audit security.
        </p>

        {/* Current status info if subscribed to higher plan */}
        {currentTier !== 'Free Tier' && (
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl text-emerald-400 animate-fadeIn text-xs font-semibold mx-auto mt-4">
            <CheckCircle className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
            <span>
              ACTIVE SIGNATURE ACCESS: <b className="font-extrabold uppercase">{currentTier}</b> {activePromoCode && `(PROMO CODE Applied: ${activePromoCode})`}
            </span>
          </div>
        )}
      </header>

      {/* INTERACTIVE CONTROLS CENTER */}
      <div className="relative z-10 flex flex-col items-center gap-6 mt-12 mb-6">
        {/* Toggle selector with luxury feedback */}
        <div className="flex items-center bg-slate-900/60 p-1.5 rounded-full border border-slate-850 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              billingCycle === 'monthly'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Cycle
          </button>
          
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-black shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Invoice</span>
            <span className="bg-rose-500/90 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md leading-none tracking-normal">
              -20%
            </span>
          </button>
        </div>

        {billingCycle === 'annual' && (
          <p className="text-xs text-emerald-400/90 font-mono animate-pulse">
            ★ Priority Discount Active: Pre-paid annual cycle reduces price instantly by 20% on all tiers.
          </p>
        )}
      </div>

      {/* THREE TIER SUBSCRIPTION GRID */}
      <main id="subscription-plans-grid" className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 mt-6">
        
        {/* 1. FREE TIER COMPRESSED CARD */}
        <section className={`glass-card rounded-3xl p-8 flex flex-col items-center justify-between text-center relative overflow-hidden backdrop-blur-xl border ${
          currentTier === 'Free Tier' ? 'ring-2 ring-emerald-500 border-emerald-500/30 shadow-2xl' : 'border-slate-800'
        }`}>
          {currentTier === 'Free Tier' && (
            <div className="absolute top-0 left-0 bg-emerald-500 text-slate-950 text-[9px] font-extrabold px-3 py-1 rounded-br-xl uppercase tracking-widest">
              Active Plan
            </div>
          )}

          <div className="w-full space-y-6">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                Free Tier
              </span>
              <h3 className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-widest mt-1">
                LOBBY PROTOCOL SECURE
              </h3>
            </div>

            <div className="flex items-baseline justify-center">
              <span className="text-5xl md:text-6xl font-bold font-sans text-slate-900 dark:text-white">$0</span>
              <span className="text-slate-500 ml-2 text-xs font-mono">/ Month</span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed h-8">
              {PLANS_CONFIG.free.description}
            </p>

            <div className="w-full border-t border-slate-800/85 my-4"></div>

            <ul className="w-full space-y-4 text-left">
              {PLANS_CONFIG.free.features.map((feat, idx) => (
                <li key={idx} className="flex items-start text-xs text-slate-350">
                  <Check className="w-4 h-4 text-[#10b981] mr-3 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full mt-10">
            <button
              type="button"
              disabled={currentTier === 'Free Tier'}
              onClick={() => {
                setCheckoutPlan('Free Tier');
                onAddLog({
                  id: `free-select-${Date.now()}`,
                  time: new Date().toLocaleTimeString(),
                  module: 'BILLING',
                  message: 'User initiated Free Tier telemetry registration.',
                  type: 'OK'
                });
              }}
              className="w-full py-4 px-6 rounded-full border border-slate-800 text-slate-400 font-bold hover:bg-slate-900 hover:text-white transition-all uppercase text-xs tracking-widest overflow-hidden relative cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {currentTier === 'Free Tier' ? 'Default Active Plan' : 'Select Free Plan'}
            </button>
          </div>
        </section>

        {/* 2. PRO TIER CARD */}
        <section className={`glass-card rounded-3xl p-8 flex flex-col items-center justify-between text-center relative overflow-hidden backdrop-blur-xl border ${
          currentTier === 'Pro Tier' ? 'ring-2 ring-emerald-500 border-emerald-500/30' : 'border-slate-800'
        }`}>
          {currentTier === 'Pro Tier' && (
            <div className="absolute top-0 left-0 bg-emerald-500 text-slate-950 text-[9px] font-extrabold px-3 py-1 rounded-br-xl uppercase tracking-widest">
              Active Plan
            </div>
          )}

          <div className="w-full space-y-6">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold tracking-[0.2em] text-slate-300 uppercase">
                Pro Tier
              </span>
              <h3 className="text-[10px] font-mono font-medium text-indigo-400 uppercase tracking-widest mt-1">
                SYSTEM OPERATIONAL LOCK
              </h3>
            </div>

            <div className="flex items-baseline justify-center">
              <span className="text-5xl md:text-6xl font-bold font-sans text-slate-900 dark:text-white">
                ${getPlanPrice('pro')}
              </span>
              <span className="text-slate-500 ml-2 text-xs font-mono">/ Month</span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed h-8">
              {PLANS_CONFIG.pro.description}
            </p>

            <div className="w-full border-t border-slate-800/85 my-4"></div>

            <ul className="w-full space-y-4 text-left">
              {PLANS_CONFIG.pro.features.map((feat, idx) => (
                <li key={idx} className="flex items-start text-xs text-slate-305">
                  <Check className="w-4 h-4 text-[#10b981] mr-3 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full mt-10">
            <button
              type="button"
              onClick={() => setCheckoutPlan('Pro Tier')}
              className={`w-full py-4 px-6 rounded-full border text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                currentTier === 'Pro Tier'
                  ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10'
                  : 'border-slate-700 text-slate-200 hover:bg-slate-850'
              }`}
            >
              {currentTier === 'Pro Tier' ? 'Active Pro Tier' : 'Upgrade to Pro'}
            </button>
          </div>
        </section>

        {/* 3. ELITE TIER SPECIAL BORDER ANIMATION DECORATED CARD */}
        <section className={`glass-card elite-border rounded-3xl p-8 flex flex-col items-center justify-between text-center relative overflow-hidden backdrop-blur-xl border ${
          currentTier === 'Elite Tier' ? 'ring-2 ring-emerald-400' : ''
        }`}>
          {/* Absolute Most Popular Luxury Ribbon */}
          <div className="luxury-ribbon shadow-lg">Most Popular</div>

          <div className="w-full space-y-6 relative z-10">
            <div className="flex flex-col items-center">
              <span className="text-xs font-black tracking-[0.2em] text-[#10b981] uppercase">
                Elite Tier
              </span>
              <h3 className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-widest mt-1">
                CYBERNETIC GRAND OVERLORD
              </h3>
            </div>

            <div className="flex items-baseline justify-center">
              <span className="text-5xl md:text-6xl font-bold font-sans text-slate-900 dark:text-white">
                ${getPlanPrice('elite')}
              </span>
              <span className="text-slate-500 ml-2 text-xs font-mono">/ Month</span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed h-8">
              The Deluxe Comprehensive Command Center with Real-Time Volumetric Scales & Custom Route Configurers.
            </p>

            <div className="w-full border-t border-emerald-500/10 my-4"></div>

            {/* DYNAMIC SCALING SUITE CALCULATOR CONTAINER */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-900 space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Integrated Suites Address
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {enterpriseSuitesCount} Rooms
                </span>
              </div>
              
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={enterpriseSuitesCount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setEnterpriseSuitesCount(val);
                }}
                className="w-full accent-emerald-500 bg-slate-900 h-1.5 rounded-lg border-none cursor-pointer outline-none"
              />

              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>10 Min Base</span>
                <span>500 Max Chain</span>
              </div>
            </div>

            <ul className="w-full space-y-4 text-left">
              {PLANS_CONFIG.elite.features.map((feat, idx) => (
                <li key={idx} className="flex items-start text-xs font-medium text-slate-900 dark:text-white">
                  <Check className="w-4 h-4 text-[#10b981] mr-3 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
              {enterpriseSuitesCount > 100 && (
                <li className="flex items-start text-xs text-rose-300 font-mono animate-pulse">
                  <Zap className="w-4 h-4 text-rose-400 mr-3 shrink-0 mt-0.5" />
                  <span>Includes {enterpriseSuitesCount - 100} extra premium sub-keys.</span>
                </li>
              )}
            </ul>
          </div>

          <div className="w-full mt-10 relative z-10">
            <button
              type="button"
              onClick={() => setCheckoutPlan('Elite Tier')}
              className="w-full py-4.5 px-6 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 text-slate-950 font-black hover:from-emerald-500 hover:to-emerald-300 transition-all uppercase text-xs tracking-widest shadow-[0_0_25px_rgba(16,185,129,0.35)] active:scale-95 cursor-pointer"
            >
              {currentTier === 'Elite Tier' ? 'Signature Access Active' : 'Get Elite Access'}
            </button>
          </div>
        </section>
      </main>

      {/* STRIPE PAYMENT COMPLIANCE STRIP (Luxury Brand Proofing) */}
      <section className="relative z-10 max-w-4xl mx-auto mt-16 px-4">
        <div className="flex flex-col items-center bg-slate-950/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-900 transition-all hover:border-slate-800">
          <p className="text-slate-500 text-[10px] mb-8 flex items-center font-bold tracking-widest uppercase gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-500" /> Secure Encryption & Compliance Audited. Certified by:
          </p>

          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-90 transition-all duration-500 grayscale hover:grayscale-0">
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <span className="font-extrabold text-lg italic text-slate-900 dark:text-white tracking-tight">stripe</span>
            </div>
            
            <span className="text-xl font-black italic text-slate-300 tracking-tighter">VISA</span>
            
            <div className="flex items-center -space-x-2">
              <div className="w-6 h-6 rounded-full bg-rose-500/80 border border-slate-900"></div>
              <div className="w-6 h-6 rounded-full bg-amber-500/80 border border-slate-900"></div>
            </div>

            <span className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 px-3 py-1 text-[9px] font-black rounded font-mono uppercase tracking-widest">
              AMERICAN EXPRESS
            </span>
            
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              SECURE TLS 1.3
            </span>
          </div>
        </div>
      </section>

      {/* HISTORIQUE DE FACTURATION / INVOICE ARCHIVES (Requirement: "gestion des facture") */}
      <section className="relative z-10 max-w-4xl mx-auto mt-16 px-4 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-2xl font-serif text-slate-900 dark:text-white tracking-tight">
              Gestion de Facture & <span className="italic font-light">Historique de Facturation</span>
            </h3>
            <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest mt-1">
              ★ Registre sécurisé des clés logistiques hôtelières
            </p>
          </div>
          <button 
            type="button"
            onClick={() => {
              // Add a new simulated invoice for testing buttons
              const nextId = `INV-2026-00${invoices.length + 1}`;
              const newVal: any = {
                id: nextId,
                date: new Date().toISOString().split('T')[0],
                amount: Math.floor(Math.random() * 800) + 199,
                plan: `Extension de Clé Système (Suites ${Math.floor(Math.random() * 200) + 50})`,
                status: 'UNPAID',
                method: 'Token Stripe Sûre',
                rooms: 200
              };
              setInvoices(p => [newVal, ...p]);
              onAddLog({
                id: `invoice-test-${Date.now()}`,
                time: new Date().toLocaleTimeString(),
                module: 'BILLING',
                message: `Simulated pending invoice generated for testing: ${nextId}`,
                type: 'INFO'
              });
            }}
            className="px-4 py-2 border border-dashed border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 text-[#10b981] rounded-xl text-xs font-mono font-bold uppercase transition-all tracking-wider cursor-pointer active:scale-95"
          >
            + Générer Facture Test
          </button>
        </div>

        {/* Invoice Grid/Table */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-850 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 font-mono text-[10px] text-slate-405 uppercase tracking-widest bg-slate-950/40">
                  <th className="py-4 px-6">Facture ID</th>
                  <th className="py-4 px-6">Date Émission</th>
                  <th className="py-4 px-6">Plan Télécharge</th>
                  <th className="py-4 px-6 text-right">Montant</th>
                  <th className="py-4 px-6 text-center">Statut</th>
                  <th className="py-4 px-6 text-center">Actions de Contrôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 font-sans text-xs">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-850/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                      {inv.id}
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {inv.date}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-200">{inv.plan}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Capacity tier: {inv.rooms} Keys</div>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-200">
                      ${inv.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {inv.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> payé
                        </span>
                      ) : inv.status === 'COMPLIMENTARY' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase">
                          Offert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold uppercase animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> en attente
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-755 text-slate-200 hover:text-white rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer"
                        >
                          Examiner
                        </button>
                        
                        {inv.status === 'UNPAID' ? (
                          <button
                            type="button"
                            onClick={() => {
                              // Perform standard payment logic on flyout
                              setInvoices(prev => prev.map(item => item.id === inv.id ? { ...item, status: 'PAID', method: 'Stripe Visa •••• 1205' } : item));
                              onAddLog({
                                id: `paid-${inv.id}`,
                                time: new Date().toLocaleTimeString(),
                                module: 'BILLING',
                                message: `Invoice ${inv.id} ($${inv.amount}) settled via pre-saved Stripe cryptotoken.`,
                                type: 'OK'
                              });
                            }}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-mono text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer"
                          >
                            Payer Solde
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onAddLog({
                                id: `pdf-${inv.id}`,
                                time: new Date().toLocaleTimeString(),
                                module: 'BILLING',
                                message: `Compiled dynamic PDF invoice asset for receipt token ${inv.id}.`,
                                type: 'OK'
                              });
                              alert(`L'élément ${inv.id} a été téléchargé sous format PDF avec succès dans votre cache hôtelier.`);
                            }}
                            className="px-3 py-1.5 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg font-mono text-[10px] uppercase font-semibold tracking-wider transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" /> PDF
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INVOICE EXAMINER POPUP MODAL */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left">
              
              {/* Elegant corner decorative light */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full filter blur-xl pointer-events-none" />

              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:text-white transition-colors text-2xl cursor-pointer"
              >
                &times;
              </button>

              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-950 rounded-full border border-slate-800 text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-450 mb-2">
                    <FileText className="w-3 h-3 text-emerald-450" />
                    <span>Détail Registre de Facturation</span>
                  </div>
                  <h2 className="text-2xl font-serif text-slate-900 dark:text-white">
                    Examen Facture <span className="text-indigo-400">{selectedInvoice.id}</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Chiffré de bout en bout conformément aux normes de facturation auditive d'Aetheon Group.
                  </p>
                </div>

                {/* Invoice receipt style structure */}
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-850 space-y-4 font-mono text-xs text-slate-300">
                  <div className="flex justify-between text-slate-900 dark:text-white font-bold border-b border-slate-800 pb-2 mb-2">
                    <span>Rubrique Opérationnelle</span>
                    <span>Valeur</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Numéro de Ligne:</span>
                    <span className="text-slate-400">#TXN-LINE-{selectedInvoice.id.split('-').pop()}</span>
                  </div>

                  <div className="flex justify-between font-mono">
                    <span>Date d'Émission:</span>
                    <span className="text-slate-400">{selectedInvoice.date}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Composant Logistique:</span>
                    <span className="text-indigo-350 font-bold">{selectedInvoice.plan}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Statut de Transfert:</span>
                    <span className={selectedInvoice.status === 'PAID' ? 'text-emerald-400 font-bold' : selectedInvoice.status === 'COMPLIMENTARY' ? 'text-indigo-400' : 'text-rose-450 font-bold animate-pulse'}>
                      {selectedInvoice.status}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Canal d'Acquittement:</span>
                    <span className="text-slate-405">{selectedInvoice.method}</span>
                  </div>

                  <div className="flex justify-between border-t border-slate-800 pt-3 text-slate-900 dark:text-white font-bold text-sm">
                    <span>Montant Total (TTC):</span>
                    <span className="text-[#10b981] font-extrabold">${selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {selectedInvoice.status === 'UNPAID' && (
                    <button
                      type="button"
                      onClick={() => {
                        setInvoices(prev => prev.map(item => item.id === selectedInvoice.id ? { ...item, status: 'PAID', method: 'Stripe Authorized •••• 1205' } : item));
                        setSelectedInvoice(prev => ({ ...prev, status: 'PAID', method: 'Stripe Authorized •••• 1205' }));
                        onAddLog({
                          id: `paid-modal-${selectedInvoice.id}`,
                          time: new Date().toLocaleTimeString(),
                          module: 'BILLING',
                          message: `Stripe settlement processed successfully for ${selectedInvoice.id}.`,
                          type: 'OK'
                        });
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest hover:from-emerald-500 hover:to-emerald-300 transition-all cursor-pointer active:scale-95"
                    >
                      Régler Solde Immédiatement
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInvoice(null);
                    }}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer text-center"
                  >
                    Fermer l'Examen
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* ACCORDION FAQ SECTION */}
      <section className="relative z-10 max-w-4xl mx-auto mt-16 px-4 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-serif text-slate-900 dark:text-white tracking-tight">
            Frequently Asked <span className="italic font-light">Service Questions</span>
          </h3>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Operational and Telemetry Information FAQ
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How does the automated volumetric restocking system work?',
              a: 'Every suite is outfitted with physical load cell weight pads configured for specific bottles (such as Champagne or Vodka). When pressure values diminish, the system updates state, logging real-time weight sensor changes, and assigns restocking coordinates to assigned staff.'
            },
            {
              q: 'Can I swap between Monthly and Annual billing later?',
              a: 'Yes, you can upgrade, downgrade, or switch billing cycles instantly. When swapping from monthly to annual billing, your invoice is instantly prorated, and the 20% system-wide pre-payment credit is applied.'
            },
            {
              q: 'What is the "Cyber-Compliance Verified" security protocol?',
              a: 'Our platform uses high-entropy encryption (TLS 1.3) linked directly to Stripe servers. Sensitive credit card or customer telemetry payload is never stored, maintaining absolute 5-star privacy standard compliance.'
            }
          ].map((item, idx) => {
            const isOpen = faqOpenIdx === idx;
            return (
              <div 
                key={idx} 
                className="bg-slate-900/45 border border-slate-850 rounded-2xl p-5 cursor-pointer hover:border-slate-800 transition-colors"
                onClick={() => setFaqOpenIdx(isOpen ? null : idx)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-slate-200">
                    {item.q}
                  </h4>
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    {isOpen ? '▲' : '▼'}
                  </span>
                </div>
                {isOpen && (
                  <p className="text-xs text-slate-400 leading-relaxed mt-3.5 pl-2 border-l-2 border-emerald-500/60 animate-fadeIn">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PORTAL SYSTEM FOOTER */}
      <footer className="relative z-10 mt-20 pb-10 text-slate-500 text-[10px] flex flex-wrap justify-center gap-8 font-mono uppercase tracking-widest">
        <a className="hover:text-[#10b981] transition-colors" href="#">PROPERTIES PROTOCOLS</a>
        <a className="hover:text-[#10b981] transition-colors" href="#">SECURITY CODES</a>
        <a className="hover:text-[#10b981] transition-colors" href="#">PRIVACY STATEMENT</a>
        <a className="hover:text-[#10b981] transition-colors" href="#">CONTACT CONCIERGE</a>
      </footer>

      {/* INTERACTIVE STRIPE CHECKOUT MODAL WINDOW */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left">
            
            {/* Elegant corner decorative light */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#10b981]/10 rounded-full filter blur-xl pointer-events-none"></div>

            <button
              type="button"
              onClick={closeCheckoutModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:text-white transition-colors text-2xl"
            >
              &times;
            </button>

            {!checkoutSuccess ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-450 font-bold font-mono text-[9px] uppercase tracking-widest mb-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Selected Plan Level Upgrade</span>
                  </div>
                  <h2 className="text-2xl font-serif text-slate-900 dark:text-white">
                    Upgrade to <span className="font-bold text-emerald-400">{checkoutPlan}</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Complete your custom billing address and access token details below.
                  </p>
                </div>

                {/* VIRTUAL CUSTOM CREDIT CARD BRAND PREVIEW */}
                <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-lg shadow-black/40">
                  <div className="absolute right-4 bottom-4 text-3xl font-black italic text-slate-750 opacity-40 select-none">
                    {cardNumber.startsWith('3') ? 'AMEX' : cardNumber.startsWith('5') ? 'MASTERCARD' : 'VISA'}
                  </div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-8 bg-amber-500/20 border border-amber-500/25 rounded-md flex items-center justify-center text-amber-500/60 font-bold select-none text-[10px]">
                      CHIP
                    </div>
                    <Lock className="w-4 h-4 text-[#10b981]" />
                  </div>

                  <p className="text-md font-mono tracking-widest text-[#10b981] font-bold">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </p>

                  <div className="flex justify-between items-end mt-6">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold mb-1">
                        Holder Signature
                      </span>
                      <span className="text-xs font-mono font-bold tracking-wide uppercase text-slate-900 dark:text-white truncate max-w-[150px]">
                        {cardHolder || 'COUPON SPONSOR'}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold mb-1">
                          Expiry
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {cardExp || 'MM/YY'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold mb-1">
                          CVV
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {cardCvv || '•••'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BILLING AND CARD INPUT FORM */}
                <form onSubmit={handleProcessCheckout} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">
                        Credit Card Number
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">
                        Security CVV
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none text-center"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[8px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">
                        Region Code
                      </label>
                      <select className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] uppercase font-bold text-slate-305 outline-none">
                        <option>FRANCE (EU)</option>
                        <option>MONACO</option>
                        <option>SWITZERLAND</option>
                        <option>UNITED STATES</option>
                        <option>UNITED KINGDOM</option>
                      </select>
                    </div>
                  </div>

                  {/* HIGH FIDELITY DISCOUNT VOUCHER CODES FIELD */}
                  <div className="pt-2 border-t border-slate-850 space-y-2">
                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                      Have a luxury promo or cryptographic discount voucher?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="E.g. AURUM_CLUB"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded text-xs select-all text-white font-mono uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-xs font-mono font-bold"
                      >
                        Apply Input
                      </button>
                    </div>

                    {voucherError && (
                      <p className="text-[10px] text-rose-500 font-mono font-semibold">
                        ⚠ {voucherError}
                      </p>
                    )}

                    {voucherSuccessMsg && (
                      <p className="text-[10px] text-emerald-400 font-mono font-semibold">
                        ✓ {voucherSuccessMsg}
                      </p>
                    )}
                  </div>

                  {/* PRICE COMPUTATION DETAIL */}
                  <div className="bg-slate-950/90 p-4 rounded-xl space-y-2 font-mono text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Base Plan Price:</span>
                      <span className="text-slate-900 dark:text-white">
                        ${checkoutPlan === 'Pro Tier' ? getPlanPrice('pro') : getPlanPrice('elite')}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Voucher Discount ({appliedDiscount * 100}%):</span>
                      <span className="text-emerald-400">
                        -${Math.round((checkoutPlan === 'Pro Tier' ? getPlanPrice('pro') : getPlanPrice('elite')) * appliedDiscount)}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-slate-800 pt-2 text-[#10b981] font-bold">
                      <span>Total Invoice Due (USD):</span>
                      <span className="text-[#10b981] font-extrabold">
                        ${Math.max(0, Math.round(
                          (checkoutPlan === 'Pro Tier' ? getPlanPrice('pro') : getPlanPrice('elite')) * (1 - appliedDiscount)
                        ))}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingCheck}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/10 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmittingCheck ? 'Contacting Stripe authentication loops...' : 'Confirm Secure Checkout'}
                  </button>
                </form>
              </div>
            ) : (
              // CHECKOUT SUCCESSFUL
              <div className="text-center space-y-6 py-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-slate-900 dark:text-white">
                    Access Code Synchronized
                  </h3>
                  <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    System Compliant & Active
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed pt-2">
                    Congratulations! Your hotel cyber command credentials have been successfully updated to <b className="text-slate-900 dark:text-white font-black">{checkoutPlan}</b>.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-850 space-y-3 max-w-sm mx-auto text-left text-xs font-mono text-slate-400 relative">
                  <div className="flex justify-between text-slate-900 dark:text-white font-bold border-b border-slate-800 pb-2 mb-2">
                    <span>Invoice Recipient</span>
                    <span>RECEIPT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="text-slate-300">TXN-{Math.floor(Date.now() / 1500)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Holder:</span>
                    <span className="text-slate-300">{cardHolder || 'Sponsor User'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Elevated Tier:</span>
                    <span className="text-[#10b981] font-bold">{checkoutPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Limit:</span>
                    <span className="text-[#10b981]">{checkoutPlan === 'Elite Tier' ? `${enterpriseSuitesCount} Rooms` : '5 Properties'}</span>
                  </div>
                </div>

                <div className="flex gap-4 max-w-xs mx-auto">
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className="flex-1 py-3 border border-slate-800 hover:bg-slate-850 text-slate-300 text-xs font-extrabold uppercase rounded-xl tracking-wider inline-flex justify-center items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF Invoice
                  </button>
                  <button
                    type="button"
                    onClick={closeCheckoutModal}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase rounded-xl tracking-wider cursor-pointer"
                  >
                    Dismiss Page
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
