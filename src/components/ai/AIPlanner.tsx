import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  Copy,
  DollarSign,
  Clock,
  Lightbulb,
  Palette,
  RefreshCw,
  PlusCircle,
  Check,
  AlertCircle,
  Flower2,
  Leaf,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon, LeafIcon } from '../common/WoodlandIcons';
import {
  EventItem,
  AIPlanOutput,
  TaskItem,
  ExpenseItem,
  TimelineSlot,
} from '../../types';
import { generateEventPlan } from '../../services/aiService';
import { useCurrency } from '../../hooks/useCurrency';

interface AIPlannerProps {
  events: EventItem[];
  activeEvent: EventItem | undefined;
  onImportTasks: (tasks: Omit<TaskItem, 'id' | 'createdAt'>[]) => void;
  onImportExpenses: (expenses: Omit<ExpenseItem, 'id' | 'createdAt'>[]) => void;
  onImportTimeline: (slots: Omit<TimelineSlot, 'id'>[]) => void;
  onUpdateEventBudget: (eventId: string, newBudget: number) => void;
}

export const AIPlanner: React.FC<AIPlannerProps> = ({
  events,
  activeEvent,
  onImportTasks,
  onImportExpenses,
  onImportTimeline,
  onUpdateEventBudget,
}) => {
  const { formatMoney, activeCurrency } = useCurrency();

  // Input fields
  const [selectedEventId, setSelectedEventId] = useState<string>(activeEvent?.id || (events[0]?.id || ''));
  const [eventName, setEventName] = useState(activeEvent?.name || 'Misty Fern & Wildflower Celebration');
  const [eventType, setEventType] = useState<string>(activeEvent?.eventType || 'Garden Tea Party');
  const [eventDate, setEventDate] = useState(activeEvent?.eventDate || '2026-12-18');
  const [location, setLocation] = useState(activeEvent?.location || 'Sunlit Orchard & Glasshouse');
  const [guestCount, setGuestCount] = useState(activeEvent?.guestCount || 35);
  const [budget, setBudget] = useState(activeEvent?.budget || 4500);
  const [theme, setTheme] = useState(activeEvent?.theme || 'Preserved Moss, Amber Beeswax Tapers & Wild Chamomile');
  const [preferences, setPreferences] = useState(
    'Artisanal farm-to-table grazing boards, gentle acoustic strings, deckle-edged parchment menus with wax seals'
  );

  // Status & Output
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<AIPlanOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePlanTab, setActivePlanTab] = useState<'concept' | 'budget' | 'checklist' | 'timeline' | 'styling'>('concept');

  // Import feedback states
  const [importedTasksSuccess, setImportedTasksSuccess] = useState(false);
  const [importedBudgetSuccess, setImportedBudgetSuccess] = useState(false);
  const [importedTimelineSuccess, setImportedTimelineSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Sync when active event changes
  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    const found = events.find((e) => e.id === eventId);
    if (found) {
      setEventName(found.name);
      setEventType(found.eventType);
      setEventDate(found.eventDate || '');
      setLocation(found.location || '');
      setGuestCount(found.guestCount || 25);
      setBudget(found.budget || 3000);
      if (found.theme) setTheme(found.theme);
      if (found.notes) setPreferences(found.notes);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setImportedTasksSuccess(false);
    setImportedBudgetSuccess(false);
    setImportedTimelineSuccess(false);

    try {
      const generated = await generateEventPlan({
        eventName,
        eventType,
        eventDate,
        location,
        guestCount: Number(guestCount),
        budget: Number(budget),
        theme,
        preferences,
      });
      setPlan(generated);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err?.message || 'Failed to generate plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Import Handlers
  const handleImportChecklist = () => {
    if (!plan || !selectedEventId) return;
    const tasksToImport: Omit<TaskItem, 'id' | 'createdAt'>[] = plan.checklist.map((c) => {
      let dueDateStr = eventDate;
      if (eventDate) {
        const evDate = new Date(eventDate + 'T00:00:00');
        evDate.setDate(evDate.getDate() - c.daysBefore);
        dueDateStr = evDate.toISOString().split('T')[0];
      }
      return {
        eventId: selectedEventId,
        title: c.title,
        dueDate: dueDateStr || 'Upcoming',
        priority: c.priority,
        status: 'Pending',
        category: c.category || 'General',
        notes: `Imported from AI Event Plan (${c.daysBefore} days before gathering)`,
      };
    });

    onImportTasks(tasksToImport);
    setImportedTasksSuccess(true);
    setTimeout(() => setImportedTasksSuccess(false), 3500);
  };

  const handleImportBudget = () => {
    if (!plan || !selectedEventId) return;
    const expensesToImport: Omit<ExpenseItem, 'id' | 'createdAt'>[] = plan.budgetBreakdown.map((b) => {
      let category = 'Logistics & Other';
      const catLower = b.category.toLowerCase();
      if (catLower.includes('venue')) category = 'Venue';
      else if (catLower.includes('cater') || catLower.includes('feast') || catLower.includes('food')) category = 'Catering';
      else if (catLower.includes('flor') || catLower.includes('decor') || catLower.includes('moss')) category = 'Floral & Decor';
      else if (catLower.includes('photo') || catLower.includes('film')) category = 'Photography';
      else if (catLower.includes('music') || catLower.includes('sound') || catLower.includes('band')) category = 'Music & Sound';
      else if (catLower.includes('favor') || catLower.includes('stationery') || catLower.includes('paper')) category = 'Stationery & Favors';

      return {
        eventId: selectedEventId,
        category: category as any,
        description: `${b.category}: ${b.reason}`,
        amount: b.amount,
        expenseDate: new Date().toISOString().split('T')[0],
      };
    });

    onImportExpenses(expensesToImport);
    onUpdateEventBudget(selectedEventId, budget);
    setImportedBudgetSuccess(true);
    setTimeout(() => setImportedBudgetSuccess(false), 3500);
  };

  const handleImportTimeline = () => {
    if (!plan || !selectedEventId) return;
    const timelineToImport: Omit<TimelineSlot, 'id'>[] = plan.timeline.map((t) => ({
      eventId: selectedEventId,
      time: t.time,
      activity: t.activity,
      notes: t.notes || '',
      responsiblePerson: 'Lead Coordinator',
      completed: false,
    }));

    onImportTimeline(timelineToImport);
    setImportedTimelineSuccess(true);
    setTimeout(() => setImportedTimelineSuccess(false), 3500);
  };

  const handleCopyPlan = () => {
    if (!plan) return;
    const text = `# ${eventName} — Event Plan
Date: ${eventDate} | Location: ${location}
Guests: ${guestCount} | Budget: ${formatMoney(budget)}
Theme: ${theme}

## Vision
${plan.summary}
${plan.themeVision}

## Suggested Budget Breakdown (${activeCurrency.code})
${plan.budgetBreakdown.map((b) => `- ${b.category}: ${formatMoney(b.amount)} (${b.reason})`).join('\n')}

## Checklist Milestones
${plan.checklist.map((c) => `- [ ] ${c.title} [${c.priority} Priority, ${c.daysBefore} days before]`).join('\n')}

## Day-of Timeline
${plan.timeline.map((t) => `- ${t.time} — ${t.activity} (${t.notes || ''})`).join('\n')}

## Creative Ideas
${plan.ideas.map((i) => `* ${i}`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* Title Header */}
      <div className="pb-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
        <div className="flex items-center gap-2 mb-1">
          <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
          <span className="text-xs uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A]">
            GenAI Event Architect
          </span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
          AI Event Planner
        </h1>
        <p className="text-xs text-[#392D29]/80 dark:text-[#D7C5C0] max-w-2xl mt-1 leading-relaxed">
          Describe the feeling, scale, and details of your celebration. Gemini analyzes your parameters to design a bespoke concept, budget breakdown, run-of-show schedule, and checklist.
        </p>
      </div>

      {/* Two Column Layout: Generator Inputs & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (5 cols on lg) */}
        <div className="lg:col-span-5">
          <div className="parchment-card rounded-3xl p-6 relative shadow-md">
            <div className="absolute top-3 left-3"><ScrewRivet /></div>
            <div className="absolute top-3 right-3"><ScrewRivet /></div>

            <h2 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B58D99]" />
              <span>Gathering Blueprint</span>
            </h2>

            {/* Event Selector / Autofill */}
            {events.length > 0 && (
              <div className="mb-4 bg-[#F4E8D9]/70 dark:bg-[#29272A]/70 p-3 rounded-xl border border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
                <label className="block text-[11px] font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">
                  Target Event Workspace
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => handleSelectEvent(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-[#FFF8EF] dark:bg-[#393438] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-1 focus:ring-[#777B59]"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#777B59] dark:text-[#A6A98A] mt-1 font-medium">
                  Generated suggestions can be directly saved into this gathering.
                </p>
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Event Name</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Autumn Equinox Botanical Feast"
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Celebration Type</label>
                  <input
                    type="text"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    placeholder="Wedding, Tea Party, Dinner..."
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Location or Setting</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mountain Glasshouse or Apple Orchard"
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Guest Estimate</label>
                  <input
                    type="number"
                    min="1"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs font-mono text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Total Budget (USD base)</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs font-mono text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                    required
                  />
                  <p className="text-[10px] text-[#777B59] dark:text-[#A6A98A] mt-1 font-mono">
                    ≈ {formatMoney(budget)} in {activeCurrency.code}
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Aesthetic & Theme</label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Woodland cottagecore, moss runners, beeswax candles"
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Preferences & Notes</label>
                <textarea
                  rows={3}
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="Artisanal grazing boards, acoustic folk strings, deckle-edge paper menus..."
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full mt-4 bg-[#777B59] hover:bg-[#686c4e] disabled:bg-[#A6A98A] text-[#FFF8EF] font-bold p-3 rounded-xl border border-[#A6A98A] shadow-md flex items-center justify-center gap-2 text-xs transition-all active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#777B59] cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#F4E8D9]" />
                    <span>Weaving Woodland Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#F4E8D9]" />
                    <span>Generate Complete Event Plan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: AI Plan Display (7 cols on lg) */}
        <div className="lg:col-span-7">
          {isGenerating && (
            <div className="parchment-card rounded-3xl p-12 text-center border-2 border-[#D6BDA5] dark:border-[#5A5055] flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-[#777B59]/20 flex items-center justify-center text-[#777B59] dark:text-[#A6A98A] mb-4 animate-pulse">
                <MushroomIcon className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">
                Designing Your Celebration
              </h3>
              <p className="text-xs text-[#392D29]/80 dark:text-[#D7C5C0] max-w-md mx-auto leading-relaxed">
                Consulting botanical floral guides, calculating cost allocations, generating run-of-show schedule, and tailoring decoration ideas...
              </p>
            </div>
          )}

          {!isGenerating && error && (
            <div className="parchment-card rounded-3xl p-8 border-2 border-[#B58D99]">
              <div className="flex items-center gap-2 text-[#B58D99] font-bold text-sm mb-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Notice</span>
              </div>
              <p className="text-xs text-[#392D29] dark:text-[#D7C5C0] mb-4">{error}</p>
              <button
                onClick={() => handleGenerate()}
                className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                Retry Generation
              </button>
            </div>
          )}

          {!isGenerating && !plan && !error && (
            <div className="parchment-card rounded-3xl p-12 text-center border-2 border-dashed border-[#D6BDA5] dark:border-[#5A5055] flex flex-col items-center justify-center min-h-[420px]">
              <Sparkles className="w-12 h-12 text-[#B58D99] mb-4" />
              <h3 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">
                Ready to Formulate Your Event
              </h3>
              <p className="text-xs text-[#392D29]/75 dark:text-[#D7C5C0]/80 max-w-md mx-auto mb-6 leading-relaxed">
                Fill in the details on the left, or customize our default woodland prompts, then click “Generate Complete Event Plan”.
              </p>
              <button
                onClick={() => handleGenerate()}
                className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F4E8D9]" />
                <span>Generate Sample Plan Now</span>
              </button>
            </div>
          )}

          {!isGenerating && plan && (
            <div className="parchment-card rounded-3xl p-6 sm:p-8 relative shadow-lg border-2 border-[#D6BDA5] dark:border-[#5A5055]">
              <div className="absolute top-4 left-4"><ScrewRivet /></div>
              <div className="absolute top-4 right-4"><ScrewRivet /></div>

              {/* Plan Header & Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#777B59] text-[#FFF8EF] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Plan Generated
                    </span>
                    <span className="text-xs font-semibold text-[#777B59] dark:text-[#A6A98A]">
                      {plan.source === 'gemini-live' ? '🌿 Live Gemini 3.8 Flash' : '🌱 Woodland Event Generator'}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] break-words">
                    {eventName}
                  </h2>
                </div>

                {/* Plan Toolbar Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPlan}
                    className="p-2 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] hover:bg-[#D6BDA5]/60 dark:hover:bg-[#454047] text-[#63463C] dark:text-[#D7C5C0] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copy full formatted plan"
                  >
                    {copiedSuccess ? <Check className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSuccess ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => handleGenerate()}
                    className="p-2 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] hover:bg-[#D6BDA5]/60 dark:hover:bg-[#454047] text-[#63463C] dark:text-[#D7C5C0] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Regenerate new plan"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                    <span>Regen</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs for Plan Subsections */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-5 border-b border-[#D6BDA5]/40 dark:border-[#5A5055]/40">
                {[
                  { id: 'concept', label: 'Vision & Concept', icon: Flower2 },
                  { id: 'budget', label: 'Budget Breakdown', icon: DollarSign, badge: plan.budgetBreakdown.length },
                  { id: 'checklist', label: 'Checklist', icon: CheckCircle, badge: plan.checklist.length },
                  { id: 'timeline', label: 'Day Timeline', icon: Clock, badge: plan.timeline.length },
                  { id: 'styling', label: 'Decor & Ideas', icon: Lightbulb, badge: plan.ideas.length },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activePlanTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePlanTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium font-sans flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#777B59] text-[#FFF8EF] font-bold shadow-xs'
                          : 'text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      {tab.badge !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isActive
                              ? 'bg-[#FFF8EF]/20 text-[#FFF8EF]'
                              : 'bg-[#D6BDA5]/50 dark:bg-[#29272A] text-[#63463C] dark:text-[#D7C5C0]'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Vision & Concept */}
              {activePlanTab === 'concept' && (
                <div className="space-y-4">
                  <div className="bg-[#FFF8EF] dark:bg-[#393438] p-4 rounded-2xl border border-[#D6BDA5] dark:border-[#5A5055]">
                    <h3 className="font-serif font-bold text-base text-[#63463C] dark:text-[#F5EDE5] mb-2 flex items-center gap-2">
                      <LeafIcon className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
                      <span>Curated Concept Summary</span>
                    </h3>
                    <p className="text-xs text-[#392D29] dark:text-[#D7C5C0] leading-relaxed whitespace-pre-line font-sans">
                      {plan.summary}
                    </p>
                  </div>

                  {plan.themeVision && (
                    <div className="bg-[#F4E8D9]/70 dark:bg-[#29272A]/70 p-4 rounded-2xl border border-[#D6BDA5] dark:border-[#5A5055]">
                      <h3 className="font-serif font-bold text-base text-[#63463C] dark:text-[#F5EDE5] mb-2 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-[#B58D99]" />
                        <span>Aesthetic & Sensory Vision</span>
                      </h3>
                      <p className="text-xs text-[#392D29] dark:text-[#D7C5C0] leading-relaxed font-sans">
                        {plan.themeVision}
                      </p>
                    </div>
                  )}

                  {/* Quick stats strip */}
                  <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                    <div className="p-3 bg-[#FFF8EF] dark:bg-[#393438] rounded-xl border border-[#D6BDA5] dark:border-[#5A5055]">
                      <span className="font-bold text-[#777B59] dark:text-[#A6A98A] block font-mono text-sm">{formatMoney(budget)}</span>
                      <span className="text-[10px] text-[#63463C] dark:text-[#D7C5C0]">Target Budget</span>
                    </div>
                    <div className="p-3 bg-[#FFF8EF] dark:bg-[#393438] rounded-xl border border-[#D6BDA5] dark:border-[#5A5055]">
                      <span className="font-bold text-[#777B59] dark:text-[#A6A98A] block font-mono text-sm">{guestCount}</span>
                      <span className="text-[10px] text-[#63463C] dark:text-[#D7C5C0]">Guests</span>
                    </div>
                    <div className="p-3 bg-[#FFF8EF] dark:bg-[#393438] rounded-xl border border-[#D6BDA5] dark:border-[#5A5055]">
                      <span className="font-bold text-[#777B59] dark:text-[#A6A98A] block font-mono text-sm">
                        {formatMoney(Math.round(budget / guestCount))}
                      </span>
                      <span className="text-[10px] text-[#63463C] dark:text-[#D7C5C0]">Per Guest</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Budget Breakdown */}
              {activePlanTab === 'budget' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-xs text-[#63463C] dark:text-[#D7C5C0]">
                      Suggested allocations for {formatMoney(budget)} ({activeCurrency.code}):
                    </p>
                    <button
                      onClick={handleImportBudget}
                      disabled={importedBudgetSuccess}
                      className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      {importedBudgetSuccess ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                      <span>{importedBudgetSuccess ? 'Applied to Budget' : 'Import into Event Budget'}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {plan.budgetBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#FFF8EF] dark:bg-[#393438] border border-[#D6BDA5] dark:border-[#5A5055] flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-[#63463C] dark:text-[#F5EDE5]">{item.category}</span>
                            <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A] font-mono">
                              ({Math.round((item.amount / budget) * 100)}%)
                            </span>
                          </div>
                          <p className="text-[11px] text-[#392D29]/80 dark:text-[#D7C5C0]/80 leading-relaxed font-sans">{item.reason}</p>
                        </div>
                        <div className="font-serif text-sm font-bold text-[#63463C] dark:text-[#F5EDE5] font-mono shrink-0">
                          {formatMoney(item.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Checklist */}
              {activePlanTab === 'checklist' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-xs text-[#63463C] dark:text-[#D7C5C0]">
                      Preparation milestones grouped by timeline:
                    </p>
                    <button
                      onClick={handleImportChecklist}
                      disabled={importedTasksSuccess}
                      className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      {importedTasksSuccess ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                      <span>{importedTasksSuccess ? 'Tasks Imported!' : 'Add to Event Checklist'}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {plan.checklist.map((task, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#FFF8EF] dark:bg-[#393438] border border-[#D6BDA5] dark:border-[#5A5055] flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-[#392D29] dark:text-[#F5EDE5] leading-snug mb-1">{task.title}</p>
                          <div className="flex items-center gap-2 text-[10px] text-[#63463C] dark:text-[#D7C5C0]">
                            <span className="font-semibold text-[#777B59] dark:text-[#A6A98A]">{task.category}</span>
                            <span>·</span>
                            <span className="font-mono">{task.daysBefore} days prior</span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                            task.priority === 'High'
                              ? 'bg-[#B58D99] text-[#FFF8EF]'
                              : task.priority === 'Medium'
                              ? 'bg-[#777B59] text-[#FFF8EF]'
                              : 'bg-[#D6BDA5] dark:bg-[#454047] text-[#392D29] dark:text-[#F5EDE5]'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Day-of Timeline */}
              {activePlanTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-xs text-[#63463C] dark:text-[#D7C5C0]">
                      Minute-by-minute run-of-show schedule:
                    </p>
                    <button
                      onClick={handleImportTimeline}
                      disabled={importedTimelineSuccess}
                      className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      {importedTimelineSuccess ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                      <span>{importedTimelineSuccess ? 'Saved to Schedule!' : 'Save to Event Timeline'}</span>
                    </button>
                  </div>

                  <div className="relative pl-6 border-l-2 border-[#D6BDA5] dark:border-[#5A5055] space-y-4 my-2">
                    {plan.timeline.map((slot, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#777B59] dark:bg-[#A6A98A] border-2 border-[#FFF8EF] dark:border-[#393438]" />
                        <div className="bg-[#FFF8EF] dark:bg-[#393438] p-3 rounded-xl border border-[#D6BDA5] dark:border-[#5A5055] text-xs">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-[#63463C] dark:text-[#F5EDE5]">{slot.activity}</span>
                            <span className="font-mono text-[11px] font-bold text-[#777B59] dark:text-[#A6A98A] bg-[#F4E8D9] dark:bg-[#29272A] px-2 py-0.5 rounded">
                              {slot.time}
                            </span>
                          </div>
                          {slot.notes && (
                            <p className="text-[11px] text-[#392D29]/75 dark:text-[#D7C5C0]/75 font-sans">{slot.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Decor & Ideas */}
              {activePlanTab === 'styling' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#63463C] dark:text-[#F5EDE5] mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#B58D99]" />
                      <span>Woodland Experience & Guest Touches</span>
                    </h3>
                    <div className="space-y-2">
                      {plan.ideas.map((idea, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#FFF8EF] dark:bg-[#393438] rounded-xl border border-[#D6BDA5] dark:border-[#5A5055] flex items-start gap-2.5"
                        >
                          <span className="text-[#777B59] dark:text-[#A6A98A] font-bold mt-0.5">•</span>
                          <p className="text-[#392D29] dark:text-[#D7C5C0] leading-relaxed font-sans">{idea}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {plan.decorAndStyling && plan.decorAndStyling.length > 0 && (
                    <div className="pt-2">
                      <h3 className="font-serif font-bold text-base text-[#63463C] dark:text-[#F5EDE5] mb-2 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
                        <span>Decor Areas & Tablescapes</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {plan.decorAndStyling.map((d, idx) => (
                          <div key={idx} className="p-3 bg-[#F4E8D9]/70 dark:bg-[#29272A]/70 rounded-xl border border-[#D6BDA5] dark:border-[#5A5055]">
                            <span className="font-bold text-[#63463C] dark:text-[#F5EDE5] block mb-1">{d.area}</span>
                            <p className="text-[11px] text-[#392D29] dark:text-[#D7C5C0] mb-1 font-sans">{d.idea}</p>
                            {d.woodlandDetail && (
                              <p className="text-[10px] text-[#777B59] dark:text-[#A6A98A] font-medium">{d.woodlandDetail}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
