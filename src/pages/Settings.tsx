import { useState, useRef } from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { Download, Upload, Moon, Sun, DollarSign } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings, categories, transactions, importData } = useBudgetStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState('');

  const handleExportJSON = () => {
    const data = {
      categories,
      transactions,
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.categories && data.transactions && data.settings) {
          importData(data);
          setImportStatus('Data imported successfully!');
          setTimeout(() => setImportStatus(''), 3000);
        } else {
          setImportStatus('Invalid backup file format.');
        }
      } catch (error) {
        setImportStatus('Error reading file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="card space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <DollarSign size={20} /> Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Currency</p>
                <p className="text-sm text-slate-500">Default currency for all amounts</p>
              </div>
              <select 
                value={settings.currency}
                onChange={e => updateSettings({ currency: e.target.value })}
                className="input w-32 cursor-pointer"
              >
                <option value="CAD">CAD ($)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-slate-500">Toggle dark theme</p>
              </div>
              <button 
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Monthly Carry Forward</p>
                <p className="text-sm text-slate-500">Unused budgets rollover to next month (Visual only in reports)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.carryForward}
                  onChange={e => updateSettings({ carryForward: e.target.checked })}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/80 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        <div>
          <h3 className="text-lg font-bold mb-4">Data Management</h3>
          <p className="text-sm text-slate-500 mb-4">
            Your data is stored locally in your browser. You can export it as a JSON file to create a backup or transfer it to another device.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button onClick={handleExportJSON} className="btn-secondary flex items-center gap-2">
              <Download size={18} /> Export JSON Backup
            </button>
            
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary flex items-center gap-2">
              <Upload size={18} /> Import JSON Backup
            </button>
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImportJSON}
            />
          </div>
          {importStatus && (
            <p className={`mt-2 text-sm ${importStatus.includes('successfully') ? 'text-success' : 'text-danger'}`}>
              {importStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
