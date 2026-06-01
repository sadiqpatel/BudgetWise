export interface Category {
  id: string;
  name: string;
  budget: number;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  date: string; // ISO string YYYY-MM-DD
  notes: string;
  name: string;
}

export interface Settings {
  currency: string;
  darkMode: boolean;
  carryForward: boolean;
  cycleStartDate?: number;
}

export interface BudgetStore {
  // Data
  categories: Category[];
  transactions: Transaction[];
  settings: Settings;
  selectedMonth: string; // YYYY-MM format

  // Actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;

  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  updateSettings: (settings: Partial<Settings>) => void;
  setSelectedMonth: (month: string) => void;

  importData: (data: { categories: Category[], transactions: Transaction[], settings: Settings }) => void;
  resetCategories: () => void;
}
