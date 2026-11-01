import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  PlusCircle,
  Sparkles,
  ArrowRight,
  List,
  CalendarDays,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon } from '../common/WoodlandIcons';
import { EventItem, EventType } from '../../types';
import { useCurrency } from '../../hooks/useCurrency';

interface EventCalendarProps {
  events: EventItem[];
  activeEvent: EventItem | undefined;
  onSelectEvent: (id: string) => void;
  onOpenCreate: (initialDate?: string) => void;
  onEditEvent: (event: EventItem) => void;
  onOpenAIPlannerForEvent: (event: EventItem) => void;
}

// Color mapping for woodland event types
const EVENT_TYPE_COLORS: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  Wedding: { bg: 'bg-[#B58D99]/20 dark:bg-[#B58D99]/30', text: 'text-[#8E5E6D] dark:text-[#E8BDC9]', dot: 'bg-[#B58D99]', label: 'Wedding' },
  'Garden Tea Party': { bg: 'bg-[#A6A98A]/25 dark:bg-[#A6A98A]/35', text: 'text-[#585B40] dark:text-[#D5D8BA]', dot: 'bg-[#777B59]', label: 'Tea Party' },
  'Dinner Soirée': { bg: 'bg-[#967783]/20 dark:bg-[#967783]/30', text: 'text-[#684C57] dark:text-[#DEBAC7]', dot: 'bg-[#967783]', label: 'Dinner Soirée' },
  Birthday: { bg: 'bg-[#D6BDA5]/35 dark:bg-[#D6BDA5]/25', text: 'text-[#63463C] dark:text-[#F4E8D9]', dot: 'bg-[#D6BDA5]', label: 'Birthday' },
  Anniversary: { bg: 'bg-[#B58D99]/25 dark:bg-[#B58D99]/35', text: 'text-[#8E5E6D] dark:text-[#E8BDC9]', dot: 'bg-[#B58D99]', label: 'Anniversary' },
  'Woodland Workshop': { bg: 'bg-[#777B59]/20 dark:bg-[#777B59]/30', text: 'text-[#4A5030] dark:text-[#C5CA9F]', dot: 'bg-[#777B59]', label: 'Workshop' },
  'Community Festival': { bg: 'bg-[#C48B71]/20 dark:bg-[#C48B71]/30', text: 'text-[#8B5238] dark:text-[#EBB59E]', dot: 'bg-[#C48B71]', label: 'Festival' },
  Other: { bg: 'bg-[#63463C]/15 dark:bg-[#63463C]/30', text: 'text-[#63463C] dark:text-[#D7C5C0]', dot: 'bg-[#63463C]', label: 'Other' },
};

// Timezone-safe date string helper
function parseDateParts(dateStr: string) {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10) - 1, // 0-indexed
    day: parseInt(parts[2], 10),
  };
}

