import { Category } from '../types';
import { useBudgetData } from '../hooks/useBudgetData';
import { useBudgetStore } from '../store/useBudgetStore';
import { formatCurrency, cn } from '../utils';

export default function CategoryCard({ category }: { category: Category }) {
  const { getCategoryStats } = useBudgetData();
  const { settings } = useBudgetStore();
  const stats = getCategoryStats(category.id);
  
  const getProgressColor = (percentage: number) => {
    if (percentage <= 75) return 'bg-success';
    if (percentage <= 90) return 'bg-warning';
    if (percentage <= 100) return 'bg-danger';
    return 'bg-danger-dark';
  };

  const getTextColor = (percentage: number) => {
    if (percentage > 100) return 'text-danger dark:text-danger';
    return '';
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">{category.name}</h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {formatCurrency(stats.budget, settings.currency)}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-500", getProgressColor(stats.percentage))}
            style={{ width: `${Math.min(stats.percentage, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Spent</p>
            <p className="font-medium">{formatCurrency(stats.spent, settings.currency)}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 dark:text-slate-400">Remaining</p>
            <p className={cn("font-medium", getTextColor(stats.percentage))}>
              {formatCurrency(stats.remaining, settings.currency)}
            </p>
          </div>
        </div>
        <div className="text-xs text-center text-slate-400 mt-2">
          {stats.percentage.toFixed(0)}% used
        </div>
      </div>
    </div>
  );
}
