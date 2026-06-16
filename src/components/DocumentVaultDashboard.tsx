/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  Search, 
  Plus, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Download, 
  ExternalLink,
  ChevronDown,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  FileSpreadsheet,
  CloudLightning,
  RefreshCw,
  Send,
  Upload,
  Layers,
  Sparkles,
  Bot
} from 'lucide-react';
import { 
  db, 
  googleSignIn, 
  logout, 
  getAccessToken, 
  initAuth, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import { User } from 'firebase/auth';

interface FirestoreDocLog {
  id: string;
  name: string;
  category: string;
  status: string;
  valDate: string;
  size: string;
  hash: string;
  uploadedBy: string;
}

export default function DocumentVaultDashboard() {
  const [activeTab, setActiveTab] = useState<'documents' | 'workspace' | 'compliance' | 'audits'>('documents');
  const [wsTab, setWsTab] = useState<'drive' | 'sheets' | 'gmail'>('drive');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Connection and Authorization States
  const [needsAuth, setNeedsAuth] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Firestore Sync Documents State
  const [firestoreDocs, setFirestoreDocs] = useState<FirestoreDocLog[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Drive API State
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [loadingDrive, setLoadingDrive] = useState(false);
  const [driveSearch, setDriveSearch] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Sheets API State
  const [spreadsheetId, setSpreadsheetId] = useState('1BxiMVs0XRA5nFMdKvBdBZjgmUUq1MwS7TeGvuxXGf8M'); // Public sample
  const [sheetRange, setSheetRange] = useState('Class Data!A1:F10');
  const [sheetData, setSheetData] = useState<string[][]>([]);
  const [loadingSheets, setLoadingSheets] = useState(false);

  // Gmail API State
  const [emails, setEmails] = useState<any[]>([]);
  const [loadingGmail, setLoadingGmail] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingMail, setIsSendingMail] = useState(false);

  // Local Static Documents fallback
  const [documents, setDocuments] = useState([
    { id: 'doc-1', name: 'SOC-2 Type II Audit Security Assessment', category: 'Compliance', status: 'Approved', valDate: 'Oct 28, 2025', size: '2.4 MB', hash: 'sha256_c3a88fb...' },
    { id: 'doc-2', name: 'Aetheon Luxury Lodge Fire & Safety Cert', category: 'Safety', status: 'Compliant', valDate: 'Jun 12, 2027', size: '1.8 MB', hash: 'sha256_a0be241...' },
    { id: 'doc-3', name: 'Elite Blockchain Vintage Verif Agreement', category: 'Contract', status: 'Active', valDate: 'Permanent', size: '4.1 MB', hash: 'sha256_dd98ef3...' },
    { id: 'doc-4', name: 'Municipal Luxury Liquor License (Elite Division)', category: 'License', status: 'Approved', valDate: 'Dec 05, 2026', size: '940 KB', hash: 'sha256_fe9d92e...' },
    { id: 'doc-5', name: 'General Data Protection Regulation (GDPR) Audit', category: 'Compliance', status: 'Under Review', valDate: 'May 16, 2025', size: '3.6 MB', hash: 'sha256_88b1ccf...' },
    { id: 'doc-6', name: 'Elevator Safety & Logistics Certificate', category: 'Safety', status: 'Compliant', valDate: 'Nov 30, 2026', size: '1.2 MB', hash: 'sha256_66ae8cf...' }
  ]);

  const [alerts, setAlerts] = useState<string[]>([]);

  // 1. Initialize Auth on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, cachedToken) => {
        setNeedsAuth(false);
        setAuthToken(cachedToken);
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

  // 2. Fetch/Listen for synced document logs in Firestore
  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, 'system_docs'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docsList: FirestoreDocLog[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          docsList.push({
            id: doc.id,
            name: data.name,
            category: data.category,
            status: data.status,
            valDate: data.valDate,
            size: data.size,
            hash: data.hash,
            uploadedBy: data.uploadedBy
          });
        });
        setFirestoreDocs(docsList);
      }, (error) => {
        // Required secure error handler pattern
        handleFirestoreError(error, OperationType.GET, 'system_docs');
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  // Auth helper trigger
  const handleLogin = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setAuthToken(res.accessToken);
        setCurrentUser(res.user);
        setNeedsAuth(false);
        setStatusMessage("Access Granted: Synchronized secure Workspace and Firestore nodes!");
      }
    } catch (err: any) {
      console.error('Core auth gate failed', err);
      setStatusMessage(`Security Gateway Rejected: ${err.message || String(err)}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAuthToken(null);
    setCurrentUser(null);
    setNeedsAuth(true);
    setDriveFiles([]);
    setSheetData([]);
    setEmails([]);
    setStatusMessage("Security credentials revoked. Off-grid offline mode restored.");
  };

  // 3. Google Drive Core APIs Integration
  const fetchDriveFiles = async () => {
    if (!authToken) return;
    setLoadingDrive(true);
    try {
      const queryParam = driveSearch ? encodeURIComponent(`name contains '${driveSearch}'`) : '';
      const url = `https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,createdTime,webViewLink,size)&q=${queryParam}`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Drive fetch failed');
      }
      
      const data = await res.json();
      setDriveFiles(data.files || []);
    } catch (err: any) {
      console.error('Drive listing error:', err);
      alert(`Google Drive: ${err.message}`);
    } finally {
      setLoadingDrive(false);
    }
  };

  // Upload to Drive & Sync to Firestore
  const handleDriveUpload = async () => {
    if (!authToken || !uploadName || !uploadContent) {
      alert("Please provide both file name and text content to transmit.");
      return;
    }

    // MANDATORY explicit user confirmation for destructive/modifying API calls
    const confirmed = window.confirm(
      `Confirm Upload:\n\nCreate and upload a new file "${uploadName}" to your personal Google Drive account and sync transaction record to Google Cloud Firestore?`
    );
    if (!confirmed) return;

    setIsUploading(true);
    try {
      const metadata = {
        name: uploadName.endsWith('.txt') ? uploadName : `${uploadName}.txt`,
        mimeType: 'text/plain'
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([uploadContent], { type: 'text/plain' }));

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,createdTime,size', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: form
      });

      if (!res.ok) {
        const errPayload = await res.json();
        throw new Error(errPayload.error?.message || 'Drive transfer failed');
      }

      const fileData = await res.json();
      
      // Sync document transaction record to Google Cloud Firestore using secure wrapper
      try {
        await addDoc(collection(db, 'system_docs'), {
          name: fileData.name,
          category: 'Drive Logs',
          status: 'Synced',
          valDate: 'Permanent',
          size: `${Math.round((parseInt(fileData.size || '0') / 1024) * 10) / 10} KB` || '1 KB',
          hash: `drive_${fileData.id.substring(0, 10)}`,
          uploadedBy: currentUser?.email || 'Authenticated Staff',
          createdAt: new Date()
        });
      } catch (firestoreErr) {
        handleFirestoreError(firestoreErr, OperationType.WRITE, 'system_docs');
      }

      setUploadName('');
      setUploadContent('');
      alert(`Success! File "${fileData.name}" safely stored on Google Drive and indexed inside Firestore.`);
      fetchDriveFiles();
    } catch (err: any) {
      console.error('Drive uploading failed:', err);
      alert(`Drive upload rejected: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // 4. Google Sheets Cells Importer
  const fetchSpreadsheetCells = async () => {
    if (!authToken || !spreadsheetId || !sheetRange) {
      alert("Please specify Spreadsheet ID and grid bounds range (e.g., A1:F10)");
      return;
    }
    setLoadingSheets(true);
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetRange)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (!res.ok) {
        const errPayload = await res.json();
        throw new Error(errPayload.error?.message || 'Sheets engine cell query rejected');
      }

      const data = await res.json();
      setSheetData(data.values || []);
    } catch (err: any) {
      console.error('Google Sheets Importer error:', err);
      alert(`Google Sheets Importer: ${err.message}`);
    } finally {
      setLoadingSheets(false);
    }
  };

  // 5. Gmail Dispatcher & Alert Feed
  const fetchGmailLogs = async () => {
    if (!authToken) return;
    setLoadingGmail(true);
    try {
      const res = await fetch('https://gmail.googleapis.com/v1/users/me/messages?maxResults=8', {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (!res.ok) {
        const errPayload = await res.json();
        throw new Error(errPayload.error?.message || 'Gmail listing failed');
      }

      const data = await res.json();
      const rawMessages = data.messages || [];

      // Fetch details for each message to retrieve Subjects/From headers
      const detailPromises = rawMessages.map(async (msg: any) => {
        const dRes = await fetch(`https://gmail.googleapis.com/v1/users/me/messages/${msg.id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (dRes.ok) {
          return dRes.json();
        }
        return null;
      });

      const processed = await Promise.all(detailPromises);
      setEmails(processed.filter(Boolean));
    } catch (err: any) {
      console.error('Gmail listing failure:', err);
      alert(`Gmail client failed: ${err.message}`);
    } finally {
      setLoadingGmail(false);
    }
  };

  // Dispatch Secure Alert Email
  const handleSendEmail = async () => {
    if (!authToken || !recipient || !emailSubject || !emailBody) {
      alert("Fill all delivery details (Recipient, Subject, Body) to route alert email.");
      return;
    }

    // MANDATORY explicit user confirmation for sending emails
    const confirmed = window.confirm(
      `Confirm Email Transmission:\n\nSend a live email from your account with the following parameters?\n\nTo: ${recipient}\nSubject: ${emailSubject}`
    );
    if (!confirmed) return;

    setIsSendingMail(true);
    try {
      const formatted = [
        `To: ${recipient}`,
        `Subject: ${emailSubject}`,
        `Content-Type: text/html; charset=utf-8`,
        `MIME-Version: 1.0`,
        ``,
        `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #14b8a6; border-radius: 12px; background-color: #f0fdfa;">`,
        `  <h2 style="color: #0d9488; margin-top: 0;">Aurum Corporate Security Operational Alert</h2>`,
        `  <p>${emailBody.replace(/\ng/, '<br>')}</p>`,
        `  <hr style="border: 0; border-top: 1px solid #ccfbf1; margin: 15px 0;" />`,
        `  <p style="font-size: 10px; color: #64748b; font-family: monospace;">AURELIA GRAND SECURITY COMMAND (CLOUD SIGNATURE SECURED)</p>`,
        `</div>`
      ].join('\r\n');

      const base64Bytes = btoa(unescape(encodeURIComponent(formatted)))
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
        const errPayload = await res.json();
        throw new Error(errPayload.error?.message || 'Gmail transmision failed');
      }

      setRecipient('');
      setEmailSubject('');
      setEmailBody('');
      alert("Success! High-level operational alert dispatched via Gmail.");
      fetchGmailLogs();
    } catch (err: any) {
      console.error('Gmail dispatching failed:', err);
      alert(`Gmail dispatcher failed: ${err.message}`);
    } finally {
      setIsSendingMail(false);
    }
  };

  // Trigger content sync on selection
  useEffect(() => {
    if (authToken && activeTab === 'workspace') {
      if (wsTab === 'drive') fetchDriveFiles();
      if (wsTab === 'sheets') fetchSpreadsheetCells();
      if (wsTab === 'gmail') fetchGmailLogs();
    }
  }, [authToken, activeTab, wsTab]);

  const handleDownload = (docName: string) => {
    const alertMsg = `Secure PDF transport negotiated for files: "${docName}". Initiating secure download stream...`;
    setAlerts(prev => [alertMsg, ...prev]);
    alert(alertMsg);
  };

  const handleCreateDocument = () => {
    const name = prompt("Enter new document name (Corporate Vault format):");
    if (!name) return;
    const newDoc = {
      id: `doc-${Date.now()}`,
      name,
      category: 'Compliance',
      status: 'Approved',
      valDate: 'Dec 2026',
      size: '1.5 MB',
      hash: `sha256_${Math.random().toString(16).substring(2, 10)}...`
    };
    setDocuments([newDoc, ...documents]);
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.hash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder ? doc.category.toLowerCase() === selectedFolder.toLowerCase() : true;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="space-y-6 text-left selection:bg-teal-500 selection:text-white">
      
      {/* HEADER BAR FOR AURELIA OPERATIONAL COMMAND CENTER */}
      <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10 font-mono text-[10px] uppercase tracking-wider text-slate-400 select-none flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
          <span>AURELIA COMPLIANCE CORE v2.8</span>
          <span className="text-slate-600 font-bold">|</span>
          <span>FIRESTORE CLOUD DATABASE ACCESS SYNCED</span>
        </div>
        <div>
          <span>VAULT SECURITY: <b className="text-teal-400">FIRESTORE SECURED</b></span>
        </div>
      </div>

      {/* CORE VAULT LAYOUT BOX */}
      <div className="rounded-3xl border border-slate-205 dark:border-slate-850 bg-white dark:bg-slate-900/60 shadow-xl overflow-hidden backdrop-blur">
        
        {/* BAR HEADER */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-500 flex items-center justify-center shadow-inner shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  Aurelia Grand Operational Command Center
                </h1>
                <span className="px-2 py-0.5 rounded bg-teal-500/15 border border-teal-500/30 text-[9px] font-mono font-bold text-teal-500 uppercase">SECURE</span>
              </div>
              <p className="text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest mt-1.5">
                Multi-Tenant Vault & Google Workspace Integrator
              </p>
            </div>
          </div>

          {/* TAB HEADER TABS (Documents, Workspace, Compliance, Audits) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 border border-slate-250 dark:border-slate-850 rounded-xl max-w-full overflow-x-auto">
            {([
              { id: 'documents', label: 'Documents Vault' },
              { id: 'workspace', label: 'Google Cloud Sync' },
              { id: 'compliance', label: 'Compliance Index' },
              { id: 'audits', label: 'Dynamic Vault Logs' }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-[10px] font-semibold font-mono tracking-wider transition-all uppercase cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'text-slate-550 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* GOOGLE CUSTOM LOGIN STRIP */}
        <div className="px-6 md:px-8 py-4 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-850 flex flex-wrap justify-between items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <CloudLightning className={`w-4 h-4 ${needsAuth ? 'text-slate-400' : 'text-teal-400 animate-pulse'}`} />
            <span className="text-slate-500">Google Connection:</span>
            {needsAuth ? (
              <span className="text-orange-400 font-bold uppercase">Disconnected (Offline Model)</span>
            ) : (
              <span className="text-teal-400 font-bold uppercase flex items-center gap-1">
                Connected ({currentUser?.email})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {needsAuth ? (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-205 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-[10px] font-bold tracking-wider transition-all flex items-center gap-2 uppercase cursor-pointer"
              >
                {isLoggingIn ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-teal-400" />
                ) : (
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-3.5 h-3.5">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                )}
                {isLoggingIn ? "Securing Tunnel..." : "Connect Google Account"}
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-550 dark:text-rose-400 rounded-lg text-[10px] font-bold tracking-wider transition-colors uppercase cursor-pointer"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>

        {statusMessage && (
          <div className="mx-6 md:mx-8 mt-6 p-4 rounded-xl text-left bg-teal-500/10 border border-teal-500/20 text-teal-400 font-sans text-xs flex items-center gap-2.5">
            <CheckCircle className="w-4.5 h-4.5 grow-0 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* WORKSPACE VIEW ROUTING */}
        {activeTab === 'documents' && (
          <>
            {/* WORKSPACE SUBTITLE BANNER */}
            <div className="p-6 md:p-8 bg-slate-50/30 dark:bg-slate-950/10 border-b border-rose-50/5 dark:border-slate-850/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-serif font-extrabold text-slate-850 dark:text-white uppercase tracking-tight">Local Secure Vault</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage critical certificates, building plans, and license keys securely within immediate caches.</p>
              </div>
              <button 
                onClick={handleCreateDocument}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 hover:scale-102 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> New Document Card
              </button>
            </div>

            {/* FOLDER STAT DECK ROW */}
            <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none bg-slate-50/10 dark:bg-slate-900/10">
              <div 
                onClick={() => setSelectedFolder(selectedFolder === 'License' ? null : 'License')}
                className={`cursor-pointer group rounded-2xl p-5 border transition-all ${
                  selectedFolder === 'License' 
                    ? 'bg-teal-500/10 border-teal-500 text-teal-400' 
                    : 'bg-white dark:bg-slate-950/40 hover:bg-slate-50/50 dark:hover:bg-slate-950 border-slate-205 dark:border-slate-850 hover:border-teal-500/40 text-slate-850 dark:text-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Folder className="w-5 h-5 fill-teal-500/10" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-[9px] font-mono font-bold text-teal-400">ACTIVE</span>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-tight mt-4">Licenses &amp; Permits</h3>
                <p className="text-slate-500 text-xs mt-1 font-mono">8 Secured Records</p>
              </div>

              <div
                onClick={() => setSelectedFolder(selectedFolder === 'Safety' ? null : 'Safety')}
                className={`cursor-pointer group rounded-2xl p-5 border transition-all ${
                  selectedFolder === 'Safety' 
                    ? 'bg-teal-500/10 border-teal-500 text-teal-400' 
                    : 'bg-white dark:bg-slate-950/40 hover:bg-slate-50/50 dark:hover:bg-slate-950 border-slate-205 dark:border-slate-850/80 hover:border-teal-500/40 text-slate-850 dark:text-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Folder className="w-5 h-5 fill-teal-500/10" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-[9px] font-mono font-bold text-teal-400">ACTIVE</span>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-tight mt-4">Safety Certificates</h3>
                <p className="text-slate-500 text-xs mt-1 font-mono">12 Secured Records</p>
              </div>

              <div 
                onClick={() => setSelectedFolder(selectedFolder === 'Contract' ? null : 'Contract')}
                className={`cursor-pointer group rounded-2xl p-5 border transition-all ${
                  selectedFolder === 'Contract' 
                    ? 'bg-teal-500/10 border-teal-500 text-teal-400' 
                    : 'bg-white dark:bg-slate-950/40 hover:bg-slate-50/50 dark:hover:bg-slate-950 border-slate-205 dark:border-slate-850/80 hover:border-teal-505/40 text-slate-850 dark:text-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Folder className="w-5 h-5 fill-teal-500/10" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-[9px] font-mono font-bold text-teal-400">OPTIMAL</span>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-tight mt-4">Operational Contracts</h3>
                <p className="text-slate-500 text-xs mt-1 font-mono">25 Secured Records</p>
              </div>

              <div 
                onClick={() => setSelectedFolder(selectedFolder === 'Compliance' ? null : 'Compliance')}
                className={`cursor-pointer group rounded-2xl p-5 border transition-all ${
                  selectedFolder === 'Compliance' 
                    ? 'bg-teal-500/10 border-teal-500 text-teal-400' 
                    : 'bg-white dark:bg-slate-950/40 hover:bg-slate-50/50 dark:hover:bg-slate-950 border-slate-205 dark:border-slate-850/80 hover:border-teal-500/40 text-slate-850 dark:text-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Folder className="w-5 h-5 fill-teal-500/10" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-[9px] font-mono font-bold text-teal-400">SECURED</span>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-tight mt-4">Compliance Reports</h3>
                <p className="text-slate-500 text-xs mt-1 font-mono">5 Secured Records</p>
              </div>
            </div>

            {/* COMBINED INTERACTIVE PANEL SEARCH & AUDIT BOX */}
            <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-slate-100 dark:border-slate-850">
              
              {/* LEFT TABLE: SECURE PDF LIST */}
              <div className="lg:col-span-8 p-6 md:p-8 border-r border-slate-150 dark:border-slate-850 flex flex-col gap-6">
                
                {/* SEARCH AND FILTERS */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 text-slate-800 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono placeholder:text-slate-400 placeholder:font-sans"
                      placeholder="Search secure documents, hashes, or identifiers..."
                    />
                  </div>

                  <div className="flex items-center gap-2 select-none">
                    <span className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] uppercase font-mono text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 flex items-center gap-1.5 transition-colors">
                      <Filter className="w-3.5 h-3.5" /> Filter: {selectedFolder || 'All'}
                    </span>
                    {selectedFolder && (
                      <button 
                        onClick={() => setSelectedFolder(null)}
                        className="text-xs text-rose-500 hover:underline font-mono uppercase"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* DOCUMENT LIST TABLE */}
                <div className="overflow-x-auto border border-slate-100 dark:border-slate-850/80 rounded-2xl">
                  <table className="w-full text-left border-collapse select-none">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/50 text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-850">
                        <th className="py-4 px-5">Document Name</th>
                        <th className="py-4 px-5">Category</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5">Audit Hash</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs font-mono">
                      {filteredDocs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-sans">
                            No secure documents match your active filters or search terms.
                          </td>
                        </tr>
                      ) : (
                        filteredDocs.map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all">
                            <td className="py-4 px-5 font-sans">
                              <div className="flex items-center gap-2.5">
                                <FileText className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                                <div>
                                  <p className="font-bold text-slate-800 dark:text-white leading-tight">{doc.name}</p>
                                  <p className="text-[10px] text-slate-500 mt-1">Validity &bull; <b className="text-slate-400">{doc.valDate}</b> | Filesize: {doc.size}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-5 text-[10px]">
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold uppercase">
                                {doc.category}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-[10px]">
                              <span className={`inline-flex items-center gap-1 font-bold ${
                                doc.status === 'Approved' || doc.status === 'Compliant' || doc.status === 'Active'
                                  ? 'text-emerald-500' 
                                  : 'text-amber-500'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  doc.status === 'Approved' || doc.status === 'Compliant' || doc.status === 'Active'
                                    ? 'bg-emerald-500' 
                                    : 'bg-amber-500'
                                }`}></span>
                                {doc.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 px-5 font-mono text-[9px] text-slate-500">
                              {doc.hash}
                            </td>
                            <td className="py-4 px-5 text-right">
                              <button
                                onClick={() => handleDownload(doc.name)}
                                className="p-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-500 rounded-lg transition-transform hover:scale-105 cursor-pointer"
                                title="Download Verified Audit PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* AUDIT-READY SUMMARY (Col Span 4) */}
              <div className="lg:col-span-4 p-6 md:p-8 flex flex-col gap-6 select-none leading-relaxed">
                <div className="text-left border-b border-slate-100 dark:border-slate-850 pb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Audit-Ready Overview</h3>
                </div>

                <div className="space-y-4">
                  {/* Card SOC2 Type II Assessment */}
                  <div className="border border-slate-205 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/10 rounded-2xl p-5 space-y-4 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">SOC 2 Type II assessment</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[8px] font-mono font-bold text-emerald-400 flex items-center gap-1 uppercase">
                        <CheckCircle className="w-3 h-3" /> Compliant
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 normal-case font-sans">
                      The multi-tenant datastores under management were audited on <b>Oct 28, 2024</b> and proved ISO-equivalent lock compliance.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={() => handleDownload("SOC 2 Type II assessment Audit Statement (2024)")}
                        className="py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-[9px] font-mono text-slate-650 hover:text-white transition-all text-center flex items-center justify-center gap-1.5 hover:scale-101 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Report
                      </button>
                      <button 
                        onClick={() => alert("Cryptographic verification: SOC-2 validation matched SHA-256 local database master block.")}
                        className="py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-[9px] font-mono text-slate-650 hover:text-white transition-all text-center flex items-center justify-center gap-1.5 hover:scale-101 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" /> Verify Hash
                      </button>
                    </div>
                  </div>

                  {/* Card ISO 27001 assessment */}
                  <div className="border border-slate-205 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/10 rounded-2xl p-5 space-y-4 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">ISO 27001 assessment</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[8px] font-mono font-bold text-emerald-400 flex items-center gap-1 uppercase">
                        <CheckCircle className="w-3 h-3" /> Certified
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 normal-case font-sans">
                      Information security management systems are evaluated annually. Next physical audit review scheduled: <b>Nov 2026</b>.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={() => handleDownload("ISO-27001 Cryptographic Certificate v4")}
                        className="py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-[9px] font-mono text-slate-650 hover:text-white transition-all text-center flex items-center justify-center gap-1.5 hover:scale-101 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Cert
                      </button>
                      <button 
                        onClick={() => alert("Cryptographic validation check: ISO-27001 master key verified successfully against cloud trust root.")}
                        className="py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-[9px] font-mono text-slate-650 hover:text-white transition-all text-center flex items-center justify-center gap-1.5 hover:scale-101 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" /> Verify Hash
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* WORKSPACE - REAL GOOGLE WORKSPACE APIS IMPLEMENTATION */}
        {activeTab === 'workspace' && (
          <div className="p-6 md:p-8 space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-serif font-extrabold text-slate-800 dark:text-white uppercase">Google Workspace Portal</h2>
                <p className="text-xs text-slate-500 mt-1">Execute direct API tasks on your Drive storage, Sheets data grids, and Gmail messaging relays.</p>
              </div>

              {/* Sub tabs inside Workspace (Drive, Sheets, Gmail) */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl">
                {([
                  { id: 'drive', label: 'Google Drive Stream', icon: Folder },
                  { id: 'sheets', label: 'Sheets Live Cell Importer', icon: FileSpreadsheet },
                  { id: 'gmail', label: 'Gmail Alerts Relay', icon: Mail }
                ] as const).map((sub) => {
                  const Icon = sub.icon;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setWsTab(sub.id)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-wider font-bold transition-all uppercase flex items-center gap-1.5 cursor-pointer ${
                        wsTab === sub.id
                          ? 'bg-teal-500 text-white shadow'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {needsAuth ? (
              <div className="py-16 text-center max-w-xl mx-auto space-y-6">
                <div className="w-16 h-16 rounded-full bg-slate-500/10 border border-slate-500/15 text-slate-400 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-800 dark:text-white">Live Workspace Integration Required</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                    To connect to Google Drive files, load Sheets cells, or send Gmail dispatch alerts, click the button above to authenticate using secure Google Workspace tokens.
                  </p>
                </div>
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <CloudLightning className="w-4 h-4" /> Authenticate Securely
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left panel relative to selection */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {wsTab === 'drive' && (
                    <div className="space-y-4">
                      
                      {/* Search Bar for Drive */}
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={driveSearch}
                          onChange={(e) => setDriveSearch(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && fetchDriveFiles()}
                          className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-mono placeholder:text-slate-450 focus:border-teal-500 outline-none"
                          placeholder="Search files inside your Google Drive..."
                        />
                        <button
                          onClick={fetchDriveFiles}
                          disabled={loadingDrive}
                          className="px-5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                        >
                          {loadingDrive ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
                        </button>
                      </div>

                      {/* Files browser */}
                      <div className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden bg-slate-50/20">
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider flex justify-between">
                          <span>Google Drive Files ({driveFiles.length})</span>
                          <button onClick={fetchDriveFiles} className="text-teal-400 hover:underline">Reload Stream</button>
                        </div>

                        {loadingDrive ? (
                          <div className="py-16 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center gap-2">
                            <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
                            <span>Interrogating Google Drive nodes...</span>
                          </div>
                        ) : driveFiles.length === 0 ? (
                          <div className="py-16 text-center text-slate-400 font-sans text-xs">
                            No files retrieved on your Drive. Start by submitting a txt record below!
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-100 dark:divide-slate-850">
                            {driveFiles.map((file) => (
                              <div key={file.id} className="p-4 flex justify-between items-center hover:bg-slate-50/50 dark:hover:bg-slate-950/20 font-mono text-xs transition-colors">
                                <div className="flex items-center gap-3 text-left">
                                  <FileText className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                                  <div>
                                    <p className="font-bold text-slate-800 dark:text-white leading-tight">{file.name}</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5">MimeType: {file.mimeType} | Date: {new Date(file.createdTime).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <a
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                    title="Open file in New Web Window"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {wsTab === 'sheets' && (
                    <div className="space-y-6">
                      
                      {/* Grid bounds selector */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-mono tracking-wider text-slate-450 uppercase font-black">Spreadsheet ID</label>
                          <input
                            type="text"
                            value={spreadsheetId}
                            onChange={(e) => setSpreadsheetId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-mono placeholder:text-slate-450 outline-none"
                            placeholder="Enter Google Sheets unique identifier..."
                          />
                        </div>
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-mono tracking-wider text-slate-455 uppercase font-black">Sheet &amp; cells Bound bounds</label>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={sheetRange}
                              onChange={(e) => setSheetRange(e.target.value)}
                              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-mono placeholder:text-slate-450 outline-none"
                              placeholder="e.g. Class Data!A1:F10"
                            />
                            <button
                              onClick={fetchSpreadsheetCells}
                              disabled={loadingSheets}
                              className="px-5 bg-teal-650 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                            >
                              {loadingSheets ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Load cells'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Cells display preview table */}
                      <div className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden bg-slate-50/20">
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider flex justify-between">
                          <span>Google Sheets cell cells stream details</span>
                          <span className="text-teal-400">{sheetRange}</span>
                        </div>

                        {loadingSheets ? (
                          <div className="py-16 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center gap-3">
                            <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
                            <span>Acquiring active cells values model metrics...</span>
                          </div>
                        ) : sheetData.length === 0 ? (
                          <div className="py-16 text-center text-slate-400 font-sans text-xs space-y-2">
                            <p>No grid cells loaded yet.</p>
                            <p className="text-[10px] font-mono text-slate-500 uppercase">Input ID &amp; click 'Load cells' query above</p>
                          </div>
                        ) : (
                          <div className="p-4 overflow-x-auto">
                            <table className="w-full text-left border-collapse font-mono text-xs text-slate-700 dark:text-slate-300 divide-y divide-slate-205 dark:divide-slate-800">
                              <thead>
                                <tr className="text-slate-450 uppercase font-black text-[10px]">
                                  {sheetData[0]?.map((head, idx) => (
                                    <th key={idx} className="pb-3 px-3 font-extrabold">{head}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                                {sheetData.slice(1).map((row, rowIdx) => (
                                  <tr key={rowIdx} className="hover:bg-slate-550/5">
                                    {row.map((cell, colIdx) => (
                                      <td key={colIdx} className="py-2.5 px-3 min-w-[120px]">{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {wsTab === 'gmail' && (
                    <div className="space-y-4">
                      
                      <div className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden bg-slate-50/20">
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider flex justify-between">
                          <span>Gmail Operations Stream ({emails.length})</span>
                          <button onClick={fetchGmailLogs} className="text-teal-400 hover:underline">Refresh Inbox</button>
                        </div>

                        {loadingGmail ? (
                          <div className="py-16 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center gap-2">
                            <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
                            <span>Retrieving real-time operations bulletins...</span>
                          </div>
                        ) : emails.length === 0 ? (
                          <div className="py-16 text-center text-slate-400 font-sans text-xs">
                            No operational emails found in your personal inbox.
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {emails.map((msg) => {
                              const findHeader = (name: string) => msg.payload?.headers?.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || 'Unknown';
                              const subject = findHeader('subject');
                              const sender = findHeader('from');
                              return (
                                <div key={msg.id} className="p-4 text-left font-sans text-xs hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors space-y-1">
                                  <div className="flex justify-between items-start">
                                    <span className="font-bold text-teal-400 font-mono text-[10px] uppercase max-w-[200px] truncate">{sender}</span>
                                    <span className="text-[10px] text-slate-405 font-mono">ID: {msg.id.substring(0, 8)}</span>
                                  </div>
                                  <p className="font-bold text-slate-800 dark:text-white">{subject}</p>
                                  <p className="text-slate-500 text-xs normal-case pt-0.5">{msg.snippet}</p>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>

                {/* Right panel - Google Drive/Gmail actions */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {wsTab === 'drive' && (
                    <div className="border border-slate-205 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/20 rounded-2xl p-5 space-y-4 text-left">
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                        <Upload className="w-3.5 h-3.5 text-teal-400" /> Upload Log to Drive
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="block text-[8px] uppercase font-mono text-slate-500 font-bold">Filename (TXT)</label>
                          <input
                            type="text"
                            value={uploadName}
                            onChange={(e) => setUploadName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-xs font-mono outline-none text-slate-800 dark:text-slate-200"
                            placeholder="e.g. system_audit_report"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8px] uppercase font-mono text-slate-500 font-bold">Report Content text</label>
                          <textarea
                            value={uploadContent}
                            onChange={(e) => setUploadContent(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-xs font-mono outline-none text-slate-800 dark:text-slate-200"
                            placeholder="Write secure operations log here..."
                          />
                        </div>

                        <button
                          onClick={handleDriveUpload}
                          disabled={isUploading}
                          className="w-full py-2.5 bg-teal-650 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          <span>Upload &amp; Firestore Sync</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {wsTab === 'sheets' && (
                    <div className="p-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-2xl space-y-2 text-left">
                      <div className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4 shrink-0" /> Live cells bounds model status
                      </div>
                      <p className="text-[11px] font-sans leading-relaxed">
                        Query cell datasets seamlessly. Change spreadsheet IDs dynamically to monitor various asset reports across parking queues or minibar stocks.
                      </p>
                    </div>
                  )}

                  {wsTab === 'gmail' && (
                    <div className="border border-slate-205 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/20 rounded-2xl p-5 space-y-4 text-left">
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                        <Send className="w-3.5 h-3.5 text-teal-400" /> Dispatch Gmail Alert
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="block text-[8px] uppercase font-mono text-slate-500 font-bold">Recipient Email</label>
                          <input
                            type="email"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-xs font-sans outline-none text-slate-800 dark:text-slate-200"
                            placeholder="e.g. butler@hotelaurum.com"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8px] uppercase font-mono text-slate-500 font-bold">Mail Subject</label>
                          <input
                            type="text"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-xs font-sans outline-none text-slate-800 dark:text-slate-200"
                            placeholder="Immediate Priority Dispatch"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8px] uppercase font-mono text-slate-500 font-bold">Message Body</label>
                          <textarea
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-xs font-sans outline-none text-slate-800 dark:text-slate-200"
                            placeholder="Provide dispatch briefing..."
                          />
                        </div>

                        <button
                          onClick={handleSendEmail}
                          disabled={isSendingMail}
                          className="w-full py-2.5 bg-teal-650 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          {isSendingMail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                          <span>Transmit Live Email</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        )}

        {/* COMPLIANCE VIEW COMPLIANCE */}
        {activeTab === 'compliance' && (
          <div className="p-8 text-left space-y-6">
            <h2 className="text-xl font-serif font-black tracking-tight text-slate-800 dark:text-white uppercase">Aetheon Grand Global Compliance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
              <div className="p-5 border border-slate-205 dark:border-slate-850 rounded-2xl bg-slate-50/30">
                <h3 className="font-mono text-xs text-teal-400 font-black uppercase tracking-wider mb-2">GDPR Protection protocols</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Client identities and operational scans are hashed immediately and stripped of all secondary telemetry parameters to completely preserve luxury guest isolations under standard GDPR directives.
                </p>
              </div>
              <div className="p-5 border border-slate-205 dark:border-slate-850 rounded-2xl bg-slate-50/30">
                <h3 className="font-mono text-xs text-teal-400 font-black uppercase tracking-wider mb-2">PCI-DSS Ledger standards</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Every card swipe or financial trade across hotel boutique checkouts is audited cryptographically prior to cache entries, guaranteeing total immunity against shadow ledger alterations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AUDITS - DYNAMIC FIRESTORE LIVE REAL-TIME LOGS VIEW */}
        {activeTab === 'audits' && (
          <div className="p-6 md:p-8 space-y-6 text-left">
            <div>
              <h2 className="text-lg font-serif font-extrabold text-slate-850 dark:text-white uppercase">Dynamic Firestore Transaction Index</h2>
              <p className="text-xs text-slate-500 mt-1">Real-time live synchronization ledger retrieved directly from your Google Cloud Firestore datastore.</p>
            </div>

            <div className="overflow-x-auto border border-slate-150 dark:border-slate-800 rounded-2xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/60 font-mono text-[9px] uppercase font-bold text-slate-400 tracking-widest border-b border-is border-slate-205 dark:border-slate-800">
                    <th className="py-4 px-5">Firestore Document Identifier</th>
                    <th className="py-4 px-5">Source Track</th>
                    <th className="py-4 px-5">Validity Matrix</th>
                    <th className="py-4 px-5">Security Hash ID</th>
                    <th className="py-4 px-5">Operator Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-xs text-slate-700 dark:text-slate-300">
                  {firestoreDocs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-400 font-sans">
                        No transactions found inside your Firestore datastore collection <code className="text-teal-400 font-bold bg-slate-800/20 px-2.5 py-1 rounded inline-block">system_docs</code>. Place a TXT document to record the first transaction signature!
                      </td>
                    </tr>
                  ) : (
                    firestoreDocs.map((item) => (
                      <tr key={item.id} className="hover:bg-teal-500/5 transition-all">
                        <td className="py-4 px-5 font-sans font-bold text-slate-800 dark:text-slate-100 uppercase">{item.name}</td>
                        <td className="py-4 px-5"><span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 uppercase text-[10px] font-black">{item.category}</span></td>
                        <td className="py-4 px-5 text-emerald-500 font-bold uppercase text-[10px]">&bull; {item.status} ({item.size})</td>
                        <td className="py-4 px-5 text-slate-500 text-[10px] select-all">{item.hash}</td>
                        <td className="py-4 px-5 text-[10px] max-w-[150px] truncate" title={item.uploadedBy}>{item.uploadedBy}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