function formatDateKey(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  onOpenCreate,
  onEditEvent,
  onOpenAIPlannerForEvent,
}) => {
  const { formatMoney } = useCurrency();

  // Current view mode: 'month' or 'list'
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  // Today reference
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(
    () => formatDateKey(today.getFullYear(), today.getMonth(), today.getDate()),
    [today]
  );

  // Month navigation state
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // If active event has a date, start in that month; otherwise today
    if (activeEvent?.eventDate) {
      const parts = parseDateParts(activeEvent.eventDate);
      if (parts) return new Date(parts.year, parts.month, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Selected date for day preview
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => {
    return activeEvent?.eventDate || todayKey;
  });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Group events by YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    events.forEach((evt) => {
      if (evt.eventDate) {
        const existing = map.get(evt.eventDate) || [];
        existing.push(evt);
        map.set(evt.eventDate, existing);
      }
    });
    return map;
  }, [events]);

  // Calendar days calculation
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateKey = formatDateKey(prevYear, prevMonth, d);
      days.push({
        dayNumber: d,
        dateKey,
        isCurrentMonth: false,
        events: eventsByDate.get(dateKey) || [],
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateKey = formatDateKey(currentYear, currentMonth, d);
      days.push({
        dayNumber: d,
        dateKey,
        isCurrentMonth: true,
        events: eventsByDate.get(dateKey) || [],
      });
    }

    // Next month padding to fill complete weeks (up to multiple of 7)
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        const dateKey = formatDateKey(nextYear, nextMonth, d);
        days.push({
          dayNumber: d,
          dateKey,
          isCurrentMonth: false,
          events: eventsByDate.get(dateKey) || [],
        });
      }
    }

    return days;
  }, [currentYear, currentMonth, eventsByDate]);

  // Sorted upcoming events for list view
  const upcomingEvents = useMemo(() => {
    return [...events].sort((a, b) => (a.eventDate || '').localeCompare(b.eventDate || ''));
  }, [events]);

  const selectedDateEvents = useMemo(() => {
    return eventsByDate.get(selectedDateKey) || [];
  }, [eventsByDate, selectedDateKey]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateKey(todayKey);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-6 font-sans">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 parchment-card rounded-3xl border border-[#D6BDA5] dark:border-[#5A5055]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#777B59] flex items-center justify-center text-[#FFF8EF] shadow-inner">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] leading-tight flex items-center gap-2">
              <span>{monthName}</span>
              <span className="text-[#777B59] dark:text-[#A6A98A] font-mono">{currentYear}</span>
            </h2>
            <p className="text-xs text-[#392D29]/70 dark:text-[#D7C5C0]">
              Interactive Gatherings & Celebration Almanac
            </p>
          </div>
        </div>

        {/* View Switcher & Month Navigation */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Month / List Toggle */}
          <div className="flex items-center p-1 bg-[#F4E8D9] dark:bg-[#29272A] rounded-xl border border-[#D6BDA5] dark:border-[#5A5055] text-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'month'
                  ? 'bg-[#777B59] text-[#FFF8EF] shadow-xs'
                  : 'text-[#63463C] dark:text-[#D7C5C0] hover:text-[#392D29] dark:hover:text-[#F5EDE5]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#777B59] text-[#FFF8EF] shadow-xs'
                  : 'text-[#63463C] dark:text-[#D7C5C0] hover:text-[#392D29] dark:hover:text-[#F5EDE5]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Agenda</span>
            </button>
          </div>

          {/* Month Steppers */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#777B59]"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#777B59]"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* New Event Button */}
          <button
            onClick={() => onOpenCreate(selectedDateKey)}
            className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Event</span>
          </button>
        </div>
      </div>

      {/* Main View: Month Calendar vs List View */}
      {viewMode === 'month' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid Container (Span 2 cols on lg) */}
          <div className="lg:col-span-2 parchment-card rounded-3xl p-4 sm:p-6 border border-[#D6BDA5] dark:border-[#5A5055] relative shadow-md">
            <div className="absolute top-3 left-3"><ScrewRivet /></div>
            <div className="absolute top-3 right-3"><ScrewRivet /></div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-[#777B59] dark:text-[#A6A98A] mb-2 uppercase tracking-wider">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day Cells Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarGrid.map((cell, idx) => {
                const isToday = cell.dateKey === todayKey;
                const isSelected = cell.dateKey === selectedDateKey;
                const hasEvents = cell.events.length > 0;

                return (
                  <button
                    key={`${cell.dateKey}-${idx}`}
                    onClick={() => setSelectedDateKey(cell.dateKey)}
                    className={`min-h-[72px] sm:min-h-[88px] p-1.5 sm:p-2 rounded-2xl border text-left flex flex-col justify-between transition-all group relative cursor-pointer ${
                      cell.isCurrentMonth
                        ? 'bg-[#FFF8EF] dark:bg-[#393438]'
                        : 'bg-[#F4E8D9]/40 dark:bg-[#29272A]/50 opacity-60'
                    } ${
                      isSelected
                        ? 'border-2 border-[#777B59] dark:border-[#B58D99] shadow-md ring-2 ring-[#777B59]/20'
                        : isToday
                        ? 'border-2 border-[#B58D99] dark:border-[#967783]'
                        : 'border-[#D6BDA5]/60 dark:border-[#5A5055]/60 hover:border-[#777B59] dark:hover:border-[#A6A98A]'
                    }`}
                  >
                    {/* Top Row: Date Number and Today indicator */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          isToday
                            ? 'bg-[#B58D99] text-[#FFF8EF] shadow-xs'
                            : isSelected
                            ? 'bg-[#777B59] text-[#FFF8EF]'
                            : 'text-[#63463C] dark:text-[#F5EDE5]'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>

                      {/* Event count badge */}
                      {hasEvents && (
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-full bg-[#777B59]/15 text-[#777B59] dark:text-[#A6A98A]">
                          {cell.events.length}
                        </span>
                      )}
                    </div>

                    {/* Event indicators / chips */}
                    <div className="mt-1 space-y-1 w-full overflow-hidden">
                      {cell.events.slice(0, 2).map((evt) => {
                        const style = EVENT_TYPE_COLORS[evt.eventType] || EVENT_TYPE_COLORS.Other;
                        return (
                          <div
                            key={evt.id}
                            className={`w-full px-1.5 py-0.5 rounded-md text-[10px] truncate font-medium flex items-center gap-1 ${style.bg} ${style.text}`}
                            title={`${evt.name} (${evt.eventType})`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                            <span className="truncate hidden sm:inline">{evt.name}</span>
                          </div>
                        );
                      })}
                      {cell.events.length > 2 && (
                        <div className="text-[9px] font-bold text-[#777B59] dark:text-[#A6A98A] pl-1">
                          +{cell.events.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Type Color Legend */}
            <div className="mt-5 pt-4 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60 flex flex-wrap items-center gap-3 text-[11px] text-[#63463C] dark:text-[#D7C5C0]">
              <span className="font-bold flex items-center gap-1 text-[#777B59] dark:text-[#A6A98A]">
                <Tag className="w-3.5 h-3.5" />
                <span>Legend:</span>
              </span>
              {Object.entries(EVENT_TYPE_COLORS).map(([type, colors]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                  <span className="text-[11px]">{colors.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day Schedule Panel (1 col on lg) */}
          <div className="parchment-card rounded-3xl p-6 border border-[#D6BDA5] dark:border-[#5A5055] flex flex-col justify-between shadow-md relative">
            <div className="absolute top-3 left-3"><ScrewRivet /></div>
            <div className="absolute top-3 right-3"><ScrewRivet /></div>

            <div>
              {/* Day title */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A] block">
                    Daily Schedule
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#63463C] dark:text-[#F5EDE5]">
                    {new Date(selectedDateKey + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </h3>
                </div>
                {selectedDateKey === todayKey && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B58D99] text-[#FFF8EF]">
                    Today
                  </span>
                )}
              </div>

              {/* Events on this day */}
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((evt) => {
                    const isCurrent = activeEvent?.id === evt.id;
                    const style = EVENT_TYPE_COLORS[evt.eventType] || EVENT_TYPE_COLORS.Other;
                    return (
                      <div
                        key={evt.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-[#F4E8D9] dark:bg-[#454047] border-[#777B59] dark:border-[#A6A98A] shadow-xs'
                            : 'bg-[#FFF8EF] dark:bg-[#29272A] border-[#D6BDA5] dark:border-[#5A5055] hover:border-[#777B59]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${style.bg} ${style.text}`}>
                            {evt.eventType}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              evt.status === 'Confirmed'
                                ? 'bg-[#777B59] text-[#FFF8EF]'
                                : 'bg-[#B58D99] text-[#FFF8EF]'
                            }`}
                          >
                            {evt.status}
                          </span>
                        </div>

                        <h4 className="font-serif font-bold text-sm text-[#63463C] dark:text-[#F5EDE5] mb-1">
                          {evt.name}
                        </h4>

                        {evt.location && (
                          <p className="text-[11px] text-[#392D29]/75 dark:text-[#D7C5C0] flex items-center gap-1.5 mb-1 truncate">
                            <MapPin className="w-3 h-3 text-[#777B59] dark:text-[#A6A98A] shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-[#63463C] dark:text-[#D7C5C0] pt-2 border-t border-[#D6BDA5]/30 dark:border-[#5A5055]/30 mt-2 font-mono">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-[#777B59] dark:text-[#A6A98A]" />
                            <span>{evt.guestCount} guests</span>
                          </span>
                          <span className="font-bold text-[#63463C] dark:text-[#F5EDE5]">
                            {formatMoney(evt.budget)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="mt-2.5 pt-2 border-t border-[#D6BDA5]/40 dark:border-[#5A5055]/40 flex items-center justify-between gap-1">
                          <button
                            onClick={() => onSelectEvent(evt.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#777B59] text-[#FFF8EF] font-bold text-[10px] flex items-center gap-1 transition-colors hover:bg-[#686c4e]"
                          >
                            <span>{isCurrent ? 'Active' : 'Set Active'}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenAIPlannerForEvent(evt)}
                              className="p-1 rounded-lg text-[#B58D99] hover:bg-[#F4E8D9] dark:hover:bg-[#393438]"
                              title="Plan with Gemini AI"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onEditEvent(evt)}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#393438]"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center text-xs">
                  <MushroomIcon className="w-10 h-10 text-[#777B59] dark:text-[#A6A98A] mx-auto mb-2 opacity-60" />
                  <p className="font-serif font-bold text-sm text-[#63463C] dark:text-[#F5EDE5] mb-1">
                    No Gatherings Scheduled
                  </p>
                  <p className="text-[11px] text-[#392D29]/70 dark:text-[#B7A9A6] max-w-[200px] mx-auto mb-4">
                    The woodland arbor is quiet for this date.
                  </p>
                  <button
                    onClick={() => onOpenCreate(selectedDateKey)}
                    className="px-3 py-1.5 rounded-xl bg-[#777B59] text-[#FFF8EF] font-bold text-xs inline-flex items-center gap-1.5 hover:bg-[#686c4e] transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Schedule on This Day</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick date summary stats */}
            <div className="mt-4 pt-3 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60 text-[11px] text-[#777B59] dark:text-[#A6A98A] flex items-center justify-between">
              <span>{events.length} total woodland events</span>
              <button
                onClick={() => onOpenCreate()}
                className="font-bold hover:underline"
              >
                + New Celebration
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Agenda / List View */
        <div className="parchment-card rounded-3xl p-6 border border-[#D6BDA5] dark:border-[#5A5055] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
            <h3 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
              Upcoming Celebrations & Gatherings
            </h3>
            <span className="text-xs font-mono text-[#777B59] dark:text-[#A6A98A] font-bold">
              {upcomingEvents.length} events scheduled
            </span>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((evt) => {
              const style = EVENT_TYPE_COLORS[evt.eventType] || EVENT_TYPE_COLORS.Other;
              const isCurrent = activeEvent?.id === evt.id;
              return (
                <div
                  key={evt.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isCurrent
                      ? 'bg-[#F4E8D9] dark:bg-[#454047] border-[#777B59] dark:border-[#A6A98A] shadow-xs'
                      : 'bg-[#FFF8EF] dark:bg-[#29272A] border-[#D6BDA5] dark:border-[#5A5055] hover:border-[#777B59]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#777B59]/15 dark:bg-[#777B59]/25 flex flex-col items-center justify-center font-mono shrink-0 border border-[#777B59]/30">
                      <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A] uppercase font-bold">
                        {evt.eventDate ? new Date(evt.eventDate + 'T00:00:00').toLocaleString('default', { month: 'short' }) : 'TBD'}
                      </span>
                      <span className="text-sm font-bold text-[#63463C] dark:text-[#F5EDE5]">
                        {evt.eventDate ? evt.eventDate.split('-')[2] : '—'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${style.bg} ${style.text}`}>
                          {evt.eventType}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            evt.status === 'Confirmed'
                              ? 'bg-[#777B59] text-[#FFF8EF]'
                              : 'bg-[#B58D99] text-[#FFF8EF]'
                          }`}
                        >
                          {evt.status}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#63463C] dark:text-[#F5EDE5]">
                        {evt.name}
                      </h4>
                      <p className="text-xs text-[#392D29]/75 dark:text-[#D7C5C0] flex items-center gap-2 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                        <span>{evt.location || 'Location TBD'}</span>
                        <span>•</span>
                        <Users className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                        <span>{evt.guestCount} guests</span>
                        <span>•</span>
                        <span className="font-mono font-bold text-[#63463C] dark:text-[#F5EDE5]">
                          {formatMoney(evt.budget)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => onSelectEvent(evt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        isCurrent
                          ? 'bg-[#777B59] text-[#FFF8EF]'
                          : 'bg-[#FFF8EF] dark:bg-[#393438] text-[#63463C] dark:text-[#F5EDE5] border border-[#D6BDA5] dark:border-[#5A5055] hover:bg-[#F4E8D9]'
                      }`}
                    >
                      {isCurrent ? 'Active Workspace' : 'Select'}
                    </button>
                    <button
                      onClick={() => onOpenAIPlannerForEvent(evt)}
                      className="p-2 rounded-xl text-[#B58D99] hover:bg-[#F4E8D9] dark:hover:bg-[#393438]"
                      title="AI Planner"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditEvent(evt)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#393438]"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}

            {upcomingEvents.length === 0 && (
              <div className="py-12 text-center text-xs">
                <MushroomIcon className="w-12 h-12 text-[#777B59] mx-auto mb-2" />
                <h4 className="font-serif text-lg font-bold text-[#63463C] dark:text-[#F5EDE5]">
                  No Events in the Almanac
                </h4>
                <p className="text-xs text-[#392D29]/70 dark:text-[#B7A9A6] mb-4">
                  Begin your journey by scheduling your first celebration.
                </p>
                <button
                  onClick={() => onOpenCreate()}
                  className="px-4 py-2 bg-[#777B59] text-[#FFF8EF] rounded-xl font-bold"
                >
                  Create Event
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
