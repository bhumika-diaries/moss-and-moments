import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { EventList } from './components/events/EventList';
import { EventModal } from './components/events/EventModal';
import { AIPlanner } from './components/ai/AIPlanner';
import { TaskManager } from './components/tasks/TaskManager';
import { BudgetTracker } from './components/budget/BudgetTracker';
import { GuestManager } from './components/guests/GuestManager';
import { TimelineCalendar } from './components/timeline/TimelineCalendar';
import { MoodboardGallery } from './components/moodboard/MoodboardGallery';
import { AuthModal } from './components/auth/AuthModal';
import { SettingsModal } from './components/settings/SettingsModal';
import {
  EventItem,
  TaskItem,
  ExpenseItem,
  GuestItem,
  TimelineSlot,
  MoodboardPin,
  UserProfile,
} from './types';
import { MushroomIcon, LeafIcon, AcornIcon, ScrewRivet } from './components/common/WoodlandIcons';

export default function App() {
  // Theme hook (light/dark with system default & localStorage persistence)
  const { theme, toggleTheme } = useTheme();

  // Navigation
  const [activeTab, setActiveTab] = useState<string>('landing');

  // Core Data States
  const [user, setUser] = useState<UserProfile>(() => storageService.getUser());
  const [events, setEvents] = useState<EventItem[]>(() => storageService.getEvents());
  const [activeEventId, setActiveEventId] = useState<string>(() => storageService.getActiveEventId());
  const [tasks, setTasks] = useState<TaskItem[]>(() => storageService.getTasks());
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => storageService.getExpenses());
  const [guests, setGuests] = useState<GuestItem[]>(() => storageService.getGuests());
  const [timeline, setTimeline] = useState<TimelineSlot[]>(() => storageService.getTimeline());
  const [moodboard, setMoodboard] = useState<MoodboardPin[]>(() => storageService.getMoodboard());

  // Modals
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [createEventInitialDate, setCreateEventInitialDate] = useState<string | undefined>(undefined);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'currency' | 'profile'>('currency');

  // Derived active event
  const activeEvent = events.find((e) => e.id === activeEventId) || events[0];

  const handleSelectEvent = (eventId: string) => {
    setActiveEventId(eventId);
    storageService.setActiveEventId(eventId);
  };

  const handleOpenCreateEvent = (initialDate?: string) => {
    setEditingEvent(null);
    setCreateEventInitialDate(initialDate);
    setIsCreateEventOpen(true);
  };

  // Event handlers
  const handleSaveEvent = (
    eventData: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'> & { id?: string }
  ) => {
    const saved = storageService.saveEvent(eventData);
    setEvents(storageService.getEvents());
    setActiveEventId(saved.id);
  };

  const handleDeleteEvent = (id: string) => {
    storageService.deleteEvent(id);
    setEvents(storageService.getEvents());
    setTasks(storageService.getTasks());
    setExpenses(storageService.getExpenses());
    setGuests(storageService.getGuests());
    setTimeline(storageService.getTimeline());
    setMoodboard(storageService.getMoodboard());
    setActiveEventId(storageService.getActiveEventId());
  };

  // Task handlers
  const handleToggleTask = (id: string) => {
    storageService.toggleTaskStatus(id);
    setTasks(storageService.getTasks());
  };

  const handleSaveTask = (taskData: Omit<TaskItem, 'id' | 'createdAt'> & { id?: string }) => {
    storageService.saveTask(taskData);
    setTasks(storageService.getTasks());
  };

  const handleDeleteTask = (id: string) => {
    storageService.deleteTask(id);
    setTasks(storageService.getTasks());
  };

  const handleImportTasks = (importedTasks: Omit<TaskItem, 'id' | 'createdAt'>[]) => {
    importedTasks.forEach((t) => storageService.saveTask(t));
    setTasks(storageService.getTasks());
  };

  // Expense handlers
  const handleSaveExpense = (expenseData: Omit<ExpenseItem, 'id' | 'createdAt'> & { id?: string }) => {
    storageService.saveExpense(expenseData);
    setExpenses(storageService.getExpenses());
  };

  const handleDeleteExpense = (id: string) => {
    storageService.deleteExpense(id);
    setExpenses(storageService.getExpenses());
  };

  const handleImportExpenses = (importedExpenses: Omit<ExpenseItem, 'id' | 'createdAt'>[]) => {
    importedExpenses.forEach((e) => storageService.saveExpense(e));
    setExpenses(storageService.getExpenses());
  };

  const handleUpdateEventBudget = (eventId: string, newBudget: number) => {
    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      storageService.saveEvent({ ...ev, budget: newBudget, id: ev.id });
      setEvents(storageService.getEvents());
    }
  };

  // Guest handlers
  const handleSaveGuest = (guestData: Omit<GuestItem, 'id' | 'createdAt'> & { id?: string }) => {
    storageService.saveGuest(guestData);
    setGuests(storageService.getGuests());
  };

  const handleUpdateRSVP = (id: string, rsvpStatus: 'Accepted' | 'Pending' | 'Declined') => {
    storageService.updateGuestRSVP(id, rsvpStatus);
    setGuests(storageService.getGuests());
  };

  const handleDeleteGuest = (id: string) => {
    storageService.deleteGuest(id);
    setGuests(storageService.getGuests());
  };

  // Timeline handlers
  const handleSaveTimelineSlot = (slotData: Omit<TimelineSlot, 'id'> & { id?: string }) => {
    storageService.saveTimelineSlot(slotData);
    setTimeline(storageService.getTimeline());
  };

  const handleDeleteTimelineSlot = (id: string) => {
    storageService.deleteTimelineSlot(id);
    setTimeline(storageService.getTimeline());
  };

  const handleImportTimeline = (importedSlots: Omit<TimelineSlot, 'id'>[]) => {
    importedSlots.forEach((s) => storageService.saveTimelineSlot(s));
    setTimeline(storageService.getTimeline());
  };

  // Moodboard handlers
  const handleSaveMoodboardPin = (pinData: Omit<MoodboardPin, 'id'> & { id?: string }) => {
    storageService.saveMoodboardPin(pinData);
    setMoodboard(storageService.getMoodboard());
  };

  const handleDeleteMoodboardPin = (id: string) => {
    storageService.deleteMoodboardPin(id);
    setMoodboard(storageService.getMoodboard());
  };

  // User auth & reset handlers
  const handleSelectUser = (newUser: UserProfile) => {
    storageService.setUser(newUser);
    setUser(newUser);
  };

  const handleResetData = () => {
    storageService.resetAllToDefaults();
    setUser(storageService.getUser());
    setEvents(storageService.getEvents());
    setActiveEventId(storageService.getActiveEventId());
    setTasks(storageService.getTasks());
    setExpenses(storageService.getExpenses());
    setGuests(storageService.getGuests());
    setTimeline(storageService.getTimeline());
    setMoodboard(storageService.getMoodboard());
  };

  return (
    <div className="min-h-screen bg-[#F4E8D9] dark:bg-[#29272A] text-[#392D29] dark:text-[#F5EDE5] flex flex-col font-sans selection:bg-[#B58D99]/30 selection:text-[#392D29] transition-colors duration-200">
      {/* Top carved wood navigation bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        events={events}
        activeEvent={activeEvent}
        onSelectEvent={handleSelectEvent}
        onOpenCreateEvent={() => handleOpenCreateEvent()}
        user={user}
        onSelectUser={handleSelectUser}
        onOpenSettings={(tab) => {
          setSettingsTab(tab || 'currency');
          setIsSettingsOpen(true);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onResetData={handleResetData}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Viewport Router */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onStartPlanning={() => setActiveTab('planner')}
            onExploreDashboard={() => setActiveTab('dashboard')}
            onSelectEvent={(id) => {
              handleSelectEvent(id);
              setActiveTab('dashboard');
            }}
            events={events}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            events={events}
            activeEvent={activeEvent}
            tasks={tasks}
            expenses={expenses}
            guests={guests}
            onSelectEvent={handleSelectEvent}
            onNavigateTab={setActiveTab}
            onOpenCreateEvent={() => handleOpenCreateEvent()}
            onToggleTask={handleToggleTask}
            onOpenAddTask={() => setActiveTab('tasks')}
            onOpenAddExpense={() => setActiveTab('budget')}
            onOpenAddGuest={() => setActiveTab('guests')}
          />
        )}

        {activeTab === 'events' && (
          <EventList
            events={events}
            activeEvent={activeEvent}
            onSelectEvent={(id) => {
              handleSelectEvent(id);
              setActiveTab('dashboard');
            }}
            onOpenCreate={handleOpenCreateEvent}
            onEditEvent={(evt) => {
              setEditingEvent(evt);
              setIsCreateEventOpen(true);
            }}
            onDeleteEvent={handleDeleteEvent}
            onOpenAIPlannerForEvent={(evt) => {
              handleSelectEvent(evt.id);
              setActiveTab('planner');
            }}
          />
        )}

        {activeTab === 'planner' && (
          <AIPlanner
            events={events}
            activeEvent={activeEvent}
            onImportTasks={handleImportTasks}
            onImportExpenses={handleImportExpenses}
            onImportTimeline={handleImportTimeline}
            onUpdateEventBudget={handleUpdateEventBudget}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManager
            tasks={tasks}
            events={events}
            activeEvent={activeEvent}
            onToggleTask={handleToggleTask}
            onSaveTask={handleSaveTask}
            onDeleteTask={handleDeleteTask}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetTracker
            expenses={expenses}
            events={events}
            activeEvent={activeEvent}
            onSaveExpense={handleSaveExpense}
            onDeleteExpense={handleDeleteExpense}
            onUpdateEventBudget={handleUpdateEventBudget}
          />
        )}

        {activeTab === 'guests' && (
          <GuestManager
            guests={guests}
            events={events}
            activeEvent={activeEvent}
            onSaveGuest={handleSaveGuest}
            onUpdateRSVP={handleUpdateRSVP}
            onDeleteGuest={handleDeleteGuest}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineCalendar
            timeline={timeline}
            events={events}
            tasks={tasks}
            activeEvent={activeEvent}
            onSaveSlot={handleSaveTimelineSlot}
            onDeleteSlot={handleDeleteTimelineSlot}
          />
        )}

        {activeTab === 'moodboard' && (
          <MoodboardGallery
            pins={moodboard}
            events={events}
            activeEvent={activeEvent}
            onSavePin={handleSaveMoodboardPin}
            onDeletePin={handleDeleteMoodboardPin}
          />
        )}
      </main>

      {/* Footer with Fig Ficus wood aesthetic */}
      <footer className="mt-auto border-t border-[#D6BDA5]/60 dark:border-[#5A5055] bg-[#63463C] dark:bg-[#29272A] text-[#FFF8EF] py-8 px-4 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#777B59] dark:bg-[#454047] flex items-center justify-center">
              <MushroomIcon className="w-5 h-5 text-[#FFF8EF]" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm tracking-wide">Moss & Moments</p>
              <p className="font-hand text-xs text-[#D6BDA5] dark:text-[#D7C5C0]">Little details. Beautifully planned moments.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#D6BDA5] dark:text-[#D7C5C0]">
            <button onClick={() => setActiveTab('landing')} className="hover:text-[#FFF8EF] transition-colors cursor-pointer">Home</button>
            <span>•</span>
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#FFF8EF] transition-colors cursor-pointer">Dashboard</button>
            <span>•</span>
            <button onClick={() => setActiveTab('events')} className="hover:text-[#FFF8EF] transition-colors cursor-pointer">Events & Calendar</button>
            <span>•</span>
            <button onClick={() => setActiveTab('planner')} className="hover:text-[#FFF8EF] transition-colors cursor-pointer">AI Planner</button>
            <span>•</span>
            <button onClick={() => setActiveTab('tasks')} className="hover:text-[#FFF8EF] transition-colors cursor-pointer">Checklist</button>
            <span>•</span>
            <button onClick={() => setActiveTab('budget')} className="hover:text-[#FFF8EF] transition-colors cursor-pointer">Budget</button>
            <span>•</span>
            <button onClick={() => setActiveTab('guests')} className="hover:text-[#FFF8EF] transition-colors cursor-pointer">Guests</button>
            <span>•</span>
            <button onClick={() => setActiveTab('timeline')} className="hover:text-[#FFF8EF] transition-colors cursor-pointer">Timeline</button>
            <span>•</span>
            <button onClick={() => setActiveTab('moodboard')} className="hover:text-[#FFF8EF] transition-colors cursor-pointer">Moodboard</button>
          </div>

          <div className="text-[11px] text-[#D6BDA5]/80 dark:text-[#B7A9A6] text-center md:text-right font-mono">
            <span>Woodland Edition • Built with Gemini & React</span>
          </div>
        </div>
      </footer>

      {/* Create / Edit Event Modal */}
      <EventModal
        isOpen={isCreateEventOpen}
        onClose={() => {
          setIsCreateEventOpen(false);
          setEditingEvent(null);
          setCreateEventInitialDate(undefined);
        }}
        onSave={handleSaveEvent}
        initialData={editingEvent}
        initialDate={createEventInitialDate}
      />

      {/* User Auth & Vault Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onSelectUser={handleSelectUser}
      />

      {/* Settings Modal (Currency & Region / Profile & Account) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onSelectUser={handleSelectUser}
        initialTab={settingsTab}
      />
    </div>
  );
}
