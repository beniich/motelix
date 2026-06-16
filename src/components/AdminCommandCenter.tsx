import React, { useState, useEffect } from 'react';
import {
  Database,
  Sliders,
  ShieldCheck,
  UserCheck,
  UploadCloud,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  Activity,
  Check,
  CircleAlert,
  SlidersHorizontal,
  ChevronRight,
  UserPlus
} from 'lucide-react';

interface AdminCommandCenterProps {
  theme: 'light' | 'dark';
  onAddLog: (log: {
    id: string;
    time: string;
    module: string;
    message: string;
    type: 'OK' | 'WARN' | 'ERROR' | 'INFO';
  }) => void;
}

interface ProductMaster {
  id: string;
  name: string;
  category: string;
  idealWeight: number; // in grams
  price: number; // in Euros
  hash: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  floor: string;
  certification: string;
  avatar: string;
}

export default function AdminCommandCenter({ theme, onAddLog }: AdminCommandCenterProps) {
  // Master Inventory Catalog State loaded from localStorage with secure fallback
  const [catalog, setCatalog] = useState<ProductMaster[]>(() => {
    try {
      const saved = localStorage.getItem('aetheon_master_catalog');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading Master Catalog from localStorage', e);
    }
    return [
      { id: 'PROD-001', name: 'Château Pétrus 1982', category: 'Grand Cru Red', idealWeight: 1250, price: 12500, hash: '0x7F83...B4C2' },
      { id: 'PROD-002', name: 'Domaine de la Romanée-Conti 1999', category: 'Grand Cru Red', idealWeight: 1180, price: 18450, hash: '0xA1B2...E9D5' },
      { id: 'PROD-003', name: 'Dom Pérignon Plénitude 2', category: 'Champagne Prestige', idealWeight: 1450, price: 1200, hash: '0xC6F9...F8A1' },
      { id: 'PROD-004', name: 'Krug Clos d\'Ambonnay', category: 'Champagne Prestige', idealWeight: 1420, price: 3400, hash: '0xE2C4...A9B0' },
      { id: 'PROD-005', name: 'Veuve Clicquot La Grande Dame', category: 'Champagne Prestige', idealWeight: 1390, price: 390, hash: '0xD4E1...A7C5' }
    ];
  });

  // Track save feedback animation timers per item field
  const [saveStatus, setSaveStatus] = useState<Record<string, boolean>>({});

  // Save changes to localStorage on any catalog updates
  useEffect(() => {
    try {
      localStorage.setItem('aetheon_master_catalog', JSON.stringify(catalog));
    } catch (e) {
      console.error('Error saving Master Catalog to localStorage', e);
    }
  }, [catalog]);

  const triggerSaveFeedback = (itemId: string, field: string) => {
    const key = `${itemId}-${field}`;
    
    // Explicitly write immediately to localStorage to secure the data synchronization
    try {
      localStorage.setItem('aetheon_master_catalog', JSON.stringify(catalog));
    } catch (e) {
      console.error('Explicit save failed', e);
    }
    
    setSaveStatus(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [key]: false }));
    }, 1800);
  };

  // Bulk Upload state
  const [csvPreview, setCsvPreview] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  
  // Custom Product Forms
  const [newItem, setNewItem] = useState<Omit<ProductMaster, 'id' | 'hash'>>({
    name: '',
    category: 'Grand Cru Red',
    idealWeight: 1000,
    price: 150
  });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Calibration Console state
  const [selectedSuite, setSelectedSuite] = useState<string>('Suite 1208 (Royal)');
  const [selectedShelf, setSelectedShelf] = useState<string>('Main Bar Rack A1');
  const [calibrating, setCalibrating] = useState<boolean>(false);
  const [calibrationStep, setCalibrationStep] = useState<'idle' | 'capturing' | 'storing' | 'finished'>('idle');
  const [capturedWeight, setCapturedWeight] = useState<number>(0);
  const [targetProduct, setTargetProduct] = useState<string>('PROD-001');

  // Staff Members State
  const [staffList, setStaffList] = useState<StaffMember[]>([
    { id: 'STF-01', name: 'Maria Koslov', role: 'Chief Sommelier & Cellar Master', floor: 'Floor 12', certification: 'Elite Star Guild V', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { id: 'STF-02', name: 'James Westbrook', role: 'Lead Butler Command', floor: 'Floor 14', certification: 'Supreme Butler Guild II', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
    { id: 'STF-03', name: 'Laurent Dupont', role: 'Operations Butler Supervisor', floor: 'Floor 15 & Penthouses', certification: 'Luxury Hospitality Master', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' }
  ]);

  const [newStaff, setNewStaff] = useState<Omit<StaffMember, 'id' | 'avatar'>>({
    name: '',
    role: 'VIP Butler Delegate',
    floor: 'Floor 12',
    certification: 'Level IV Guild Cert'
  });
  const [showStaffForm, setShowStaffForm] = useState<boolean>(false);

  // Immutable Auditable Logs
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; time: string; operator: string; action: string; resource: string; hash: string }>>([
    { id: 'AUD-005', time: '10:45:12', operator: 'M. Laurent', action: 'Inline Update Price', resource: 'Château Pétrus 1982', hash: 'SHA-256: 08f36a' },
    { id: 'AUD-004', time: '10:43:01', operator: 'M. Laurent', action: 'Tared Sensor B-4', resource: 'Suite 1208 Rack', hash: 'SHA-256: d8d9e2' },
    { id: 'AUD-003', time: '09:12:30', operator: 'System Diagnostic', action: 'Auto-scanned drift index', resource: 'Lobby Sensor Web', hash: 'SHA-256: f1c2f9' },
    { id: 'AUD-002', time: '08:30:15', operator: 'Admin Console', action: 'Registered Onboard Butler', resource: 'James Westbrook', hash: 'SHA-256: 4a9b0c' },
    { id: 'AUD-001', time: '08:00:00', operator: 'Lead Supervisor', action: 'Initiated System Boot', resource: 'Aetheon Core Vault', hash: 'SHA-256: d4e1a7' }
  ]);

  const logAction = (action: string, resource: string) => {
    const time = new Date().toLocaleTimeString();
    const newAud: any = {
      id: `AUD-00${auditLogs.length + 1}`,
      time,
      operator: 'M. Laurent',
      action,
      resource,
      hash: `SHA-256: ${Math.random().toString(16).substr(2, 6)}`
    };
    setAuditLogs(prev => [newAud, ...prev]);
    onAddLog({
      id: `audit-${Date.now()}`,
      time,
      module: 'ADMIN-CORE',
      message: `${action} completed on object "${resource}" by console super-admin.`,
      type: 'OK'
    });
  };

  // Handlers
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    const added: ProductMaster = {
      id: `PROD-00${catalog.length + 1}`,
      name: newItem.name,
      category: newItem.category,
      idealWeight: newItem.idealWeight,
      price: newItem.price,
      hash: `0x${Math.random().toString(16).substr(2, 4).toUpperCase()}...${Math.random().toString(16).substr(6, 4).toUpperCase()}`
    };

    setCatalog(prev => [...prev, added]);
    logAction('Master Item Registered', added.name);
    setNewItem({ name: '', category: 'Grand Cru Red', idealWeight: 1100, price: 250 });
    setShowAddForm(false);
  };

  const handleUpdateItem = (id: string, field: keyof ProductMaster, value: any) => {
    setCatalog(prev => prev.map(item => {
      if (item.id === id) {
        logAction(`Property Update (${String(field)})`, `${item.name} -> ${value}`);
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Voulez-vous supprimer l'élément "${name}" de l'inventaire principal ?`)) {
      setCatalog(prev => prev.filter(item => item.id !== id));
      logAction('Master Item Revoked', name);
    }
  };

  // Calibration flow simulated
  const runCalibration = () => {
    if (calibrating) return;
    setCalibrating(true);
    setCalibrationStep('capturing');
    
    // Step 1: Tare & Measure Real weight
    setTimeout(() => {
      const selectedProdObj = catalog.find(p => p.id === targetProduct);
      const targetWeight = selectedProdObj ? selectedProdObj.idealWeight : 1200;
      // Introduce slight simulation variance: e.g. -5 to +5g from ideal
      const actualWeightMeasure = targetWeight + Math.floor(Math.random() * 9) - 4;
      setCapturedWeight(actualWeightMeasure);
      setCalibrationStep('storing');
      
      // Step 2: Write calibration registers to microgrid
      setTimeout(() => {
        setCalibrationStep('finished');
        setCalibrating(false);
        logAction('IoT Tared Calibration Set', `${selectedSuite} - ${selectedShelf}`);
      }, 1500);

    }, 2000);
  };

  const saveCalibrationToMaster = () => {
    if (capturedWeight <= 0) return;
    // update in catalog
    setCatalog(prev => prev.map(item => {
      if (item.id === targetProduct) {
        return { ...item, idealWeight: capturedWeight };
      }
      return item;
    }));
    logAction('Tared Weight Overridden as Catalog Ideal', `Product ID: ${targetProduct} set to ${capturedWeight}g`);
    setCalibrationStep('idle');
    alert(`Calibration Réussie ! Le poids de référence a été synchronisé à ${capturedWeight}g pour ce produit.`);
  };

  // Staff allocation
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name.trim()) return;

    const added: StaffMember = {
      id: `STF-0${staffList.length + 1}`,
      name: newStaff.name,
      role: newStaff.role,
      floor: newStaff.floor,
      certification: newStaff.certification,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150`
    };

    setStaffList(prev => [...prev, added]);
    logAction('Staff Operational Onboarded', added.name);
    setNewStaff({ name: '', role: 'VIP Butler Delegate', floor: 'Floor 12', certification: 'Level IV Guild Cert' });
    setShowStaffForm(false);
  };

  const handleUpdateStaffFloor = (id: string, floor: string, name: string) => {
    setStaffList(prev => prev.map(stf => {
      if (stf.id === id) {
        logAction('Changed Staff Roster Allocation', `${name} -> ${floor}`);
        return { ...stf, floor };
      }
      return stf;
    }));
  };

  // Emulated CSV Drag & Drop import
  const processDemoCSVImport = () => {
    onAddLog({
      id: `csv-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'BILLING',
      message: 'Initial validation on imported CSV array: Parsing 5 rows of premium spirits.',
      type: 'INFO'
    });
    
    // Add 3 luxury items
    const newItems: ProductMaster[] = [
      { id: 'PROD-010', name: 'Macallan Sherry Oak 25Y', category: 'Whisky Vintage', idealWeight: 1150, price: 2900, hash: '0xFC29...A149' },
      { id: 'PROD-011', name: 'Louis XIII Cognac Réserve', category: 'Champagne Prestige', idealWeight: 1850, price: 4200, hash: '0x992B...EE33' },
      { id: 'PROD-012', name: 'Screaming Eagle Cabernet 2015', category: 'Grand Cru Red', idealWeight: 1220, price: 6800, hash: '0x1092...389B' }
    ];

    setCatalog(prev => [...prev, ...newItems]);
    logAction('Bulk CSV Catalogue Synced', 'Imported 3 elements from file batch');
    setCsvPreview(false);
    alert('Importation validée avec succès ! 3 nouveaux spiritueux ont été téléversés.');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ENTERPRISE MASTER INTRO HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-6 border-slate-200/50 dark:border-slate-800">
        <div className="text-left">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-550 animate-ping" />
            <span>Aetheon Command & Logistics Vault</span>
          </div>
          <h2 className="text-3xl font-serif text-slate-900 dark:text-white leading-tight">
            Admin <span className="italic font-light">Command Center</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mt-1 leading-relaxed">
            Centre de Configuration Premium. Suivez, saisissez, calibrez et auditez l'intégralité du catalogue master, du parc minibar IoT et du déploiement du personnel d'élite.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left min-w-[120px]">
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Master Active catalog</p>
            <p className="text-lg font-serif font-bold text-slate-850 dark:text-indigo-400">{catalog.length} Products</p>
          </div>
          <div className="rounded-2xl p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left min-w-[120px]">
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Calibration drift index</p>
            <p className="text-lg font-serif font-bold text-emerald-500 font-mono">0.03% Stable</p>
          </div>
        </div>
      </div>

      {/* THREE INTERACTIVE PILLARS COLUMN / TABS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-left">
        
        {/* PILLAR 1: CMS OF CONFIGURATION & MASTER CATALOGUE */}
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 shadow-xl overflow-hidden">
            
            {/* Header with control tools */}
            <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-500" />
                  <span>Aetheon Master Catalog (Inline & Audited)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Définissez les poids, prix de référence et identifiants blockchain uniques.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setCsvPreview(true)}
                  className="px-3 py-1.5 border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 rounded-xl text-xs font-mono font-bold uppercase transition-all tracking-wider cursor-pointer flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Bulk Import
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-mono font-bold uppercase transition-all tracking-wider cursor-pointer flex items-center gap-1 shadow-lg shadow-indigo-600/15"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter
                </button>
              </div>
            </div>

            {/* Form to manual add standard items */}
            {showAddForm && (
              <form onSubmit={handleAddNewItem} className="p-6 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-205 dark:border-slate-800/80 space-y-4 animate-fadeIn">
                <p className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest">Nouveau Produit Master</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block">Nom de l'Asset</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Champagne Krug Vintage"
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block">Catégorie</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <option value="Grand Cru Red">Grand Cru Red</option>
                      <option value="Champagne Prestige">Champagne Prestige</option>
                      <option value="Whisky Vintage">Whisky Vintage</option>
                      <option value="Luxury Cognac">Luxury Cognac</option>
                      <option value="Soft Premium">Soft Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block">Prix (€ TTC)</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={newItem.price}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block">Poids Idéal (Grammes)</label>
                    <input
                      type="number"
                      min={50}
                      required
                      value={newItem.idealWeight}
                      onChange={(e) => setNewItem(prev => ({ ...prev, idealWeight: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-mono text-center"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Sauvegarder au Registre
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* CSV File Import View */}
            {csvPreview && (
              <div className="p-6 bg-indigo-900/10 border-b border-indigo-500/20 text-left space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center sm:border-b sm:border-slate-200/50 dark:sm:border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4" /> Importateur CSV d'inventaire
                  </span>
                  <button
                    onClick={() => setCsvPreview(false)}
                    className="text-slate-400 hover:text-slate-900 dark:text-white text-xs font-bold leading-none cursor-pointer"
                  >
                    &times; Fermer
                  </button>
                </div>

                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); processDemoCSVImport(); }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                    dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                  onClick={processDemoCSVImport}
                >
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Glissez-déposez votre fichier d'inventaire CSV ici</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Ou cliquez pour simuler le chargement d'un fichier <strong className="text-indigo-400 font-mono">"AET_INVENTORY.csv"</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Master Catalog Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/50 dark:border-slate-800 font-mono text-[10px] text-slate-405 uppercase tracking-widest bg-slate-950/40">
                    <th className="py-4 px-6">Product Ref / Category</th>
                    <th className="py-4 px-6 text-center">Ideal weight</th>
                    <th className="py-4 px-6 text-right">Standard price</th>
                    <th className="py-4 px-6">Immutable Hash</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60 font-sans text-xs">
                  {catalog.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                      
                      {/* Name / Category */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-850 dark:text-slate-100 relative flex items-center gap-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                            onBlur={() => triggerSaveFeedback(item.id, 'name')}
                            onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); } }}
                            className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none w-full font-serif font-semibold text-sm transition-colors pr-6"
                          />
                          {saveStatus[`${item.id}-name`] && (
                            <span className="absolute right-1 text-emerald-500 flex items-center justify-center animate-scaleIn" title="Enregistré!">
                              <Check className="w-4 h-4 text-emerald-500 filter drop-shadow font-extrabold" />
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-indigo-400 uppercase mt-0.5 tracking-wider font-semibold">
                          {item.category} • {item.id}
                        </div>
                      </td>

                      {/* Ideal weight */}
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-1 justify-center bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-lg relative">
                          <input
                            type="number"
                            min={20}
                            value={item.idealWeight}
                            onChange={(e) => handleUpdateItem(item.id, 'idealWeight', parseInt(e.target.value) || 0)}
                            onBlur={() => triggerSaveFeedback(item.id, 'idealWeight')}
                            onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); } }}
                            className="bg-transparent outline-none w-14 text-center font-mono font-bold text-slate-800 dark:text-emerald-400 text-xs"
                          />
                          <span className="text-[9px] text-slate-400 font-mono">g</span>
                          {saveStatus[`${item.id}-idealWeight`] && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center animate-scaleIn border border-white dark:border-slate-900 shadow">
                              <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3.5px]" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Standard price */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-0.5 bg-indigo-50/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-lg relative">
                          <span className="text-indigo-400 font-mono text-xs">€</span>
                          <input
                            type="number"
                            min={0}
                            value={item.price}
                            onChange={(e) => handleUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                            onBlur={() => triggerSaveFeedback(item.id, 'price')}
                            onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); } }}
                            className="bg-transparent outline-none w-20 text-right font-mono font-bold text-slate-755 dark:text-indigo-350 text-xs"
                          />
                          {saveStatus[`${item.id}-price`] && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center animate-scaleIn border border-white dark:border-slate-900 shadow">
                              <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3.5px]" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Cryptographic hash */}
                      <td className="py-4 px-6">
                        <span className="font-mono text-[10px] text-slate-400 select-all tracking-wider px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850">
                          {item.hash}
                        </span>
                      </td>

                      {/* Revoke button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-2 border border-rose-200/40 hover:border-rose-500 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-xl transition-all cursor-pointer"
                          title="Revoke Item Master Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom info banner */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-850 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>LEDGER STANDARD: AUTH_TLS_BLOCK</span>
              <span className="text-indigo-400 font-bold uppercase">SHA-256 COMPLIANT VAULT</span>
            </div>

          </div>
        </div>

        {/* PILLAR 2: SENSORY MAINTENANCE & IOT CALIBRATION (Tare & Zero) */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 shadow-xl space-y-6">
            
            <div className="border-b dark:border-slate-805 pb-4">
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-500" />
                <span>IoT Sensory Calibration (Taring)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Échauffement, calibrage et tarage en direct des capteurs volumétriques du mini-bar.
              </p>
            </div>

            {/* Config Forms */}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase mb-1.5 block">
                  Select Target Suite location
                </label>
                <select
                  value={selectedSuite}
                  onChange={(e) => setSelectedSuite(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-serif font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="Suite 1208 (Royal)">Suite 1208 (Royal)</option>
                  <option value="Suite 1209 (Imperial)">Suite 1209 (Imperial)</option>
                  <option value="Suite 1301 (Crown)">Suite 1301 (Crown)</option>
                  <option value="Penthouse 1500 (Aurora)">Penthouse 1500 (Aurora)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase mb-1.5 block">
                  Target Product Standard definition
                </label>
                <select
                  value={targetProduct}
                  onChange={(e) => setTargetProduct(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-850 dark:text-slate-200 cursor-pointer"
                >
                  {catalog.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Ref ideal: {p.idealWeight}g)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block">Shelf slot</label>
                  <input
                    type="text"
                    value={selectedShelf}
                    onChange={(e) => setSelectedShelf(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-400"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={runCalibration}
                    disabled={calibrating}
                    className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                      calibrating 
                        ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                        : 'bg-indigo-600 hover:bg-indigo-550 text-white shadow shadow-indigo-500/10'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${calibrating ? 'animate-spin' : ''}`} />
                    <span>{calibrating ? 'TARNING...' : 'CALIBRER'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CALIBRATION WORKSPACE PULSE STATE */}
            <div className={`p-6 rounded-2xl border text-center transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[170px] ${
              calibrationStep === 'capturing' || calibrationStep === 'storing'
                ? 'bg-amber-500/5 border-amber-500/30 animate-pulse'
                : calibrationStep === 'finished'
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200/60 dark:border-slate-850'
            }`}>
              
              {calibrationStep === 'idle' && (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-800 flex items-center justify-center mx-auto text-slate-405">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 font-serif">A attendre sur le capteur ...</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Placez le spiritueux sur le capteur de la {selectedSuite} et lancez la calibration.
                  </p>
                </div>
              )}

              {calibrationStep === 'capturing' && (
                <div className="space-y-2 animate-bounce">
                  <span className="inline-flex h-3 w-3 rounded-full bg-amber-400 animate-ping absolute top-4 right-4" />
                  <p className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest">CAPTURING SENSE VAL...</p>
                  <p className="text-[10px] text-slate-400">Lecture thermodynamique de l'assiette du capteur en cours.</p>
                </div>
              )}

              {calibrationStep === 'storing' && (
                <div className="space-y-2">
                  <p className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest">Syncing system database...</p>
                  <p className="text-[10px] text-slate-400">Indexation de la variance de masse drift offset.</p>
                </div>
              )}

              {calibrationStep === 'finished' && (
                <div className="space-y-3 p-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                    <Check className="w-5 h-5 animate-scaleIn" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-white uppercase font-mono tracking-wider">
                      CAPTEUR TARE : {capturedWeight}g
                    </p>
                    <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                      Poids mesuré stable. Souhaitez-vous propager ce poids comme nouvelle valeur standard de référence ?
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={saveCalibrationToMaster}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Établir comme Poids Idéal
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalibrationStep('idle')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Refaire
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

      {/* LOWER SECTION: STAFF ONBOARDING / SECURITY LOGS & IMMUTABLE LEDGER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        
        {/* PILLAR 1B: STAFF COMMAND & ONBOARDING CATALOG */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b dark:border-slate-805 pb-4">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-orange-400" />
                <span>Onboarding & Staff Deployment Center</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gérer les profils du personnel d'élite et attribuer les tâches par étage.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setShowStaffForm(!showStaffForm)}
              className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/25 border border-orange-500/20 text-orange-400 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 inline mr-1" /> {showStaffForm ? 'Masquer' : 'Nouveau Staff'}
            </button>
          </div>

          {/* New Staff Form */}
          {showStaffForm && (
            <form onSubmit={handleAddStaff} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-850 rounded-2xl space-y-3 animate-fadeIn">
              <p className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest">Recruter Collaborateur Élite</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase mb-1 block">Nom Complet</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Alexandre Vaudois"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase mb-1 block">Rôle Assigné</label>
                  <input
                    type="text"
                    required
                    value={newStaff.role}
                    onChange={(e) => setNewStaff(p => ({ ...p, role: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase mb-1 block">Étage affecté</label>
                  <select
                    value={newStaff.floor}
                    onChange={(e) => setNewStaff(p => ({ ...p, floor: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="Floor 12">Floor 12 (Suites Royales)</option>
                    <option value="Floor 14">Floor 14 (Ambassadeurs)</option>
                    <option value="Floor 15 & Penthouses">Floor 15 & Penthouse</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase mb-1 block">Certification Elite Academy</label>
                  <input
                    type="text"
                    required
                    value={newStaff.certification}
                    onChange={(e) => setNewStaff(p => ({ ...p, certification: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest hover:from-orange-550 cursor-pointer transition-all"
              >
                Inscrire à l'Elite Academy & Affecter
              </button>
            </form>
          )}

          {/* Staff Registry Deck */}
          <div className="space-y-3">
            {staffList.map((stf) => (
              <div 
                key={stf.id} 
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-800 transition-all select-none"
              >
                <img
                  src={stf.avatar}
                  alt={stf.name}
                  className="w-10 h-10 rounded-full border border-slate-250 dark:border-slate-800/80 object-cover shrink-0"
                  onError={(e) => {
                    // Fallback to pravatar if unsplash gives rate limit
                    (e.currentTarget as HTMLImageElement).src = `https://i.pravatar.cc/100?img=${stf.id.charAt(stf.id.length - 1)}`;
                  }}
                />

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-serif font-bold text-slate-850 dark:text-slate-100">{stf.name}</p>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 uppercase font-bold tracking-wider">
                      {stf.id}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">{stf.role}</p>
                  <p className="text-[10px] font-mono font-bold text-indigo-400 uppercase">{stf.certification}</p>
                </div>

                <div className="shrink-0">
                  <label className="text-[8px] font-mono font-bold text-slate-400 uppercase block mb-1">Floor Deployment</label>
                  <select
                    value={stf.floor}
                    onChange={(e) => handleUpdateStaffFloor(stf.id, e.target.value, stf.name)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <option value="Floor 12">Floor 12 (Suites Row)</option>
                    <option value="Floor 14">Floor 14 (Ambassadeurs)</option>
                    <option value="Floor 15 & Penthouses">Floor 15 & Penthouse</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* PILLAR 3: IMMUTABLE AUDIT TRAIL / BLOCKCHAIN PROOF PRO LOG */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b dark:border-slate-805 pb-4">
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Immutable Transaction Ledger & Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chaque changement de produit, étanchéité de capteur ou rôle est scellé avec un hachage SHA-256 unique.
              </p>
            </div>

            {/* Micro logs display */}
            <div className="space-y-2 h-[270px] overflow-y-auto custom-scrollbar pr-1 select-all">
              {auditLogs.map((aud) => (
                <div key={aud.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-850/60 font-mono text-[10px] text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1 border-b border-dashed border-slate-200 dark:border-slate-900 pb-1">
                    <span className="font-bold text-indigo-400">{aud.id} • {aud.time}</span>
                    <span className="text-slate-450 uppercase">{aud.operator}</span>
                  </div>

                  <p className="text-slate-800 dark:text-slate-300 font-bold uppercase py-0.5">
                    {aud.action} &rarr; <span className="text-slate-650 dark:text-indigo-350">{aud.resource}</span>
                  </p>

                  <div className="flex items-center gap-1.5 text-[8px] text-emerald-450 dark:text-emerald-400 uppercase mt-1 leading-none">
                    <Check className="w-2.5 h-2.5 stroke-[3px]" />
                    <span>Blockchain Signature Sec:</span>
                    <span className="font-bold select-all">{aud.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-850 text-center">
            <button
              onClick={() => {
                setAuditLogs(prev => [
                  {
                    id: `AUD-00${prev.length + 1}`,
                    time: new Date().toLocaleTimeString(),
                    operator: 'M. Laurent',
                    action: 'Forced Blockchain Seal Verify',
                    resource: 'Audit Log Stack Vault',
                    hash: 'SHA-256: 12af90bc'
                  },
                  ...prev
                ]);
                alert('Tous les blocs d\'historique ont été vérifiés et validés avec succès sur le registre.');
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer"
            >
              Vérifier l'intégralité du Registre
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
