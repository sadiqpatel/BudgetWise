import { Outlet, NavLink } from 'react-router-dom';
import { Home, PieChart, List, Settings, Wallet } from 'lucide-react';
import MonthYearSelector from './MonthYearSelector';
import { cn } from '../utils';

export default function Layout() {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/categories', icon: Wallet, label: 'Categories' },
    { to: '/history', icon: List, label: 'History' },
    { to: '/reports', icon: PieChart, label: 'Reports' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-background dark:bg-background-dark">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-surface dark:bg-surface-dark">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary dark:text-primary-dark flex items-center gap-2">
            <Wallet /> Tracker
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-surface dark:bg-surface-dark flex items-center justify-between px-4 md:px-8">
          <h1 className="text-lg font-semibold md:hidden">Budget Tracker</h1>
          <div className="hidden md:block"></div> {/* Spacer for desktop */}
          <MonthYearSelector />
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="flex justify-around p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center p-2 rounded-lg min-w-[64px]",
                  isActive
                    ? "text-primary"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                )
              }
            >
              <item.icon size={24} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
