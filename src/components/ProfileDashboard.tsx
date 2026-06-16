import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Mail, 
  Key, 
  Camera, 
  Fingerprint, 
  Sparkles, 
  Clock, 
  Cpu, 
  Sliders, 
  Grid,
  TrendingUp,
  Award,
  CircleAlert,
  CheckCircle,
  Bell,
  Languages,
  Badge,
  ToggleLeft,
  ToggleRight,
  Database,
  Smartphone,
  Eye,
  EyeOff,
  Terminal,
  RefreshCw,
  Edit2
} from 'lucide-react';
import { SystemLog } from '../types';

interface ProfileDashboardProps {
  logs: SystemLog[];
  onAddLog: (log: SystemLog) => void;
  currentUser: { name: string; role: 'Operator' | 'Manager' } | null;
  onUpdateUser: (newUser: { name: string; role: 'Operator' | 'Manager' }) => void;
}

const PRESET_AVATARS = [
  { id: 'av-1', name: 'Alpha Seal', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaG3xYfsS3Epq-K9PDEd-FAcnP4-qGMEOBIQfZenAf8r9i6CuNMyODS3buYPKRKa_Jzgkq-edKEisodZvQHflcHe-mzB3b_mliWwEp2GKQ2XKgxIsUXqYwuqHhzvIkBtqxQUMYSDdlwL64UDiWbkA_RxsNh2KMUAS8V-9kzAX80tsL9yqimobxO3akIXQf40iF8RqhDutJg6jkFxhSEFvGp040ANcWapYrseAft4F-W4CLTWYd5QJolbIXKQ39aH-_GPRxVa3NoNg' },
  { id: 'av-2', name: 'Imperial Lion', url: 'https://lh3.googleusercontent.com/aida-public/ALyG7coD1q69h4C1x6W-VfT4hC-M95SgPZ8S6E5v_kEqS53-2J1x6Vq6hC_Y=s200' },
  { id: 'av-3', name: 'Aegis Guardian', url: 'https://lh3.googleusercontent.com/aida-public/ALyG7coO3r52t9M8v_i_J8S5E3s_6vTk9Z6P3W8e_VvS53_Xj0w8H=s200' }
];

export default function ProfileDashboard({ logs, onAddLog, currentUser, onUpdateUser }: ProfileDashboardProps) {
  // Input Form States
  const [profileName, setProfileName] = useState(currentUser?.name || 'Alex Chen');
  const [profileRole, setProfileRole] = useState<'Operator' | 'Manager'>(currentUser?.role || 'Operator');
  const [customTitle, setCustomTitle] = useState(() => localStorage.getItem('opulence_custom_title') || 'Senior Opulence Overseer');
  const [callsign, setCallsign] = useState(() => localStorage.getItem('opulence_callsign') || 'VANGUARD-7');
  const [emailAddress, setEmailAddress] = useState(() => localStorage.getItem('opulence_email') || 'alex.chen@aetheon.luxury');
  const [badgeID, setBadgeID] = useState(() => localStorage.getItem('opulence_badge_id') || 'AO-849-Z');
  const [bioFingerprint, setBioFingerprint] = useState(() => localStorage.getItem('opulence_bio_fingerprint') || 'FP-SHA256:88:A9:C2:5E:F6:41:FF');
  
  // Custom Settings Preference Toggles
  const [enableSound, setEnableSound] = useState(() => localStorage.getItem('opulence_pref_sound') !== 'false');
  const [telemetrySync, setTelemetrySync] = useState(() => localStorage.getItem('opulence_pref_telemetry') !== 'false');
  const [showSensitiveKeys, setShowSensitiveKeys] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'credentials' | 'audit_trail'>('details');

  // Encryption code states
  const [operatorKey, setOperatorKey] = useState(() => localStorage.getItem('opulence_operator_key') || '0x99A8F5B4E3219CDD54AA');
  const [keyRotatedCount, setKeyRotatedCount] = useState(0);

  // Success indicator
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Sync state if user prop changes externally
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfileRole(currentUser.role);
    }
  }, [currentUser]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Update the parent app user state
    onUpdateUser({
      name: profileName,
      role: profileRole
    });

    // 2. Persist local extra fields
    localStorage.setItem('opulence_custom_title', customTitle);
    localStorage.setItem('opulence_callsign', callsign);
    localStorage.setItem('opulence_email', emailAddress);
    localStorage.setItem('opulence_badge_id', badgeID);
    localStorage.setItem('opulence_bio_fingerprint', bioFingerprint);
    localStorage.setItem('opulence_pref_sound', String(enableSound));
    localStorage.setItem('opulence_pref_telemetry', String(telemetrySync));
    localStorage.setItem('opulence_operator_key', operatorKey);

    // 3. Add system log
    onAddLog({
      id: `profile-update-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'PROFILE',
      message: `User administrative profile updated and cryptographically sealed. Operator Code: ${badgeID}.`,
      type: 'OK'
    });

    // 4. Show toast notification
    setSaveStatus('Profile Saved & Sealed Successfully');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const rotateOperatorKey = () => {
    const chars = '0123456789ABCDEF';
    let nextKey = '0x';
    for (let i = 0; i < 20; i++) {
      nextKey += chars[Math.floor(Math.random() * 16)];
    }
    setOperatorKey(nextKey);
    setKeyRotatedCount(prev => prev + 1);
    
    onAddLog({
      id: `key-rot-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'PROFILE',
      message: `Operator credential cipher rotated. Active security index updated to ${nextKey.slice(0, 8)}...`,
      type: 'INFO'
    });

    setSaveStatus('Cryptographic Signature Key Rotated');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="space-y-6 text-left select-none max-w-7xl mx-auto font-sans text-slate-100">
      
      {/* FLOATING ACTION TOAST ALERTS */}
      {saveStatus && (
        <div className="fixed top-6 right-6 z-[99999] px-4.5 py-3 rounded-2xl bg-slate-900 border border-emerald-500/40 text-emerald-400 shadow-2xl flex items-center gap-3 animate-fade-in-down font-mono text-xs">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
          <p className="font-bold tracking-wider uppercase">{saveStatus}</p>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>ADMINISTRATOR IDENTITY ACCESS HUB</span>
          <span className="text-slate-700">|</span>
          <span>SYSTEM STATE: STABLE</span>
        </div>
        <div>
          <span>LAST PROFILE BACKUP: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* CORE PROFILE INTERFACE CARD */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden relative">
        
        {/* Metabolic Scanning Top Accent Glow */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent"></div>

        <div className="p-6 md:p-8 border-b border-slate-900 bg-slate-900/20 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="flex items-center gap-4.5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-505/20 text-indigo-400 flex items-center justify-center shrink-0 shadow-inner">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  Alexandria Operator Profile
                </h1>
                <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  SYSTEM LEVEL Clearance
                </span>
              </div>
              <p className="text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest mt-2">
                Configure your display metadata, administrative tags and credentials.
              </p>
            </div>
          </div>

          {/* Sub Navigation Toggles inside Profile */}
          <div className="flex items-center p-1 bg-slate-900/60 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
            {([
              { id: 'details', label: 'Identity Details' },
              { id: 'credentials', label: 'Security & Keys' },
              { id: 'audit_trail', label: 'Interactive Preferences' }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-[10px] font-bold font-mono tracking-wider transition-all uppercase whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-xl' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CORE GRID CONTENT */}
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-12 min-h-[450px]">
          
          {/* LEFT COLUMN: IDENTITY PRESET STATUS (4 Cols) */}
          <div className="lg:col-span-4 p-6 md:p-8 border-r border-slate-900 bg-slate-900/5 flex flex-col justify-between gap-6">
            <div className="space-y-6 text-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start space-y-4">
                {/* Visual Premium Frame Avatar Display */}
                <div className="w-28 h-28 rounded-3xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center relative group overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                  <img 
                    alt="Aetheon Security Seal"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaG3xYfsS3Epq-K9PDEd-FAcnP4-qGMEOBIQfZenAf8r9i6CuNMyODS3buYPKRKa_Jzgkq-edKEisodZvQHflcHe-mzB3b_mliWwEp2GKQ2XKgxIsUXqYwuqHhzvIkBtqxQUMYSDdlwL64UDiWbkA_RxsNh2KMUAS8V-9kzAX80tsL9yqimobxO3akIXQf40iF8RqhDutJg6jkFxhSEFvGp040ANcWapYrseAft4F-W4CLTWYd5QJolbIXKQ39aH-_GPRxVa3NoNg"
                    className="w-20 h-20 object-contain drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  />
                  <div className="absolute bottom-2 inset-x-0 text-center font-mono py-0.5 text-[8px] bg-indigo-950/90 text-indigo-400 border-t border-indigo-500/10 uppercase tracking-widest font-bold">
                    ACTIVE OPERATOR
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-serif font-black text-slate-900 dark:text-white uppercase">{profileName}</h3>
                  <p className="text-[10px] font-mono text-indigo-400 tracking-wider font-extrabold uppercase">{customTitle}</p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase">CALLSIGN: {callsign}</p>
                </div>
              </div>

              {/* Status metrics tags list */}
              <div className="space-y-3.5 pt-4 border-t border-slate-900">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500 font-bold uppercase">Badge Identifier</span>
                  <span className="text-slate-900 dark:text-white font-extrabold">{badgeID}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500 font-bold uppercase">Privilege Clearance</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    profileRole === 'Manager' ? 'bg-amber-500/10 border border-amber-505/20 text-amber-500' : 'bg-teal-500/10 border border-teal-505/20 text-teal-400'
                  }`}>
                    {profileRole.toUpperCase()} Level
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500 font-bold uppercase">Biometric Hash Status</span>
                  <span className="text-emerald-400 font-serif font-extrabold flex items-center gap-1">
                    <Fingerprint className="w-3.5 h-3.5" /> SECURE MATCH
                  </span>
                </div>
              </div>
            </div>

            {/* Quick backup card note */}
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[10px] space-y-1.5 leading-relaxed text-slate-400">
              <span className="font-mono text-indigo-400 font-extrabold uppercase block">OPERATOR SIGN-OFF MATRIX</span>
              All profile fields are synchronized automatically in client-state cache storage. Cryptographic seal remains intact until user token de-authorized.
            </div>
          </div>

          {/* CENTER/RIGHT PANEL FOR ACTIVE FORM & CONTROLS (8 Cols) */}
          <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between gap-6">
            
            {/* DETAILS VIEW TAB */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="border-b border-slate-900 pb-3">
                  <span className="text-xs font-bold font-mono tracking-widest text-[#a8b8d0] uppercase">Identity &amp; Metadata Parameters</span>
                  <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Calibrate display options visible on navigation controls and audit records.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Operator Full Name</label>
                    <input 
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-900 px-3.5 py-2.5 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Alex Chen"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">System Authority Role</label>
                    <select
                      value={profileRole}
                      onChange={(e) => setProfileRole(e.target.value as 'Operator' | 'Manager')}
                      className="w-full bg-slate-900 px-3.5 py-2.5 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                    >
                      <option value="Operator">Lobby Officer (Operator Level)</option>
                      <option value="Manager">Owner &amp; Proprietor (Manager Level)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Custom Designator Title</label>
                    <input 
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full bg-slate-900 px-3.5 py-2.5 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Aethelred Grand Overseer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Radio Callsign Designator</label>
                    <input 
                      type="text"
                      value={callsign}
                      onChange={(e) => setCallsign(e.target.value)}
                      className="w-full bg-slate-900 px-3.5 py-2.5 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. VANGUARD-7"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Workspace Notification Email (Secure Direct Link)</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input 
                        type="email"
                        required
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full bg-slate-900 pl-10 pr-4 py-2.5 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="operator@aetheon.luxury"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CREDENTIALS TAB */}
            {activeTab === 'credentials' && (
              <div className="space-y-6">
                <div className="border-b border-slate-900 pb-3">
                  <span className="text-xs font-bold font-mono tracking-widest text-[#a8b8d0] uppercase">Cryptographic Signature Keys</span>
                  <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Configure physical hardware tokens and private key matrices.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400 font-bold uppercase flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-indigo-400" /> Private Hex signature token
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowSensitiveKeys(!showSensitiveKeys)}
                        className="text-indigo-450 hover:text-indigo-400 transition-all cursor-pointer font-bold uppercase text-[9px]"
                      >
                        {showSensitiveKeys ? 'Hide Cipher' : 'Show Cipher'}
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <input 
                        type={showSensitiveKeys ? 'text' : 'password'}
                        value={operatorKey}
                        disabled
                        className="flex-1 bg-slate-900 px-3.5 py-2.5 border border-slate-850 rounded-xl text-xs font-mono tracking-widest text-slate-300"
                      />
                      <button
                        type="button"
                        onClick={rotateOperatorKey}
                        className="px-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-[10px] font-mono font-bold text-teal-400 tracking-wider hover:scale-[1.02] transition-transform cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '5s' }} /> ROTATE
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">System Badge Label Identifier</label>
                      <input 
                        type="text"
                        value={badgeID}
                        onChange={(e) => setBadgeID(e.target.value)}
                        className="w-full bg-slate-900 px-3.5 py-3 border border-slate-850 rounded-xl text-white font-mono uppercase"
                        placeholder="AO-849-Z"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Biometric Scan Code Reference</label>
                      <input 
                        type="text"
                        value={bioFingerprint}
                        onChange={(e) => setBioFingerprint(e.target.value)}
                        className="w-full bg-slate-900 px-3.5 py-3 border border-slate-850 rounded-xl text-white font-mono uppercase"
                        placeholder="FP-SHA256:xx:xx:xx..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'audit_trail' && (
              <div className="space-y-6">
                <div className="border-b border-slate-900 pb-3">
                  <span className="text-xs font-bold font-mono tracking-widest text-[#a8b8d0] uppercase">Interactive Preferences</span>
                  <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Fine-tune telemetry dashboard components, sound triggers and logging frequencies.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/40 border border-slate-900">
                    <div>
                      <p className="text-xs font-bold font-mono text-slate-200">Interactive Acoustic Signals</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide">Synthesized ambient feedback on operations click</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setEnableSound(!enableSound)}
                      className="text-indigo-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      {enableSound ? <ToggleRight className="w-8 h-8 text-indigo-400" /> : <ToggleLeft className="w-8 h-8 text-slate-650" />}
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/40 border border-slate-900">
                    <div>
                      <p className="text-xs font-bold font-mono text-slate-200">Real-Time Cloud Diagnostics Sync</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide">Continuous background telemetry stream aggregation</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setTelemetrySync(!telemetrySync)}
                      className="text-indigo-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      {telemetrySync ? <ToggleRight className="w-8 h-8 text-indigo-400" /> : <ToggleLeft className="w-8 h-8 text-slate-650" />}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 text-left">
                    <span className="text-[10px] font-mono text-slate-550 uppercase font-black block mb-1">Rotations Metadata Metrics</span>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      You have executed <b className="text-indigo-400">{keyRotatedCount} key rotation cycles</b> in this active session. Redundant key logs are cached inside localized device registries.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SEALS SUBMIT TRIGGER */}
            <div className="pt-6 border-t border-slate-900 flex justify-end gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-slate-900 dark:text-white" /> SEAL PROFILE RECONSTRUCTION
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
