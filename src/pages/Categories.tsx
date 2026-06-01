import { useState } from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { formatCurrency } from '../utils';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory, settings } = useBudgetStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !budget) return;

    if (isEditing) {
      updateCategory(isEditing, { name, budget: parseFloat(budget) });
      setIsEditing(null);
    } else {
      addCategory({ name, budget: parseFloat(budget) });
    }
    setName('');
    setBudget('');
  };

  const handleEdit = (category: any) => {
    setIsEditing(category.id);
    setName(category.name);
    setBudget(category.budget.toString());
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setName('');
    setBudget('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Manage Categories</h2>

      <div className="card">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="input" 
              placeholder="e.g. Travel" 
              required 
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-1">Monthly Budget</label>
            <input 
              type="number" 
              step="0.01" 
              value={budget} 
              onChange={e => setBudget(e.target.value)} 
              className="input" 
              placeholder="0.00" 
              required 
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button type="submit" className="btn-primary flex-1 md:flex-none">
              {isEditing ? 'Update' : <><Plus size={20} className="mr-2" /> Add</>}
            </button>
            {isEditing && (
              <button type="button" onClick={cancelEdit} className="btn-secondary">Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {categories.map(category => (
          <div key={category.id} className="card flex items-center justify-between py-4">
            <div>
              <h4 className="font-semibold">{category.name}</h4>
              <p className="text-sm text-slate-500">
                {formatCurrency(category.budget, settings.currency)}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(category)} className="p-2 text-slate-500 hover:text-primary transition-colors">
                <Edit2 size={18} />
              </button>
              <button onClick={() => deleteCategory(category.id)} className="p-2 text-slate-500 hover:text-danger transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center text-slate-500 py-8">No categories found.</div>
        )}
      </div>
    </div>
  );
}
