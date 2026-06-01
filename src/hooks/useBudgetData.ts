import { useBudgetStore } from '../store/useBudgetStore';

export function useBudgetData() {
  const { transactions, categories, selectedMonth } = useBudgetStore();

  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = totalBudget - totalSpent;
  const savingsPercentage = totalBudget > 0 ? Math.max(0, ((remaining / totalBudget) * 100)) : 0;

  const getCategoryStats = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return { budget: 0, spent: 0, remaining: 0, percentage: 0 };
    
    const spent = currentMonthTransactions
      .filter(t => t.categoryId === categoryId)
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      budget: category.budget,
      spent,
      remaining: category.budget - spent,
      percentage: category.budget > 0 ? (spent / category.budget) * 100 : 0
    };
  };

  return {
    transactions: currentMonthTransactions,
    categories,
    totalBudget,
    totalSpent,
    remaining,
    savingsPercentage,
    getCategoryStats
  };
}
