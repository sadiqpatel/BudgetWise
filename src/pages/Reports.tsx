import { useBudgetData } from '../hooks/useBudgetData';
import { useBudgetStore } from '../store/useBudgetStore';
import { formatCurrency } from '../utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function Reports() {
  const { transactions, categories, totalBudget, totalSpent, remaining } = useBudgetData();
  const { settings, transactions: allTransactions } = useBudgetStore();

  // Prepare Pie Chart Data
  const pieData = categories.map(c => {
    const spent = transactions
      .filter(t => t.categoryId === c.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: c.name, value: spent };
  }).filter(d => d.value > 0);

  // Prepare Bar Chart Data (Last 6 Months)
  const barData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toISOString().slice(0, 7); // YYYY-MM
    
    const spent = allTransactions
      .filter(t => t.date.startsWith(monthStr))
      .reduce((sum, t) => sum + t.amount, 0);
      
    barData.push({
      name: date.toLocaleString('default', { month: 'short' }),
      spent
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-sm text-slate-500 mb-1">Total Budget</p>
          <p className="text-2xl font-bold">{formatCurrency(totalBudget, settings.currency)}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-slate-500 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-warning">{formatCurrency(totalSpent, settings.currency)}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-slate-500 mb-1">Remaining</p>
          <p className="text-2xl font-bold text-success">{formatCurrency(remaining, settings.currency)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-4">Spending by Category</h3>
          <div className="flex-1 min-h-0">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value, settings.currency)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                No spending data for this month.
              </div>
            )}
          </div>
        </div>

        <div className="card h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-4">6-Month Trend</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  formatter={(value: number) => formatCurrency(value, settings.currency)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="spent" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
