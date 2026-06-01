import { useBudgetStore } from '../store/useBudgetStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, parse } from 'date-fns';

export default function MonthYearSelector() {
  const { selectedMonth, setSelectedMonth } = useBudgetStore();

  const handlePrevMonth = () => {
    const date = parse(selectedMonth, 'yyyy-MM', new Date());
    setSelectedMonth(format(subMonths(date, 1), 'yyyy-MM'));
  };

  const handleNextMonth = () => {
    const date = parse(selectedMonth, 'yyyy-MM', new Date());
    setSelectedMonth(format(addMonths(date, 1), 'yyyy-MM'));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, _] = selectedMonth.split('-');
    setSelectedMonth(`${year}-${e.target.value}`);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [_, month] = selectedMonth.split('-');
    setSelectedMonth(`${e.target.value}-${month}`);
  };

  const currentYear = selectedMonth.split('-')[0];
  const currentMonth = selectedMonth.split('-')[1];

  const years = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - 2 + i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <div className="flex items-center space-x-2 bg-surface dark:bg-surface-dark px-4 py-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
      <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
        <ChevronLeft size={20} />
      </button>
      
      <select 
        value={currentMonth} 
        onChange={handleMonthChange}
        className="bg-transparent font-medium focus:outline-none dark:text-slate-100 cursor-pointer"
      >
        {months.map((m, i) => (
          <option key={m} value={m} className="dark:bg-surface-dark">
            {format(new Date(2000, i, 1), 'MMMM')}
          </option>
        ))}
      </select>

      <select 
        value={currentYear} 
        onChange={handleYearChange}
        className="bg-transparent font-medium focus:outline-none dark:text-slate-100 cursor-pointer"
      >
        {years.map(y => (
          <option key={y} value={y} className="dark:bg-surface-dark">{y}</option>
        ))}
      </select>

      <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
