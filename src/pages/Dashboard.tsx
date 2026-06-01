import { useBudgetData } from '../hooks/useBudgetData';
import { useBudgetStore } from '../store/useBudgetStore';
import { formatCurrency } from '../utils';
import CategoryCard from '../components/CategoryCard';
import TransactionForm from '../components/TransactionForm';
import { format } from 'date-fns';

export default function Dashboard() {
  const { totalBudget, totalSpent, remaining, savingsPercentage, categories } = useBudgetData();
  const { settings, selectedMonth } = useBudgetStore();

  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const startDay = settings.cycleStartDate || 1;
  
  let cycleText = '';
  if (startDay === 1) {
    cycleText = format(new Date(year, month - 1, 1), 'MMMM yyyy');
  } else {
    const cycleStart = new Date(year, month - 1, startDay);
    const cycleEnd = new Date(year, month, startDay);
    cycleText = `${format(cycleStart, 'MMM d')} to ${format(cycleEnd, 'MMM d, yyyy')}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400">Budget Cycle: {cycleText}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-primary text-white border-transparent">
          <p className="text-primary-100 text-sm font-medium mb-1 text-white/80">Total Budget</p>
          <p className="text-2xl md:text-3xl font-bold">{formatCurrency(totalBudget, settings.currency)}</p>
        </div>
        <div className="card">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Spent</p>
          <p className="text-2xl md:text-3xl font-bold">{formatCurrency(totalSpent, settings.currency)}</p>
        </div>
        <div className="card">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Remaining</p>
          <p className={`text-2xl md:text-3xl font-bold ${remaining < 0 ? 'text-danger' : 'text-success'}`}>
            {formatCurrency(remaining, settings.currency)}
          </p>
        </div>
        <div className="card">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Savings</p>
          <p className="text-2xl md:text-3xl font-bold">{savingsPercentage.toFixed(0)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Categories</h3>
          </div>
          {categories.length === 0 ? (
            <div className="card text-center text-slate-500 py-8">
              No categories found. Go to Settings or Categories to add one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Add Section */}
        <div>
          <div className="card sticky top-6">
            <h3 className="text-lg font-bold mb-4">Quick Add Expense</h3>
            <TransactionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
