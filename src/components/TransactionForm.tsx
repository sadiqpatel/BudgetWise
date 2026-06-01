import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBudgetStore } from '../store/useBudgetStore';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().positive('Amount must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess?: () => void;
}

export default function TransactionForm({ onSuccess }: Props) {
  const { categories, addTransaction, transactions, selectedMonth } = useBudgetStore();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = (data: FormData) => {
    // Duplicate Protection logic
    const isDuplicate = transactions.some(t => 
      t.name.toLowerCase() === data.name.toLowerCase() &&
      t.amount === data.amount &&
      t.date === data.date &&
      t.categoryId === data.categoryId
    );

    if (isDuplicate) {
      const confirmAdd = window.confirm("This looks like a duplicate expense. Are you sure you want to add it?");
      if (!confirmAdd) return;
    }

    // Budget Warning logic (mock implementation for simplicity, could use a proper toast library)
    const category = categories.find(c => c.id === data.categoryId);
    const spentThisMonth = transactions
      .filter(t => t.categoryId === data.categoryId && t.date.startsWith(selectedMonth))
      .reduce((sum, t) => sum + t.amount, 0);
      
    if (category) {
      const newSpent = spentThisMonth + data.amount;
      const percentage = (newSpent / category.budget) * 100;
      
      if (percentage > 100) {
        alert(`Warning: This expense puts you over budget for ${category.name}!`);
      } else if (percentage >= 90) {
        alert(`Warning: You are at ${percentage.toFixed(0)}% of your ${category.name} budget.`);
      }
    }

    addTransaction({
      name: data.name,
      amount: data.amount,
      categoryId: data.categoryId,
      date: data.date,
      notes: data.notes || '',
    });
    
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Expense Name</label>
        <input {...register('name')} className="input" placeholder="e.g. Walmart" />
        {errors.name && <p className="text-danger text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input 
          type="number" 
          step="0.01" 
          {...register('amount', { valueAsNumber: true })} 
          className="input" 
          placeholder="0.00" 
        />
        {errors.amount && <p className="text-danger text-sm mt-1">{errors.amount.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select {...register('categoryId')} className="input cursor-pointer">
          <option value="">Select a category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id} className="dark:bg-surface-dark">{c.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="text-danger text-sm mt-1">{errors.categoryId.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input type="date" {...register('date')} className="input" />
        {errors.date && <p className="text-danger text-sm mt-1">{errors.date.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
        <textarea {...register('notes')} className="input min-h-[80px]" placeholder="Optional notes..."></textarea>
      </div>

      <button type="submit" className="btn-primary w-full">Add Expense</button>
    </form>
  );
}
