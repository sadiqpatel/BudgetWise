import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BudgetStore, Category } from '../types';
import { generateId, getCurrentMonthStr } from '../utils';

// Seed data
const initialCategories: Category[] = [
  { id: '1', name: 'Groceries', budget: 500 },
  { id: '2', name: 'Rent', budget: 1200 },
  { id: '3', name: 'Transportation', budget: 200 },
];

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      categories: initialCategories,
      transactions: [],
      settings: {
        currency: 'CAD',
        darkMode: false,
        carryForward: false,
        cycleStartDate: 1,
      },
      selectedMonth: getCurrentMonthStr(),

      addCategory: (category) => set((state) => ({
        categories: [...state.categories, { ...category, id: generateId() }]
      })),

      updateCategory: (id, category) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...category } : c)
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id),
        // optionally: remove transactions for this category? Or keep them as orphaned?
        // the requirements don't specify, so let's keep them (or re-assign to 'unassigned')
      })),

      addTransaction: (transaction) => set((state) => ({
        transactions: [...state.transactions, { ...transaction, id: generateId() }]
      })),

      updateTransaction: (id, transaction) => set((state) => ({
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...transaction } : t)
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      setSelectedMonth: (month) => set({ selectedMonth: month }),

      importData: (data) => set({
        categories: data.categories,
        transactions: data.transactions,
        settings: data.settings,
      })
    }),
    {
      name: 'budget-tracker-storage',
    }
  )
);
