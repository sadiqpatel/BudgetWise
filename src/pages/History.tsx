import { useState } from 'react';
import { useBudgetData } from '../hooks/useBudgetData';
import { useBudgetStore } from '../store/useBudgetStore';
import { formatCurrency, formatDate } from '../utils';
import { Trash2 } from 'lucide-react';

export default function History() {
  const { transactions, categories } = useBudgetData();
  const { deleteTransaction, settings } = useBudgetStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  const filtered = transactions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? t.categoryId === filterCategory : true;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortOrder === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortOrder === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortOrder === 'amount-desc') return b.amount - a.amount;
    if (sortOrder === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Expense History</h2>

      <div className="card flex flex-col md:flex-row gap-4">
        <input 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search expenses..." 
          className="input flex-1" 
        />
        <select 
          value={filterCategory} 
          onChange={e => setFilterCategory(e.target.value)}
          className="input md:w-48 cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select 
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as any)}
          className="input md:w-48 cursor-pointer"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <th className="p-4 font-medium text-sm text-slate-500">Date</th>
              <th className="p-4 font-medium text-sm text-slate-500">Name</th>
              <th className="p-4 font-medium text-sm text-slate-500">Category</th>
              <th className="p-4 font-medium text-sm text-slate-500">Notes</th>
              <th className="p-4 font-medium text-sm text-slate-500 text-right">Amount</th>
              <th className="p-4 font-medium text-sm text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => {
              const category = categories.find(c => c.id === t.categoryId);
              return (
                <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 text-sm">{formatDate(t.date)}</td>
                  <td className="p-4 font-medium">{t.name}</td>
                  <td className="p-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {category?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">{t.notes}</td>
                  <td className="p-4 font-medium text-right">{formatCurrency(t.amount, settings.currency)}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="text-slate-400 hover:text-danger transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No expenses found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
