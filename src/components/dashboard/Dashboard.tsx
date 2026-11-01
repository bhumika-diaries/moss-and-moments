import React from 'react';
import {
  Calendar,
  Sparkles,
  CheckSquare,
  DollarSign,
  Users,
  Clock,
  ArrowRight,
  PlusCircle,
  MapPin,
  TrendingUp,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon, LeafIcon, AcornIcon } from '../common/WoodlandIcons';
import { EventItem, TaskItem, ExpenseItem, GuestItem } from '../../types';
import { useCurrency } from '../../hooks/useCurrency';

interface DashboardProps {
  events: EventItem[];
  activeEvent: EventItem | undefined;
  tasks: TaskItem[];
  expenses: ExpenseItem[];
  guests: GuestItem[];
  onSelectEvent: (eventId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenCreateEvent: () => void;
  onToggleTask: (taskId: string) => void;
  onOpenAddTask: () => void;
  onOpenAddExpense: () => void;
  onOpenAddGuest: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  events,
  activeEvent,
  tasks,
  expenses,
  guests,
  onSelectEvent,
  onNavigateTab,
  onOpenCreateEvent,
  onToggleTask,
  onOpenAddTask,
  onOpenAddExpense,
}) => {
  const { formatMoney } = useCurrency();

  // Aggregate Metrics
  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => e.status !== 'Completed' && e.status !== 'Archived').length;

  // Active event-specific metrics
  const activeEventTasks = activeEvent ? tasks.filter((t) => t.eventId === activeEvent.id) : tasks;
  const completedTasks = activeEventTasks.filter((t) => t.status === 'Completed').length;
  const totalEventTasks = activeEventTasks.length;
  const taskCompletionRate = totalEventTasks > 0 ? Math.round((completedTasks / totalEventTasks) * 100) : 0;

  const activeEventExpenses = activeEvent ? expenses.filter((e) => e.eventId === activeEvent.id) : expenses;
  const totalSpent = activeEventExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = activeEvent ? activeEvent.budget : events.reduce((sum, e) => sum + e.budget, 0);
  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const budgetPercentSpent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  const activeEventGuests = activeEvent ? guests.filter((g) => g.eventId === activeEvent.id) : guests;
  const acceptedGuests = activeEventGuests.filter((g) => g.rsvpStatus === 'Accepted').length;
  const pendingGuests = activeEventGuests.filter((g) => g.rsvpStatus === 'Pending').length;
  const declinedGuests = activeEventGuests.filter((g) => g.rsvpStatus === 'Declined').length;
  const totalGuests = activeEventGuests.length;

  // Days until event helper
  const getDaysUntil = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + 'T00:00:00');
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777B59] dark:text-[#A6A98A]">
              Overview & Active Workspace
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
            Organizer Dashboard
          </h1>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('events')}
            className="bg-[#FFF8EF] dark:bg-[#393438] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] text-[#63463C] dark:text-[#F5EDE5] font-bold px-3.5 py-2 rounded-xl border border-[#D6BDA5] dark:border-[#5A5055] text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
            <span>Interactive Calendar</span>
          </button>
          <button
            onClick={() => onNavigateTab('planner')}
            className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2 rounded-xl border border-[#A6A98A] text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4E8D9]" />
            <span>AI Event Planner</span>
          </button>
          <button
            onClick={onOpenCreateEvent}
            className="bg-[#63463C] dark:bg-[#454047] hover:bg-[#4A322A] dark:hover:bg-[#5A5055] text-[#FFF8EF] font-bold px-4 py-2 rounded-xl border border-[#4A322A] dark:border-[#5A5055] text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Gathering</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Events */}
        <div className="parchment-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-3 right-3"><ScrewRivet /></div>
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#63463C]/10 dark:bg-[#F5EDE5]/10 flex items-center justify-center text-[#63463C] dark:text-[#D7C5C0]">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] uppercase tracking-wider">
                Events
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5] tabular-nums">
                {totalEvents}
              </span>
              <span className="text-xs text-[#777B59] dark:text-[#A6A98A] font-semibold">
                ({upcomingEvents} upcoming)
              </span>
            </div>
            <p className="text-xs text-[#392D29]/70 dark:text-[#B7A9A6]">
              Active gatherings in planning
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('events')}
            className="mt-4 pt-2 border-t border-[#D6BDA5]/40 dark:border-[#5A5055]/40 text-xs font-bold text-[#777B59] dark:text-[#A6A98A] hover:text-[#63463C] dark:hover:text-[#F5EDE5] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View all celebrations</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 2: Budget Progress */}
        <div className="parchment-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-3 right-3"><ScrewRivet /></div>
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#777B59]/15 dark:bg-[#777B59]/25 flex items-center justify-center text-[#777B59] dark:text-[#A6A98A]">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] uppercase tracking-wider">
                Budget
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] tabular-nums font-mono">
                {formatMoney(totalSpent)}
              </span>
              <span className="text-xs text-[#392D29]/70 dark:text-[#B7A9A6] font-mono">
                of {formatMoney(totalBudget)}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-[#D6BDA5]/40 dark:bg-[#29272A] rounded-full overflow-hidden mb-1.5">
              <div
                className={`h-full rounded-full transition-all ${
                  budgetPercentSpent > 90 ? 'bg-[#B58D99]' : 'bg-[#777B59] dark:bg-[#A6A98A]'
                }`}
                style={{ width: `${budgetPercentSpent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#63463C] dark:text-[#D7C5C0]">
              <span>{formatMoney(remainingBudget)} left</span>
              <span className="font-mono text-[11px] font-semibold">{budgetPercentSpent}% spent</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('budget')}
            className="mt-4 pt-2 border-t border-[#D6BDA5]/40 dark:border-[#5A5055]/40 text-xs font-bold text-[#777B59] dark:text-[#A6A98A] hover:text-[#63463C] dark:hover:text-[#F5EDE5] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Open budget ledger</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 3: Checklist Progress */}
        <div className="parchment-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-3 right-3"><ScrewRivet /></div>
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#A6A98A]/25 dark:bg-[#A6A98A]/20 flex items-center justify-center text-[#63463C] dark:text-[#D7C5C0]">
                <CheckSquare className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] uppercase tracking-wider">
                Checklist
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5] tabular-nums font-mono">
                {taskCompletionRate}%
              </span>
              <span className="text-xs text-[#777B59] dark:text-[#A6A98A] font-semibold font-mono">
                {completedTasks}/{totalEventTasks} done
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-[#D6BDA5]/40 dark:bg-[#29272A] rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-[#777B59] dark:bg-[#A6A98A] rounded-full transition-all"
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>
            <p className="text-xs text-[#392D29]/70 dark:text-[#B7A9A6]">
              {totalEventTasks - completedTasks} milestones pending
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="mt-4 pt-2 border-t border-[#D6BDA5]/40 dark:border-[#5A5055]/40 text-xs font-bold text-[#777B59] dark:text-[#A6A98A] hover:text-[#63463C] dark:hover:text-[#F5EDE5] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View task checklist</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 4: Guests & RSVP */}
        <div className="parchment-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-3 right-3"><ScrewRivet /></div>
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#B58D99]/20 flex items-center justify-center text-[#B58D99]">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] uppercase tracking-wider">
                Guests & RSVP
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5] tabular-nums font-mono">
                {totalGuests}
              </span>
              <span className="text-xs text-[#392D29]/70 dark:text-[#B7A9A6]">invited</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-[#777B59] dark:text-[#A6A98A] font-bold">{acceptedGuests} Attending</span>
              <span className="text-[#D6BDA5] dark:text-[#5A5055]">·</span>
              <span className="text-[#63463C] dark:text-[#D7C5C0]">{pendingGuests} Pending</span>
              <span className="text-[#D6BDA5] dark:text-[#5A5055]">·</span>
              <span className="text-[#B58D99]">{declinedGuests} No</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('guests')}
            className="mt-4 pt-2 border-t border-[#D6BDA5]/40 dark:border-[#5A5055]/40 text-xs font-bold text-[#777B59] dark:text-[#A6A98A] hover:text-[#63463C] dark:hover:text-[#F5EDE5] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Manage guest list</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Active Event Spotlight Banner */}
      {activeEvent ? (
        <div className="parchment-card rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border-2 border-[#D6BDA5] dark:border-[#5A5055]">
          <div className="absolute top-4 left-4"><ScrewRivet /></div>
          <div className="absolute top-4 right-4"><ScrewRivet /></div>
          <div className="absolute bottom-4 left-4"><ScrewRivet /></div>
          <div className="absolute bottom-4 right-4"><ScrewRivet /></div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#777B59] text-[#FFF8EF] text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">
                  Active Gathering Workspace
                </span>
                <span className="text-xs font-medium text-[#777B59] dark:text-[#A6A98A]">
                  {activeEvent.eventType}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2 leading-tight break-words">
                {activeEvent.name}
              </h2>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#392D29]/80 dark:text-[#D7C5C0]">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                  {activeEvent.eventDate || 'Date to be announced'}
                </span>
                {activeEvent.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                    <span>{activeEvent.location}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 font-mono">
                  <Users className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                  <span>{activeEvent.guestCount} estimated guests</span>
                </span>
                <span className="flex items-center gap-1 font-mono font-bold text-[#63463C] dark:text-[#F5EDE5]">
                  <DollarSign className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                  <span>{formatMoney(activeEvent.budget)} budget</span>
                </span>
              </div>
            </div>

            {/* Countdown Badge */}
            {activeEvent.eventDate && (
              <div className="bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] rounded-2xl px-5 py-3 text-center shrink-0 shadow-inner">
                {(() => {
                  const days = getDaysUntil(activeEvent.eventDate);
                  if (days === null) return null;
                  if (days < 0) {
                    return (
                      <div>
                        <span className="font-serif text-xl font-bold text-[#777B59] dark:text-[#A6A98A] block">Celebrated</span>
                        <span className="text-[10px] text-[#63463C] dark:text-[#D7C5C0]">Archived moment</span>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <span className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5] block tabular-nums leading-none font-mono">
                        {days}
                      </span>
                      <span className="text-xs text-[#777B59] dark:text-[#A6A98A] font-semibold block mt-1">
                        {days === 0 ? 'Today is the day!' : days === 1 ? 'day remaining' : 'days until gathering'}
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Theme & Notes snippet */}
          {(activeEvent.theme || activeEvent.notes) && (
            <div className="bg-[#F4E8D9]/70 dark:bg-[#29272A]/70 rounded-xl p-3.5 border border-[#D6BDA5]/50 dark:border-[#5A5055]/50 text-xs text-[#392D29] dark:text-[#D7C5C0] mb-6 flex items-start gap-2.5">
              <LeafIcon className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A] shrink-0 mt-0.5" />
              <div>
                {activeEvent.theme && (
                  <p className="font-bold text-[#63463C] dark:text-[#F5EDE5] mb-0.5">Theme: {activeEvent.theme}</p>
                )}
                {activeEvent.notes && <p className="text-[#392D29]/80 dark:text-[#D7C5C0]/85">{activeEvent.notes}</p>}
              </div>
            </div>
          )}

          {/* Workspace Quick-Jump Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
            <button
              onClick={() => onNavigateTab('events')}
              className="p-3 rounded-xl bg-[#FFF8EF] dark:bg-[#393438] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] border border-[#D6BDA5] dark:border-[#5A5055] text-left transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#777B59] cursor-pointer"
            >
              <div className="flex items-center justify-between text-[#777B59] dark:text-[#A6A98A] mb-1">
                <CalendarDays className="w-4 h-4 text-[#777B59]" />
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="font-serif font-bold text-xs text-[#63463C] dark:text-[#F5EDE5]">Calendar</p>
              <p className="text-[10px] text-[#392D29]/60 dark:text-[#B7A9A6]">Almanac view</p>
            </button>

            <button
              onClick={() => onNavigateTab('planner')}
              className="p-3 rounded-xl bg-[#FFF8EF] dark:bg-[#393438] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] border border-[#D6BDA5] dark:border-[#5A5055] text-left transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#777B59] cursor-pointer"
            >
              <div className="flex items-center justify-between text-[#777B59] dark:text-[#A6A98A] mb-1">
                <Sparkles className="w-4 h-4 text-[#B58D99]" />
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="font-serif font-bold text-xs text-[#63463C] dark:text-[#F5EDE5]">AI Planner</p>
              <p className="text-[10px] text-[#392D29]/60 dark:text-[#B7A9A6]">Generate plan</p>
            </button>

            <button
              onClick={() => onNavigateTab('tasks')}
              className="p-3 rounded-xl bg-[#FFF8EF] dark:bg-[#393438] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] border border-[#D6BDA5] dark:border-[#5A5055] text-left transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#777B59] cursor-pointer"
            >
              <div className="flex items-center justify-between text-[#777B59] dark:text-[#A6A98A] mb-1">
                <CheckSquare className="w-4 h-4" />
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="font-serif font-bold text-xs text-[#63463C] dark:text-[#F5EDE5]">Checklist</p>
              <p className="text-[10px] text-[#392D29]/60 dark:text-[#B7A9A6]">{totalEventTasks} milestones</p>
            </button>

            <button
              onClick={() => onNavigateTab('budget')}
              className="p-3 rounded-xl bg-[#FFF8EF] dark:bg-[#393438] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] border border-[#D6BDA5] dark:border-[#5A5055] text-left transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#777B59] cursor-pointer"
            >
              <div className="flex items-center justify-between text-[#777B59] dark:text-[#A6A98A] mb-1">
                <DollarSign className="w-4 h-4 text-[#B58D99]" />
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="font-serif font-bold text-xs text-[#63463C] dark:text-[#F5EDE5]">Budget</p>
              <p className="text-[10px] text-[#392D29]/60 dark:text-[#B7A9A6] font-mono">{formatMoney(remainingBudget)} left</p>
            </button>

            <button
              onClick={() => onNavigateTab('guests')}
              className="p-3 rounded-xl bg-[#FFF8EF] dark:bg-[#393438] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] border border-[#D6BDA5] dark:border-[#5A5055] text-left transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#777B59] cursor-pointer"
            >
              <div className="flex items-center justify-between text-[#777B59] dark:text-[#A6A98A] mb-1">
                <Users className="w-4 h-4" />
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="font-serif font-bold text-xs text-[#63463C] dark:text-[#F5EDE5]">Guests</p>
              <p className="text-[10px] text-[#392D29]/60 dark:text-[#B7A9A6]">{acceptedGuests} confirmed</p>
            </button>

            <button
              onClick={() => onNavigateTab('timeline')}
              className="p-3 rounded-xl bg-[#FFF8EF] dark:bg-[#393438] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] border border-[#D6BDA5] dark:border-[#5A5055] text-left transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#777B59] cursor-pointer"
            >
              <div className="flex items-center justify-between text-[#777B59] dark:text-[#A6A98A] mb-1">
                <Clock className="w-4 h-4" />
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="font-serif font-bold text-xs text-[#63463C] dark:text-[#F5EDE5]">Timeline</p>
              <p className="text-[10px] text-[#392D29]/60 dark:text-[#B7A9A6]">Run of show</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="parchment-card rounded-3xl p-8 text-center relative border-2 border-dashed border-[#D6BDA5] dark:border-[#5A5055]">
          <MushroomIcon className="w-10 h-10 text-[#777B59] dark:text-[#A6A98A] mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">No Gathering Selected</h3>
          <p className="text-xs text-[#392D29]/70 dark:text-[#D7C5C0] max-w-md mx-auto mb-4">
            Select one of our curated celebrations or create your own gathering to begin organizing.
          </p>
          <button
            onClick={onOpenCreateEvent}
            className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
          >
            Create Your First Event
          </button>
        </div>
      )}

      {/* Two Column Layout: Recent Tasks & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Tasks preview */}
        <div className="parchment-card rounded-2xl p-6 relative">
          <div className="absolute top-3 right-3"><ScrewRivet /></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
              <h3 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
                Checklist Actions
              </h3>
            </div>
            <button
              onClick={onOpenAddTask}
              className="text-xs font-bold text-[#777B59] dark:text-[#A6A98A] hover:text-[#63463C] dark:hover:text-[#FFF8EF] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {activeEventTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                  task.status === 'Completed'
                    ? 'bg-[#F4E8D9]/40 dark:bg-[#29272A]/40 border-[#D6BDA5]/40 dark:border-[#5A5055]/40 opacity-75'
                    : 'bg-[#FFF8EF] dark:bg-[#393438] border-[#D6BDA5] dark:border-[#5A5055]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.status === 'Completed'}
                  onChange={() => onToggleTask(task.id)}
                  className="mt-1 w-4 h-4 accent-[#777B59] rounded cursor-pointer shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium text-[#392D29] dark:text-[#F5EDE5] leading-snug break-words ${
                      task.status === 'Completed' ? 'line-through text-[#392D29]/50 dark:text-[#D7C5C0]/50' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-[#63463C] dark:text-[#D7C5C0]">
                    <span className="font-mono">{task.dueDate}</span>
                    <span>·</span>
                    <span
                      className={`font-semibold ${
                        task.priority === 'High'
                          ? 'text-[#B58D99]'
                          : task.priority === 'Medium'
                          ? 'text-[#777B59] dark:text-[#A6A98A]'
                          : 'text-[#63463C]/60 dark:text-[#B7A9A6]'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <span>·</span>
                    <span>{task.category}</span>
                  </div>
                </div>
              </div>
            ))}

            {activeEventTasks.length === 0 && (
              <div className="text-center py-6 text-xs text-[#392D29]/60 dark:text-[#B7A9A6]">
                <p>No tasks yet for this gathering.</p>
                <button
                  onClick={onOpenAddTask}
                  className="mt-2 text-[#777B59] dark:text-[#A6A98A] font-bold hover:underline cursor-pointer"
                >
                  Create first task
                </button>
              </div>
            )}
          </div>

          {activeEventTasks.length > 5 && (
            <div className="pt-3 mt-3 border-t border-[#D6BDA5]/40 dark:border-[#5A5055]/40 text-center">
              <button
                onClick={() => onNavigateTab('tasks')}
                className="text-xs font-bold text-[#777B59] dark:text-[#A6A98A] hover:underline cursor-pointer"
              >
                View all {activeEventTasks.length} checklist items →
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Recent Expenses */}
        <div className="parchment-card rounded-2xl p-6 relative">
          <div className="absolute top-3 right-3"><ScrewRivet /></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#B58D99]" />
              <h3 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
                Recent Expenses
              </h3>
            </div>
            <button
              onClick={onOpenAddExpense}
              className="text-xs font-bold text-[#777B59] dark:text-[#A6A98A] hover:text-[#63463C] dark:hover:text-[#FFF8EF] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Record Expense</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {activeEventExpenses.slice(0, 5).map((exp) => (
              <div
                key={exp.id}
                className="p-3 rounded-xl bg-[#FFF8EF] dark:bg-[#393438] border border-[#D6BDA5] dark:border-[#5A5055] flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#392D29] dark:text-[#F5EDE5] truncate">{exp.description}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#63463C]/80 dark:text-[#D7C5C0]/80">
                    <span className="font-semibold text-[#777B59] dark:text-[#A6A98A]">{exp.category}</span>
                    <span>·</span>
                    <span className="font-mono">{exp.expenseDate}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-serif text-sm font-bold text-[#63463C] dark:text-[#F5EDE5] font-mono">
                    {formatMoney(exp.amount)}
                  </span>
                </div>
              </div>
            ))}

            {activeEventExpenses.length === 0 && (
              <div className="text-center py-6 text-xs text-[#392D29]/60 dark:text-[#B7A9A6]">
                <p>No recorded expenses for this gathering.</p>
                <button
                  onClick={onOpenAddExpense}
                  className="mt-2 text-[#777B59] dark:text-[#A6A98A] font-bold hover:underline cursor-pointer"
                >
                  Record first invoice
                </button>
              </div>
            )}
          </div>

          {activeEventExpenses.length > 5 && (
            <div className="pt-3 mt-3 border-t border-[#D6BDA5]/40 dark:border-[#5A5055]/40 text-center">
              <button
                onClick={() => onNavigateTab('budget')}
                className="text-xs font-bold text-[#777B59] dark:text-[#A6A98A] hover:underline cursor-pointer"
              >
                View full financial breakdown →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
