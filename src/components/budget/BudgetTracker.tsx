import React, { useState } from 'react';
import {
  DollarSign,
  PlusCircle,
  PieChart,
  Search,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon } from '../common/WoodlandIcons';
import { ExpenseItem, ExpenseCategory, EventItem } from '../../types';
import { useCurrency } from '../../hooks/useCurrency';

interface BudgetTrackerProps {
  expenses: ExpenseItem[];
  events: EventItem[];
  activeEvent: EventItem | undefined;
  onSaveExpense: (expense: Omit<ExpenseItem, 'id' | 'createdAt'> & { id?: string }) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateEventBudget: (eventId: string, newBudget: number) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Venue',
  'Catering',
  'Floral & Decor',
  'Photography',
  'Music & Sound',
  'Stationery & Favors',
  'Attire & Beauty',
  'Logistics & Other',
];

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  expenses,
  events,
  activeEvent,
  onSaveExpense,
  onDeleteExpense,
  onUpdateEventBudget,
}) => {
  const { formatMoney, activeCurrency } = useCurrency();
  const [filterEventId, setFilterEventId] = useState<string>(activeEvent?.id || 'all');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Floral & Decor');
  const [amount, setAmount] = useState<number | ''>(250);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState('Bhumika Devnath');
  const [expenseEventId, setExpenseEventId] = useState(activeEvent?.id || events[0]?.id || '');
  const [formError, setFormError] = useState('');

  // Budget Edit state
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [customBudgetInput, setCustomBudgetInput] = useState(activeEvent?.budget || 5000);

  const openAddModal = () => {
    setEditingExpense(null);
    setDescription('');
    setCategory('Floral & Decor');
    setAmount(250);
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setPaidBy('Bhumika Devnath');
    setExpenseEventId(activeEvent?.id || events[0]?.id || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (exp: ExpenseItem) => {
    setEditingExpense(exp);
    setDescription(exp.description);
    setCategory(exp.category);
    setAmount(exp.amount);
    setExpenseDate(exp.expenseDate);
    setPaidBy(exp.paidBy || '');
    setExpenseEventId(exp.eventId);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setFormError('Description is required.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setFormError('Amount must be greater than zero.');
      return;
    }
    if (!expenseEventId) {
      setFormError('Please select an event for this expense.');
      return;
    }

    onSaveExpense({
      id: editingExpense ? editingExpense.id : undefined,
      eventId: expenseEventId,
      category,
      description: description.trim(),
      amount: Number(amount),
      expenseDate,
      paidBy: paidBy.trim(),
    });
    setIsModalOpen(false);
  };

  // Filter calculations
  const activeEventExpenses = filterEventId === 'all'
    ? expenses
    : expenses.filter((e) => e.eventId === filterEventId);

  const totalSpent = activeEventExpenses.reduce((sum, e) => sum + e.amount, 0);

  const targetBudget = filterEventId === 'all'
    ? events.reduce((sum, e) => sum + e.budget, 0)
    : (events.find((e) => e.id === filterEventId)?.budget || 0);

  const remainingBudget = Math.max(0, targetBudget - totalSpent);
  const percentSpent = targetBudget > 0 ? Math.min(100, Math.round((totalSpent / targetBudget) * 100)) : 0;

  // Category breakdown calculation
  const categoryTotals: Record<string, number> = {};
  CATEGORIES.forEach((c) => {
    categoryTotals[c] = activeEventExpenses
      .filter((e) => e.category === c)
      .reduce((sum, item) => sum + item.amount, 0);
  });

  const displayedExpenses = activeEventExpenses.filter((e) => {
    const matchesCategory = filterCategory === 'All' || e.category === filterCategory;
    const matchesSearch =
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.paidBy && e.paidBy.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A]">
              Treasury & Ledgers
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
            Budget & Expense Tracker
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2.5 rounded-xl border border-[#A6A98A] text-xs flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Main Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Totals & Absorption (7 cols) */}
        <div className="lg:col-span-7 parchment-card rounded-3xl p-6 sm:p-7 relative shadow-md">
          <div className="absolute top-4 left-4"><ScrewRivet /></div>
          <div className="absolute top-4 right-4"><ScrewRivet /></div>

          {/* Gathering filter bar */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <span className="text-xs font-bold text-[#63463C] dark:text-[#D7C5C0]">Financials For:</span>
            <select
              value={filterEventId}
              onChange={(e) => {
                setFilterEventId(e.target.value);
                const ev = events.find((ev) => ev.id === e.target.value);
                if (ev) setCustomBudgetInput(ev.budget);
              }}
              className="text-xs p-2 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5] font-medium"
            >
              <option value="all">All Gatherings (Consolidated)</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Planned Budget */}
            <div className="p-4 bg-[#F4E8D9]/70 dark:bg-[#29272A]/70 rounded-2xl border border-[#D6BDA5]/50 dark:border-[#5A5055]/50">
              <span className="text-[11px] font-bold text-[#63463C] dark:text-[#D7C5C0] uppercase tracking-wider block mb-1">
                Planned Budget
              </span>
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] tabular-nums font-mono">
                  {formatMoney(targetBudget)}
                </span>
                {filterEventId !== 'all' && (
                  <button
                    onClick={() => setIsEditingBudget(!isEditingBudget)}
                    className="text-[11px] text-[#777B59] dark:text-[#A6A98A] hover:underline font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Total Invoiced */}
            <div className="p-4 bg-[#FFF8EF] dark:bg-[#393438] rounded-2xl border border-[#D6BDA5] dark:border-[#5A5055]">
              <span className="text-[11px] font-bold text-[#63463C] dark:text-[#D7C5C0] uppercase tracking-wider block mb-1">
                Total Invoiced
              </span>
              <span className="font-serif text-2xl font-bold text-[#B58D99] tabular-nums font-mono">
                {formatMoney(totalSpent)}
              </span>
            </div>

            {/* Remaining */}
            <div className="p-4 bg-[#FFF8EF] dark:bg-[#393438] rounded-2xl border border-[#D6BDA5] dark:border-[#5A5055]">
              <span className="text-[11px] font-bold text-[#63463C] dark:text-[#D7C5C0] uppercase tracking-wider block mb-1">
                Remaining
              </span>
              <span className="font-serif text-2xl font-bold text-[#777B59] dark:text-[#A6A98A] tabular-nums font-mono">
                {formatMoney(remainingBudget)}
              </span>
            </div>
          </div>

          {/* Inline Edit Budget */}
          {isEditingBudget && filterEventId !== 'all' && (
            <div className="mb-6 p-3.5 bg-[#F4E8D9] dark:bg-[#29272A] rounded-xl border border-[#D6BDA5] dark:border-[#5A5055] flex items-center gap-3 text-xs">
              <label className="font-bold text-[#63463C] dark:text-[#D7C5C0] whitespace-nowrap">
                Target Budget (USD base):
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={customBudgetInput}
                onChange={(e) => setCustomBudgetInput(Number(e.target.value))}
                className="p-1.5 rounded-lg bg-[#FFF8EF] dark:bg-[#393438] border border-[#D6BDA5] dark:border-[#5A5055] font-mono text-xs w-32 text-[#392D29] dark:text-[#F5EDE5]"
              />
              <button
                onClick={() => {
                  onUpdateEventBudget(filterEventId, customBudgetInput);
                  setIsEditingBudget(false);
                }}
                className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingBudget(false)}
                className="text-[#63463C] dark:text-[#D7C5C0] hover:underline text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1.5">
              <span>Budget Utilization ({activeCurrency.code})</span>
              <span className="font-mono">{percentSpent}% absorbed</span>
            </div>
            <div className="w-full h-3 bg-[#D6BDA5]/40 dark:bg-[#29272A] rounded-full overflow-hidden p-0.5 border border-[#D6BDA5] dark:border-[#5A5055]">
              <div
                className={`h-full rounded-full transition-all ${
                  percentSpent > 90 ? 'bg-[#B58D99]' : 'bg-[#777B59] dark:bg-[#A6A98A]'
                }`}
                style={{ width: `${percentSpent}%` }}
              />
            </div>
            <p className="text-[11px] text-[#392D29]/70 dark:text-[#B7A9A6] mt-2">
              {percentSpent > 90
                ? 'Approaching maximum allocation. Review non-essential decor items.'
                : 'Spending remains within healthy woodland parameters.'}
            </p>
          </div>
        </div>

        {/* Right: Category Distribution (5 cols) */}
        <div className="lg:col-span-5 parchment-card rounded-3xl p-6 relative shadow-md">
          <div className="absolute top-4 left-4"><ScrewRivet /></div>
          <div className="absolute top-4 right-4"><ScrewRivet /></div>

          <h3 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
            <span>Category Breakdown</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            {CATEGORIES.map((cat) => {
              const catAmount = categoryTotals[cat] || 0;
              const catPercent = totalSpent > 0 ? Math.round((catAmount / totalSpent) * 100) : 0;

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#392D29] dark:text-[#F5EDE5]">{cat}</span>
                    <span className="font-mono font-bold text-[#63463C] dark:text-[#D7C5C0]">
                      {formatMoney(catAmount)}{' '}
                      <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A]">({catPercent}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#D6BDA5]/30 dark:bg-[#29272A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#777B59] dark:bg-[#A6A98A] rounded-full"
                      style={{ width: `${catPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expenses Ledger Table */}
      <div className="parchment-card rounded-3xl p-6 relative shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
            <h3 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
              Invoice & Expense Ledger
            </h3>
            <span className="text-xs text-[#777B59] dark:text-[#A6A98A] font-mono">({displayedExpenses.length} entries)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs p-1.5 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5]"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#777B59] dark:text-[#A6A98A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ledger..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#F4E8D9]/70 dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-1 focus:ring-[#777B59]"
              />
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#D6BDA5] dark:border-[#5A5055]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#63463C] dark:bg-[#393438] text-[#FFF8EF] font-serif text-xs font-semibold border-b border-[#4A322A] dark:border-[#5A5055]">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Disbursed By</th>
                <th className="py-2.5 px-3 text-right">Amount ({activeCurrency.code})</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6BDA5]/40 dark:divide-[#5A5055]/40 bg-[#FFF8EF] dark:bg-[#393438]">
              {displayedExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#F4E8D9]/60 dark:hover:bg-[#454047] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#63463C] dark:text-[#D7C5C0] whitespace-nowrap">
                    {exp.expenseDate}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#392D29] dark:text-[#F5EDE5]">
                    {exp.description}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="text-[10px] font-bold bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] px-2 py-0.5 rounded-md text-[#777B59] dark:text-[#A6A98A]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#392D29]/70 dark:text-[#D7C5C0]/80 whitespace-nowrap">
                    {exp.paidBy || '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-sm text-[#63463C] dark:text-[#F5EDE5] whitespace-nowrap">
                    {formatMoney(exp.amount)}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEditModal(exp)}
                        className="p-1 rounded text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] cursor-pointer"
                        title="Edit expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete expense "${exp.description}"?`)) {
                            onDeleteExpense(exp.id);
                          }
                        }}
                        className="p-1 rounded text-[#B58D99] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] cursor-pointer"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {displayedExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#392D29]/60 dark:text-[#B7A9A6]">
                    <p className="font-serif text-base font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">No recorded disbursements</p>
                    <p className="text-xs">Click "Record Expense" to log your first payment.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29272A]/70 backdrop-blur-xs font-sans">
          <div className="parchment-card rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055]">
            <div className="absolute top-4 left-4"><ScrewRivet /></div>
            <div className="absolute top-4 right-4"><ScrewRivet /></div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-10 p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-4">
              {editingExpense ? 'Edit Expense' : 'Record New Expense'}
            </h2>

            {formError && (
              <div className="mb-4 p-2.5 rounded-xl bg-[#B58D99]/20 border border-[#B58D99] text-xs text-[#63463C] dark:text-[#F5EDE5]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">
                  Description <span className="text-[#B58D99]">*</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Wildflower bouquets and birch archway"
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Gathering</label>
                <select
                  value={expenseEventId}
                  onChange={(e) => setExpenseEventId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">
                    Amount (USD base) <span className="text-[#B58D99]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-[#777B59] dark:text-[#A6A98A]">
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs font-mono text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Disbursed By</label>
                  <input
                    type="text"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    placeholder="e.g. Lead Stylist or Client"
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
                >
                  {editingExpense ? 'Save Expense' : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
