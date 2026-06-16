// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SystemLog } from '../types';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Terminal, 
  Key, 
  RefreshCw, 
  Database, 
  Send, 
  FileSpreadsheet, 
  Folder, 
  ExternalLink, 
  Wifi, 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Sparkles, 
  LogIn, 
  LogOut, 
  Check,
  ToggleLeft,
  ToggleRight,
  Activity,
  UserCheck
} from 'lucide-react';
import { 
  db, 
  googleSignIn, 
  logout, 
  initAuth 
} from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { User } from 'firebase/auth';

interface SecurityDashboardProps {
  logs: SystemLog[];
  onAddLog: (log: SystemLog) => void;
}

export default function SecurityDashboard({ logs, onAddLog }: SecurityDashboardProps) {
  // Core Interactive States
  const [threatLevel, setThreatLevel] = useState<'LOW' | 'ELEVATED' | 'CRITICAL'>('LOW');
  const [activeThreats, setActiveThreats] = useState<number>(0);
  const [keyStandard, setKeyStandard] = useState<'AES-256' | 'AES-512' | 'Quantum-ECC'>('AES-256');
  const [activeTab, setActiveTab] = useState<'gate' | 'workspace_relay' | 'firestore_audits'>('gate');

  // Sub-System Toggles
  const [biometricSec, setBiometricSec] = useState<boolean>(true);
  const [idsIntrusion, setIdsIntrusion] = useState<boolean>(true);
  const [lidarSweep, setLidarSweep] = useState<boolean>(true);
  const [dbEncryption, setDbEncryption] = useState<boolean>(true);

  // Live Performance Metrics Fluctuations
  const [cpuLoad, setCpuLoad] = useState<number>(14);
  const [packetRate, setPacketRate] = useState<number>(340);
  const [integrityScore, setIntegrityScore] = useState<number>(100);

  // Database State - Firestore security logs synced in real-time
  const [cloudLogs, setCloudLogs] = useState<SystemLog[]>([]);
  const [logSearch, setLogSearch] = useState<string>('');
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'OK' | 'WARN' | 'ERROR'>('ALL');

  // Interactive Command Terminal States
  const [commandInput, setCommandInput] = useState<string>('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Aurelia LUXE-OS Shield Security Gate initialized on port 3000.',
    'Cryptographic security core standing by. Operator command access: ACTIVE.'
  ]);

  // OAuth & Workspace Credentials States
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);

  // Google Workspace form states
  const [targetSpreadsheet, setTargetSpreadsheet] = useState<string>('1BxiMVs0XRA5nFMdKvBdBZjgmUUq1MwS7TeGvuxXGf8M');
  const [targetSheetRange, setTargetSheetRange] = useState<string>('Sheet1!A1:E2');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [isExportingSheets, setIsExportingSheets] = useState<boolean>(false);
  const [isExportingDrive, setIsExportingDrive] = useState<boolean>(false);
  const [isSendingAlert, setIsSendingAlert] = useState<boolean>(false);

  // Toast Alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const displayToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync / Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setNeedsAuth(false);
        setAuthToken(token);
        setCurrentUser(user);
      },
      () => {
        setNeedsAuth(true);
        setAuthToken(null);
        setCurrentUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync with Firestore Cloud Event Stream for real-time security logs
  useEffect(() => {
    const logsRef = collection(db, 'system_logs');
    const q = query(logsRef, orderBy('time', 'desc'), limit(30));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbLogs: SystemLog[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        dbLogs.push({
          id: doc.id,
          time: d.time || new Date().toLocaleTimeString(),
          module: d.module || 'UNKNOWN',
          type: d.type || 'INFO',
          message: d.message || ''
        });
      });
      setCloudLogs(dbLogs);
    }, (err) => {
      console.error('Firestore security audit query failed:', err);
    });

    return () => unsubscribe();
  }, []);

  // Fluctuating hardware diagnostic signals
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuLoad(prev => {
        const bias = threatLevel === 'CRITICAL' ? 65 : threatLevel === 'ELEVATED' ? 35 : 12;
        const jitter = Math.floor(Math.random() * 8) - 4;
        return Math.max(5, Math.min(98, bias + jitter));
      });

      setPacketRate(prev => {
        const base = threatLevel === 'CRITICAL' ? 1450 : threatLevel === 'ELEVATED' ? 780 : 310;
        const jitter = Math.floor(Math.random() * 60) - 30;
        return Math.max(50, base + jitter);
      });

      setIntegrityScore(prev => {
        if (threatLevel === 'CRITICAL') return 48;
        if (threatLevel === 'ELEVATED') return 88;
        const brokenCount = [biometricSec, idsIntrusion, lidarSweep, dbEncryption].filter(x => !x).length;
        return 100 - (brokenCount * 12);
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [threatLevel, biometricSec, idsIntrusion, lidarSweep, dbEncryption]);

  // Google Login / Logout Actions
  const handleGoogleConnect = async () => {
    setConnecting(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setAuthToken(res.accessToken);
        setCurrentUser(res.user);
        setNeedsAuth(false);
        displayToast('Google Workspace authentication succeeded. Channels synchronized.');
        writeSystemLog('AUTH_GATE', 'OK', `Authorized luxury operator ${res.user.email} into cloud controls.`);
      }
    } catch (err: any) {
      console.error('Core security auth failure:', err);
      displayToast(`Gateway rejected verification check: ${err.message || String(err)}`);
    } finally {
      setConnecting(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    await logout();
    setAuthToken(null);
    setCurrentUser(null);
    setNeedsAuth(true);
    displayToast('Security token revoked. Transitioned to standalone system state.');
  };

  // Log Helper to write logs both locally and to Cloud Firestore
  const writeSystemLog = async (module: string, type: 'INFO' | 'OK' | 'WARN' | 'ERROR', message: string) => {
    // 1. Add locally
    onAddLog({
      id: `sec-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module,
      type,
      message
    });

    // 2. Persist to Cloud Firestore for true durable state tracking
    try {
      await addDoc(collection(db, 'system_logs'), {
        time: new Date().toLocaleTimeString(),
        module,
        type,
        message,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Failed to commit log to Firestore:', err);
    }
  };

  // Operator Actions
  const cycleCryptographicKeys = () => {
    const next = keyStandard === 'AES-256' ? 'AES-512' : keyStandard === 'AES-512' ? 'Quantum-ECC' : 'AES-256';
    setKeyStandard(next);
    displayToast(`Secured cipher rotation: Transformed current algorithm to ${next}.`);
    writeSystemLog('CRYPT_CORE', 'OK', `Re-keyed Diffie-Hellman encryption matrix to ${next} standard.`);
    appendTerminalMsg(`[*] Success: Cryptographic matrix fully transitioned to ${next}. All sessions secure.`);
  };

  const engageThreatLockdown = () => {
    setThreatLevel('ELEVATED');
    setActiveThreats(1);
    setLidarSweep(true);
    displayToast('Emergency System Isolation: Bandwidth throttled, redundant cores activated.');
    writeSystemLog('SHIELD_GATE', 'WARN', 'Emergency physical lockdown sequence engaged by operator admin.');
    appendTerminalMsg(`[!] LOCKDOWN COMMITTED. Bandwidth restricted on ports A-F. Redundant core isolation online.`);
  };

  const triggerAttackSimulation = () => {
    setThreatLevel('CRITICAL');
    setActiveThreats(3);
    setCpuLoad(85);
    displayToast('⚠️ CRITICAL PERIMETER BREACH SIMULATED.');
    writeSystemLog('SHIELD_GATE', 'ERROR', 'IDS Critical Warning: Multi-vector intrusion trial detected on Lobby Port Gateway.');
    appendTerminalMsg(`[CRITICAL ALERT] Malicious brute-force SQL injections trial flagged on Node Gateway. Hostile IP: 198.51.100.42`);
  };

  const mitigateAllThreats = () => {
    setThreatLevel('LOW');
    setActiveThreats(0);
    setBiometricSec(true);
    setIdsIntrusion(true);
    setLidarSweep(true);
    setDbEncryption(true);
    displayToast('Perimeter restored. Integrity evaluation completed. All nodes OK.');
    writeSystemLog('SHIELD_GATE', 'OK', 'Perimeter restored to normal state. Hostile intrusions isolated and dropped.');
    appendTerminalMsg(`[*] Mitigation successful: Isolated threat vectors purged. Integrity restored to 100%.`);
  };

  // Google Workspace Operations
  const backupToGoogleDrive = async () => {
    if (!authToken) {
      displayToast('Google login required to execute Cloud Drive actions.');
      return;
    }

    const confirmed = window.confirm(
      `Confirm Drive Backup:\n\nThis will write a deep audit report of current security metrics to your Google Drive account.`
    );
    if (!confirmed) return;

    setIsExportingDrive(true);
    try {
      const title = `Aurelia_Security_Report_${Date.now()}.txt`;
      const reportMarkdown = `
========================================
AURELIA GRAND SECURITY SHIELD AUDIT
========================================
Generated At   : ${new Date().toLocaleString()}
Threat Status  : ${threatLevel}
Active Threats : ${activeThreats}
Encryption Core: ${keyStandard}
Integrity Score: ${integrityScore}%
CPU Stress     : ${cpuLoad}%
Data Ingestion : ${packetRate} Packets/Sec

----------------------------------------
SYSTEM TOGGLES
----------------------------------------
Biometric Core : ${biometricSec ? 'ENABLED' : 'DISABLED'}
Intrusion Def. : ${idsIntrusion ? 'ENABLED' : 'DISABLED'}
Perimeter Lidar: ${lidarSweep ? 'ENABLED' : 'DISABLED'}
Cloud Encr.    : ${dbEncryption ? 'ENABLED' : 'DISABLED'}

Report encrypted and packaged using authenticated session: ${currentUser?.email || 'N/A'}.
      `;

      const metadata = { name: title, mimeType: 'text/plain' };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([reportMarkdown], { type: 'text/plain' }));

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: form
      });

      if (!res.ok) {
        throw new Error('Drive API transmission failed');
      }

      const file = await res.json();
      displayToast(`Report generated and saved to Drive! File ID: ${file.id}`);
      writeSystemLog('WORKSPACE_API', 'OK', `Saved emergency shield report "${title}" to operators Google Drive.`);
      appendTerminalMsg(`[*] Google Drive Transferred file: ${title} saved in root folder.`);
    } catch (error: any) {
      console.error(error);
      displayToast('Drive sync encountered a credentials error.');
    } finally {
      setIsExportingDrive(false);
    }
  };

  const appendToGoogleSheet = async () => {
    if (!authToken) {
      displayToast('Google login required to write to Sheets.');
      return;
    }

    if (!targetSpreadsheet) {
      alert('Provide a valid Google Sheet Spreadsheet ID.');
      return;
    }

    setIsExportingSheets(true);
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${targetSpreadsheet}/values/${encodeURIComponent(targetSheetRange)}:append?valueInputOption=USER_ENTERED`;
      
      const rowValue = [
        new Date().toLocaleTimeString(),
        threatLevel,
        keyStandard,
        `${integrityScore}%`,
        `Operator audit compiled via ${currentUser?.email}`
      ];

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: targetSheetRange,
          majorDimension: 'ROWS',
          values: [rowValue]
        })
      });

      if (!res.ok) {
        throw new Error('Spreadsheet cell execution rejected');
      }

      displayToast('Success! Security matrix logged in Google Sheet database.');
      writeSystemLog('WORKSPACE_API', 'OK', 'Appended cryptographic security row to configured GSheeet ledger.');
      appendTerminalMsg(`[*] Spreadsheet cell logged: row values updated inside target document.`);
    } catch (error: any) {
      console.error(error);
      displayToast('Google Sheets API rejected. Validate Spreadsheet ID or permissions.');
    } finally {
      setIsExportingSheets(false);
    }
  };

  const sendGmailAlert = async () => {
    if (!authToken) {
      displayToast('Google account authentication required to route Gmail alerts.');
      return;
    }

    if (!recipientEmail || !recipientEmail.includes('@')) {
      alert('Please enter a valid recipient email address.');
      return;
    }

    const confirmed = window.confirm(
      `Confirm Dispatch:\n\nTransmit high-priority alert email to supervisor ${recipientEmail}?`
    );
    if (!confirmed) return;

    setIsSendingAlert(true);
    try {
      const emailContent = [
        `To: ${recipientEmail}`,
        `Subject: AURELIA SYSTEM ALERT: Shield Security Warning Level ${threatLevel}`,
        `Content-Type: text/html; charset=utf-8`,
        `MIME-Version: 1.0`,
        ``,
        `<div style="font-family: sans-serif; padding: 25px; border: 2px solid #ef4444; border-radius: 16px; background-color: #fef2f2; max-width: 600px;">`,
        `  <h2 style="color: #b91c1c; margin-top: 0; font-family: monospace; font-size: 22px; tracking: -0.5px;">Aurelia Luxury Command Alerts Node</h2>`,
        `  <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">Attention Security Administrator,</p>`,
        `  <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">The luxury operations control grid triggered a premium perimeter security status update:</p>`,
        `  <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #fee2e2; margin: 15px 0;">`,
        `    <ul style="font-size: 13px; font-family: monospace; color: #334155; margin: 0; padding-left: 15px;">`,
        `      <li><b>Grid Threat Level:</b> <span style="color: #ef4444;">${threatLevel}</span></li>`,
        `      <li><b>Active Alarms:</b> ${activeAlarmsCount()} triggers tripped</li>`,
        `      <li><b>Data Decryptor:</b> ${keyStandard} Shield</li>`,
        `      <li><b>System Integrity:</b> ${integrityScore}% State</li>`,
        `    </ul>`,
        `  </div>`,
        `  <p style="font-size: 12px; color: #64748b;">Dispatched securely via compiled OAuth Token proxy on behalf of operator <b>${currentUser?.email}</b>.</p>`,
        `  <hr style="border: 0; border-top: 1px solid #fee2e2; margin: 20px 0;" />`,
        `  <span style="font-size: 9px; color: #94a3b8; font-family: monospace;">AURELIA GRAND CORE CYBER GUARD</span>`,
        `</div>`
      ].join('\r\n');

      const base64Bytes = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch('https://gmail.googleapis.com/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: base64Bytes })
      });

      if (!res.ok) {
        throw new Error('Gmail API dispatch rejected');
      }

      displayToast(`Gmail alert routed successfully to ${recipientEmail}.`);
      writeSystemLog('WORKSPACE_API', 'OK', `Dispatched high-priority warning email alert via Gmail to ${recipientEmail}`);
      appendTerminalMsg(`[*] Gmail routed successfully: Alert packet sent to custom route: ${recipientEmail}.`);
      setRecipientEmail('');
    } catch (error: any) {
      console.error(error);
      displayToast('Gmail transmission sequence failed.');
    } finally {
      setIsSendingAlert(false);
    }
  };

  // Static/Aux helper values
  const activeAlarmsCount = () => {
    let count = 0;
    if (threatLevel === 'CRITICAL') count += 3;
    if (threatLevel === 'ELEVATED') count += 1;
    if (!biometricSec) count++;
    if (!idsIntrusion) count++;
    if (!dbEncryption) count++;
    return count;
  };

  const appendTerminalMsg = (msg: string) => {
    setTerminalOutput(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Terminal form parsing
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim().toLowerCase();
    appendTerminalMsg(`OPERATOR_PROMPT> ${commandInput.toUpperCase()}`);
    setCommandInput('');

    setTimeout(() => {
      if (cmd === '/scan' || cmd === 'scan') {
        setLidarSweep(true);
        setCpuLoad(45);
        displayToast('Full laser lidar sweep initiated.');
        appendTerminalMsg(`[*] Scanning... 8 perimeter laser cameras verified. All 23 sub-grids nominal. Threat: ${threatLevel}`);
        writeSystemLog('SHIELD_GATE', 'INFO', 'Manual operator perimeter lidar & database scan initiated.');
      } else if (cmd === '/lockdown' || cmd === 'lockdown') {
        engageThreatLockdown();
      } else if (cmd === '/rekey' || cmd === 'rekey' || cmd === 'rotate') {
        cycleCryptographicKeys();
      } else if (cmd === '/exploit' || cmd === 'exploit' || cmd === 'test') {
        triggerAttackSimulation();
      } else if (cmd === '/mitigate' || cmd === 'mitigate' || cmd === 'clear') {
        mitigateAllThreats();
      } else if (cmd.startsWith('/email ') || cmd.startsWith('email ')) {
        const mailTarget = cmd.replace(/^\/?email\s+/, '').trim();
        if (mailTarget && mailTarget.includes('@')) {
          setRecipientEmail(mailTarget);
          displayToast(`Target dispatch destination set: ${mailTarget}`);
          appendTerminalMsg(`[*] Gateway route ready: Email queued for ${mailTarget}. Execute click action below.`);
        } else {
          appendTerminalMsg(`[!] Syntax error. Usage: /email target@address.com`);
        }
      } else {
        appendTerminalMsg(`[!] Diagnostic error. Instruction "${cmd.toUpperCase()}" unrecognized. Try: /scan, /lockdown, /rekey, /exploit, /mitigate`);
      }
    }, 400);
  };

  // Filter logs for viewing
  const filteredLogs = cloudLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(logSearch.toLowerCase()) || 
                          log.module.toLowerCase().includes(logSearch.toLowerCase());
    const matchesFilter = logFilter === 'ALL' || log.type === logFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 text-left select-none text-slate-100 font-sans">
      
      {/* FLOATING ACTION TOAST ALERTS */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[99999] px-4.5 py-3 rounded-2xl bg-slate-900 border border-teal-500/40 text-teal-400 shadow-2xl flex items-center gap-3 animate-fade-in-down font-mono text-xs">
          <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping"></span>
          <p className="font-bold tracking-wider uppercase">{toastMessage}</p>
        </div>
      )}

      {/* SYSTEM META DIAGNOSTIC ROW */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${threatLevel === 'CRITICAL' ? 'bg-rose-500 animate-ping' : 'bg-teal-500 animate-pulse'}`}></span>
          <span>AURELIA COMPLIANCE AUDITING INTERACTIVE PORT : v4.6</span>
          <span className="text-slate-700">|</span>
          <span className="hidden md:inline">SYSTEM: ACTIVE</span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span>HOST: PORT_3000</span>
        </div>
        <div className="flex items-center gap-4">
          <span>THREATS INDEXED: <b className={`${threatLevel === 'CRITICAL' ? 'text-rose-400' : 'text-teal-400 font-extrabold'}`}>{activeAlarmsCount()} ACTIVE</b></span>
        </div>
      </div>

      {/* CORE CONTAINER SHIELD GATE */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden relative">

        {/* METABOLIC SCANNING GLOW */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-teal-500/80 to-transparent animate-pulse"></div>

        {/* GATEWAY GLAMOUR HEADER */}
        <div className="p-6 md:p-8 border-b border-slate-900 bg-slate-900/20 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 transition-colors shadow-inner ${
              threatLevel === 'CRITICAL' 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
            }`}>
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  Aurum Security Shield Gate
                </h1>
                <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                  threatLevel === 'CRITICAL' 
                    ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400 animate-bounce' 
                    : 'bg-teal-500/15 border border-teal-500/30 text-teal-400'
                }`}>
                  {threatLevel === 'CRITICAL' ? 'BREACH ALERT' : 'SECURE FRAME'}
                </span>
              </div>
              <p className="text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest mt-2">
                Holographic Physical Barriers, Data Encryptors &amp; Auditing Caches
              </p>
            </div>
          </div>

          {/* SECURITY DASHBOARD PAGES FILTER / VIEW ROUTER */}
          <div className="flex items-center p-1 bg-slate-900/60 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
            {([
              { id: 'gate', label: 'Shield Gate Controls', count: null },
              { id: 'workspace_relay', label: 'Google Cloud Bridge', count: authToken ? 'SYNCED' : 'OFFLINE' },
              { id: 'firestore_audits', label: 'Firestore Security Logs', count: cloudLogs.length || 'LIVE' }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-[10px] font-bold font-mono tracking-wider transition-all uppercase whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-teal-600 text-white shadow-xl' 
                    : 'text-slate-450 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[8px] tracking-normal">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* OAUTH VISITOR VERIFICATION BANNER */}
        <div className="px-6 md:px-8 py-4 bg-slate-900/40 border-b border-slate-900 flex flex-wrap justify-between items-center gap-4 font-mono text-xs select-none">
          <div className="flex items-center gap-3">
            <UserCheck className={`w-4 h-4 ${needsAuth ? 'text-slate-600' : 'text-teal-400 animate-pulse'}`} />
            <span className="text-slate-400">Security Officer Access Credentials:</span>
            {needsAuth ? (
              <span className="text-amber-500 font-bold uppercase">Disconnected Mode (Static)</span>
            ) : (
              <span className="text-teal-400 font-bold uppercase flex items-center gap-1">
                Verified ({currentUser?.email})
              </span>
            )}
          </div>

          <div>
            {needsAuth ? (
              <button
                onClick={handleGoogleConnect}
                disabled={connecting}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white rounded-lg text-[10px] font-bold tracking-wider transition-all flex items-center gap-2 uppercase cursor-pointer"
              >
                {connecting ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-teal-400" />
                ) : (
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-3.5 h-3.5 shrink-0">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                )}
                {connecting ? "Synchronizing Gate..." : "Authorize Workspace Core"}
              </button>
            ) : (
              <button
                onClick={handleGoogleDisconnect}
                className="px-3.5 py-1.5 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-[10px] font-bold tracking-wider transition-colors uppercase cursor-pointer"
              >
                De-Authorize Session
              </button>
            )}
          </div>
        </div>

        {/* CORE GATE TAB SUBSECTION */}
        {activeTab === 'gate' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 select-none">
            
            {/* COLUMN 1: SECURITY KNOBS & SUB-SYSTEM INTERACTIVE CONTROL BAR (Pane 4 col) */}
            <div className="lg:col-span-4 p-6 md:p-8 border-r border-slate-900 bg-slate-900/5 flex flex-col justify-between gap-6">
              
              <div className="space-y-6">
                <div className="border-b border-slate-900 pb-3">
                  <h3 className="text-xs font-bold font-mono tracking-widest text-[#a8b8d0] uppercase">
                    Security Controls &amp; Cipher Specs
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">Calibrate individual defensive and operational subnets manually.</p>
                </div>

                {/* Sub-system switches toggles */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/40 border border-slate-900">
                    <div>
                      <p className="text-xs font-bold font-mono text-slate-200">Biometric Retina Gate</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide">VIP Lobby scanners</p>
                    </div>
                    <button 
                      onClick={() => {
                        setBiometricSec(!biometricSec);
                        writeSystemLog('BIOMETRICS', 'INFO', `Retina gate biometrics toggled manually to: ${!biometricSec ? 'ONLINE' : 'OFFLINE'}`);
                      }}
                      className="text-teal-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      {biometricSec ? <ToggleRight className="w-8 h-8 text-teal-400" /> : <ToggleLeft className="w-8 h-8 text-slate-650" />}
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/40 border border-slate-900">
                    <div>
                      <p className="text-xs font-bold font-mono text-slate-200">IDS Network Firewall</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide">Intrusion Block Filter</p>
                    </div>
                    <button 
                      onClick={() => {
                        setIdsIntrusion(!idsIntrusion);
                        writeSystemLog('FIREWALL_IDS', 'INFO', `IDS detection firewall module toggled to: ${!idsIntrusion ? 'ONLINE' : 'OFFLINE'}`);
                      }}
                      className="text-teal-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      {idsIntrusion ? <ToggleRight className="w-8 h-8 text-teal-400" /> : <ToggleLeft className="w-8 h-8 text-slate-650" />}
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/40 border border-slate-900">
                    <div>
                      <p className="text-xs font-bold font-mono text-slate-200">Outer Perimeter Sweep</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide">Continuous Lidar Grid</p>
                    </div>
                    <button 
                      onClick={() => {
                        setLidarSweep(!lidarSweep);
                        writeSystemLog('PERIMETER_LIDAR', 'INFO', `Perimeter Lidar scanning module manually set to: ${!lidarSweep ? 'ONLINE' : 'OFFLINE'}`);
                      }}
                      className="text-teal-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      {lidarSweep ? <ToggleRight className="w-8 h-8 text-teal-400" /> : <ToggleLeft className="w-8 h-8 text-slate-650" />}
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/40 border border-slate-900">
                    <div>
                      <p className="text-xs font-bold font-mono text-slate-200">Firestore Cloud Encr.</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide">Database Token Crypt</p>
                    </div>
                    <button 
                      onClick={() => {
                        setDbEncryption(!dbEncryption);
                        writeSystemLog('CRYPT_DB', 'INFO', `Firestore DB key-token encryption matrix changed to: ${!dbEncryption ? 'ONLINE' : 'OFFLINE'}`);
                      }}
                      className="text-teal-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      {dbEncryption ? <ToggleRight className="w-8 h-8 text-teal-400" /> : <ToggleLeft className="w-8 h-8 text-slate-650" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Cryptographic controller button */}
              <div className="space-y-3 pt-6 border-t border-slate-900">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Key Standard:</span>
                  <span className="text-teal-400 text-xs font-mono font-extrabold flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-teal-400 shrink-0" /> {keyStandard}
                  </span>
                </div>
                <button
                  onClick={cycleCryptographicKeys}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-teal-400 animate-spin" style={{ animationDuration: '4s' }} /> Rotate Security Matrices
                </button>
              </div>

            </div>

            {/* COLUMN 2: SPINNIG HOLO-SHIELD ROTATION (Center 5 columns) */}
            <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between items-center relative min-h-[460px] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.06)_0%,transparent_65%)] pointer-events-none"></div>

              {/* Holographic scanner top marker */}
              <div className="flex items-center gap-1.5 bg-slate-900/40 px-3 py-1.5 rounded-full border border-slate-850 z-10 font-mono text-[9px] tracking-widest text-slate-400 uppercase select-none">
                <span className={`w-2 h-2 rounded-full ${threatLevel === 'CRITICAL' ? 'bg-rose-500 animate-ping' : 'bg-teal-500 animate-pulse'}`}></span>
                <span>STATE COMPILER: {threatLevel === 'CRITICAL' ? 'ACTIVE PERIMETER COUNTER' : 'SHIELD STEADY'}</span>
              </div>

              {/* SPINNING ROTATOR RINGS */}
              <div className="w-64 h-64 md:w-80 md:h-80 my-8 flex items-center justify-center relative select-none">
                
                {/* Visual Spinning orbits */}
                <div className="absolute inset-0 border border-teal-500/10 rounded-full animate-[spin_35s_linear_infinite]"></div>
                <div className="absolute inset-4 border border-teal-500/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                <div className="absolute inset-10 border border-dashed border-teal-500/15 rounded-full animate-[spin_20s_linear_infinite]"></div>

                {/* Inner central vector image */}
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-slate-950/80 border border-slate-900/80 flex items-center justify-center backdrop-blur relative overflow-hidden group shadow-2xl">
                  
                  {/* Virtual Scanning line */}
                  <div className="absolute left-0 top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400/80 to-transparent animate-[scan_6s_linear_infinite] pointer-events-none z-10"
                    style={{
                      animation: 'scanVertical 6s linear infinite'
                    }}
                  ></div>

                  <img 
                    alt="Cyber Protection Shield Ring" 
                    className="w-36 md:w-44 h-36 md:h-44 object-contain transition-all duration-700 ease-out select-none pointer-events-none" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaG3xYfsS3Epq-K9PDEd-FAcnP4-qGMEOBIQfZenAf8r9i6CuNMyODS3buYPKRKa_Jzgkq-edKEisodZvQHflcHe-mzB3b_mliWwEp2GKQ2XKgxIsUXqYwuqHhzvIkBtqxQUMYSDdlwL64UDiWbkA_RxsNh2KMUAS8V-9kzAX80tsL9yqimobxO3akIXQf40iF8RqhDutJg6jkFxhSEFvGp040ANcWapYrseAft4F-W4CLTWYd5QJolbIXKQ39aH-_GPRxVa3NoNg" 
                    style={{ 
                      WebkitMaskImage: "radial-gradient(circle, black 45%, transparent 80%)", 
                      maskImage: "radial-gradient(circle, black 45%, transparent 80%)",
                      filter: threatLevel === 'CRITICAL' ? 'hue-rotate(330deg) drop-shadow(0 0 25px rgba(239, 68, 68, 0.9))' : 'drop-shadow(0 0 20px rgba(20, 184, 166, 0.5))',
                      transform: threatLevel === 'CRITICAL' ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />

                  {/* Core metric badge overlay */}
                  <div className="absolute bottom-5 inset-x-0 mx-auto text-center font-mono pointer-events-none z-10 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col items-center">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">SHIELD INTEGRITY</span>
                    <span className={`text-base tracking-widest font-black ${threatLevel === 'CRITICAL' ? 'text-rose-400' : 'text-teal-400'}`}>
                      {integrityScore}% MATCHED
                    </span>
                  </div>
                </div>
              </div>

              {/* Status footer button panel */}
              <div className="flex gap-4 w-full justify-center">
                <button
                  onClick={engageThreatLockdown}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-amber-500 text-xs font-mono font-bold uppercase rounded-lg transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  Engage Isolation Mode
                </button>
                <button
                  onClick={triggerAttackSimulation}
                  className="px-4 py-2 bg-slate-900 border border-slate-850 hover:border-rose-500/40 text-rose-500 text-xs font-mono font-bold uppercase rounded-lg transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  Test Perimeter Alert
                </button>
              </div>

            </div>

            {/* COLUMN 3: HARDWARE CORE STATISTICS & DIAGNOSTIC SCREENERS (Right 3 columns) */}
            <div className="lg:col-span-3 p-6 md:p-8 border-l border-slate-900 bg-slate-900/5 flex flex-col justify-between gap-6">
              
              <div className="space-y-6">
                <div className="border-b border-slate-900 pb-3">
                  <h3 className="text-xs font-bold font-mono tracking-widest text-[#a8b8d0] uppercase">
                    Core Metrics &amp; Seals
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">Real-time load profiles and compliance validators from outer sensors.</p>
                </div>

                {/* Animated gauges dials in custom layout */}
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 text-left relative overflow-hidden">
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-slate-400 font-bold uppercase">Hardware Processor stress</span>
                      <span className="text-slate-900 dark:text-white font-black">{cpuLoad}%</span>
                    </div>
                    {/* Linear progressive meter segment */}
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden relative border border-slate-900">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          cpuLoad > 80 ? 'bg-rose-500' : cpuLoad > 55 ? 'bg-amber-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${cpuLoad}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 text-left relative overflow-hidden">
                    <div className="flex justify-between items-center text-xs font-mono mb-2 border-b border-slate-905/20 pb-1.5">
                      <span className="text-slate-400 font-bold uppercase">Filtered packets / sec</span>
                      <span className="text-teal-400 font-mono font-extrabold">{packetRate} P/S</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">SYN Packets filtering active on port 22 &amp; 443</p>
                  </div>

                  <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/10 text-left relative overflow-hidden">
                    <div className="flex justify-between items-center text-xs font-mono text-teal-400 mb-1">
                      <span className="font-mono font-bold uppercase">System Anomaly Rate</span>
                      <span className="font-extrabold">{threatLevel === 'CRITICAL' ? 'HIGH EXPLOIT (48%)' : '0.001%'}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">Statistical anomaly indices computed by real-time heuristic scanning of outer sensors.</p>
                  </div>
                </div>
              </div>

              {/* Verified badges checklist */}
              <div className="space-y-3 pt-6 border-t border-slate-900">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-black block tracking-wider">COMPLIANCE REGULATORY VERIFICATIONS</span>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="text-[10.5px] font-mono text-slate-200 uppercase font-bold">SOC 2 TYPE II COMPLIANT</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="text-[10.5px] font-mono text-slate-200 uppercase font-bold">ISO 27001 AUDIT VALID</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* WORKSPACE OPERATIONS RELAY TAB SECTION */}
        {activeTab === 'workspace_relay' && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-900 pb-4">
              <h2 className="text-lg font-serif font-extrabold text-[#d4e4fa] uppercase">Aurelia Google Workspace Sync Core</h2>
              <p className="text-xs text-slate-500 mt-1">Append diagnostic logs to structured spreadsheets, backup reports to Drive archives, or transmit emails to engineers.</p>
            </div>

            {needsAuth ? (
              <div className="py-12 text-center max-w-lg mx-auto space-y-6 select-none leading-relaxed">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Google Cloud API Access Restricted</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                    To trigger live cells editing inside your Google Sheets, backup reports on Google Drive, or send emergency Gmail alerts, click authorized validation above.
                  </p>
                </div>
                <button
                  onClick={handleGoogleConnect}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 mx-auto"
                >
                  <LogIn className="w-4 h-4" /> Connect Google Account
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
                
                {/* SHEETS SYNC COLUMN */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-900 flex flex-col justify-between gap-5 text-left">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[8px] font-bold text-emerald-400 uppercase font-mono">APPEND_API</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-sans">Google Sheets Audit Log</h4>
                      <p className="text-[11px] text-slate-450 leading-relaxed font-sans normal-case">Log the current state metrics of key standard, threat level, and system security integrity directly into a Google Spreadsheet grid row.</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block mb-1">Spreadsheet Document ID</label>
                        <input 
                          type="text" 
                          value={targetSpreadsheet}
                          onChange={(e) => setTargetSpreadsheet(e.target.value)}
                          placeholder="Spreadsheet ID key"
                          className="w-full bg-slate-950 px-3 py-2 border border-slate-850 rounded-lg text-white font-mono placeholder-slate-700 hover:border-slate-800 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block mb-1">Target Sheet Grid Range</label>
                        <input 
                          type="text" 
                          value={targetSheetRange}
                          onChange={(e) => setTargetSheetRange(e.target.value)}
                          placeholder="e.g. Sheet1!A1:E20"
                          className="w-full bg-slate-950 px-3 py-2 border border-slate-850 rounded-lg text-white font-mono placeholder-slate-700 hover:border-slate-805 search:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={appendToGoogleSheet}
                    disabled={isExportingSheets}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all cursor-pointer uppercase flex items-center justify-center gap-2"
                  >
                    {isExportingSheets ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-900 dark:text-white" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Append Status Row
                      </>
                    )}
                  </button>
                </div>

                {/* DRIVE SYNC COLUMN */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-900 flex flex-col justify-between gap-5 text-left">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
                        <Folder className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-[8px] font-bold text-teal-400 uppercase font-mono font-bold">WRITE_API</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-sans">Google Drive Audit Backup</h4>
                      <p className="text-[11px] text-slate-450 leading-relaxed font-sans normal-case">Generate a high-fidelity Markdown text document detailing current processor stress loads, decryption standard outputs, and active alarms, and save directly to your secure Drive root.</p>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1.5 leading-snug">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">&bull; File name format:</p>
                      <p className="text-[10px] text-teal-400 italic">Aurelia_Security_Report_{Date.now()}.txt</p>
                      <p className="text-[10px] text-slate-500 mt-1">Synced instantly as a compliant archive format.</p>
                    </div>
                  </div>

                  <button
                    onClick={backupToGoogleDrive}
                    disabled={isExportingDrive}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all cursor-pointer uppercase flex items-center justify-center gap-2"
                  >
                    {isExportingDrive ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-900 dark:text-white" />
                    ) : (
                      <>
                        <Folder className="w-3.5 h-3.5 text-slate-900 dark:text-white" /> Save Backup To Drive
                      </>
                    )}
                  </button>
                </div>

                {/* GMAIL SYNC COLUMN */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-900 flex flex-col justify-between gap-5 text-left">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
                        <Bell className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-[8px] font-bold text-rose-400 uppercase font-mono">GMAIL_API</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-sans">Gmail Alarm Dispatcher</h4>
                      <p className="text-[11px] text-slate-450 leading-relaxed font-sans normal-case">Route an priority HTML security alarm packet directly from your connected email account to inform administrators of ongoing exploit conditions.</p>
                    </div>

                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block mb-1">Supervisor Email Address</label>
                        <input 
                          type="email" 
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          placeholder="recipient@example.com"
                          className="w-full bg-slate-950 px-3 py-2 border border-slate-850 rounded-lg text-white font-mono placeholder-slate-700 hover:border-slate-800 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={sendGmailAlert}
                    disabled={isSendingAlert}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 border border-rose-500/10 text-white font-bold rounded-xl transition-all cursor-pointer uppercase flex items-center justify-center gap-2"
                  >
                    {isSendingAlert ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-slate-900 dark:text-white" /> Dispatch Priority Alarm
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* FIRESTORE SECURITY LIVE REGULAR AUDITS TAB */}
        {activeTab === 'firestore_audits' && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-serif font-extrabold text-[#d4e4fa] uppercase">Firestore Remote Security Logs</h2>
                <p className="text-xs text-slate-400 mt-1">Real-time synced database logs tracking luxury operator actions, biometric triggers, and alert statuses of the microgrid.</p>
              </div>
              <button
                onClick={() => {
                  mitigateAllThreats();
                  appendTerminalMsg('[*] Initiated perimeter sweep and logs database flush warning.');
                }}
                className="px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 text-[10px] font-bold font-mono uppercase tracking-wider rounded-lg transition-transform hover:scale-[1.01] cursor-pointer"
              >
                Flush Threats Warning log
              </button>
            </div>

            {/* Logs search & filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-850 rounded-xl outline-none focus:border-teal-500 text-xs text-white font-mono placeholder-slate-600"
                  placeholder="Filter logs by module name, details or action code..."
                />
              </div>

              {/* Filter tabs */}
              <div className="flex bg-slate-900/40 p-1 border border-slate-850 rounded-xl">
                {(['ALL', 'INFO', 'OK', 'WARN', 'ERROR'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setLogFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-wider transition-colors cursor-pointer uppercase ${
                      logFilter === filter 
                        ? 'bg-teal-600 text-white font-extrabold shadow' 
                        : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List box container */}
            <div className="border border-slate-900 rounded-2xl overflow-hidden bg-slate-900/10">
              <div className="p-4 bg-slate-900/60 border-b border-slate-900 flex justify-between font-mono text-[10px] uppercase font-bold text-slate-400 select-none">
                <span>Firestore Document Stream ({filteredLogs.length} Records)</span>
                <span className="text-teal-400 animate-pulse">Connection Secured</span>
              </div>

              <div className="divide-y divide-slate-900 max-h-[460px] overflow-y-auto leading-normal">
                {filteredLogs.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 font-sans text-xs">
                    No matching security logs persisted on database.
                  </div>
                ) : (
                  filteredLogs.map((log) => {
                    return (
                      <div key={log.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-900/20 font-mono text-xs transition-colors">
                        <div className="flex items-start gap-3 text-left">
                          <Database className="w-4.5 h-4.5 text-slate-500 mt-0.5 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 text-[9px] text-[#b9c7e4] tracking-wider uppercase font-extrabold">{log.module}</span>
                              <span className="text-slate-550 text-[10px]">{log.time}</span>
                            </div>
                            <p className="text-slate-200 font-sans mt-2 normal-case text-xs leading-relaxed">{log.message}</p>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black shrink-0 ${
                          log.type === 'OK' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          log.type === 'WARN' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse' :
                          log.type === 'ERROR' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-slate-900 text-slate-500 border border-slate-850'
                        }`}>
                          {log.type}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        )}

        {/* BOTTOM INTEGRATED DIAGNOSTIC TERMINAL */}
        <div className="border-t border-slate-900 bg-slate-950 p-6 flex flex-col gap-4 font-mono text-xs select-none">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <h4 className="text-[10.5px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4 text-teal-400 shrink-0" /> Interactive Security Shield Compiler Terminal
            </h4>
            <span className="text-[8px] font-bold tracking-widest text-[#4de082] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              OPERATING ONLINE
            </span>
          </div>

          {/* Typewriter logs screen */}
          <div className="h-44 overflow-y-auto bg-slate-950/40 p-3 rounded-lg border border-slate-900 space-y-1.5 leading-relaxed text-slate-300 pr-2 select-text scrollbar-thin">
            {terminalOutput.map((out, index) => (
              <div key={index} className="whitespace-pre-wrap select-text hover:bg-slate-900/10 py-0.5 px-1 rounded transition-colors">
                {out}
              </div>
            ))}
          </div>

          {/* Interactive cmd input bar */}
          <form onSubmit={handleTerminalSubmit} className="flex gap-3 items-center pt-2">
            <span className="text-slate-500 font-black shrink-0">LUXE_SEC&gt;</span>
            <input 
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Submit secure instructions (e.g. /scan, /lockdown, /rekey, /exploit, /mitigate)..."
              className="flex-1 bg-slate-900/60 border border-slate-850 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 uppercase font-black"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 border border-slate-800 hover:bg-teal-500 hover:text-slate-950 text-white font-bold rounded-lg transition-colors cursor-pointer"
            >
              RUN DIAGNOSTIC
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
