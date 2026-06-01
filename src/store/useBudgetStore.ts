import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BudgetStore, Category } from '../types';
import { generateId, getCurrentMonthStr } from '../utils';

// Seed data
const initialCategories: Category[] = [
  { id: '1', name: 'Rent', budget: 1950 },
  { id: '2', name: 'Grocery', budget: 500 },
  { id: '3', name: 'Outside Eat', budget: 100 },
  { id: '4', name: 'Fuel', budget: 200 },
  { id: '5', name: 'Insurance (Car+Tenant)', budget: 145 },
  { id: '6', name: 'Gym', budget: 19 },
  { id: '7', name: 'Hydro', budget: 65 },
  { id: '8', name: 'Wifi', budget: 44.01 },
  { id: '9', name: 'Mobile Bill', budget: 92.53 },
  { id: '10', name: 'Card Payment', budget: 15.99 },
  { id: '11', name: 'Washer', budget: 30 },
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
      }),

      resetCategories: () => set({ categories: initialCategories })
    }),
    {
      name: 'budget-tracker-storage',
    }
  )
);
