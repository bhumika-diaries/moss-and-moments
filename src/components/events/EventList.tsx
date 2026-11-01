import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  PlusCircle,
  Sparkles,
  Edit2,
  Trash2,
  Search,
  ArrowRight,
  CalendarDays,
  LayoutGrid,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon } from '../common/WoodlandIcons';
import { EventItem, EventStatus } from '../../types';
import { EventCalendar } from './EventCalendar';
import { useCurrency } from '../../hooks/useCurrency';

interface EventListProps {
  events: EventItem[];
  activeEvent: EventItem | undefined;
  onSelectEvent: (id: string) => void;
  onOpenCreate: (initialDate?: string) => void;
  onEditEvent: (event: EventItem) => void;
  onDeleteEvent: (id: string) => void;
  onOpenAIPlannerForEvent: (event: EventItem) => void;
  onOpenTeamForEvent?: (event: EventItem) => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  onOpenCreate,
  onEditEvent,
  onDeleteEvent,
  onOpenAIPlannerForEvent,
  onOpenTeamForEvent,
}) => {
  const { formatMoney } = useCurrency();
  const [activeTabMode, setActiveTabMode] = useState<'calendar' | 'grid'>('calendar');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((evt) => {
    const matchesStatus = filterStatus === 'All' || evt.status === filterStatus;
    const matchesSearch =
      evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.theme.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A]">
              Chronicles of Celebrations
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
            Events & Calendar
          </h1>
        </div>

        {/* View Mode Switcher (Calendar vs Cards Grid) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-[#FFF8EF] dark:bg-[#393438] rounded-2xl border border-[#D6BDA5] dark:border-[#5A5055] text-xs shadow-xs">
            <button
              onClick={() => setActiveTabMode('calendar')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTabMode === 'calendar'
                  ? 'bg-[#777B59] text-[#FFF8EF] shadow-xs'
                  : 'text-[#63463C] dark:text-[#D7C5C0] hover:text-[#392D29] dark:hover:text-[#F5EDE5]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Interactive Calendar</span>
            </button>
            <button
              onClick={() => setActiveTabMode('grid')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTabMode === 'grid'
                  ? 'bg-[#777B59] text-[#FFF8EF] shadow-xs'
                  : 'text-[#63463C] dark:text-[#D7C5C0] hover:text-[#392D29] dark:hover:text-[#F5EDE5]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards Grid</span>
            </button>
          </div>

          <button
            onClick={() => onOpenCreate()}
            className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2.5 rounded-xl border border-[#A6A98A] text-xs flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Celebration</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Interactive Event Calendar */}
      {activeTabMode === 'calendar' ? (
        <EventCalendar
          events={events}
          activeEvent={activeEvent}
          onSelectEvent={onSelectEvent}
          onOpenCreate={onOpenCreate}
          onEditEvent={onEditEvent}
          onOpenAIPlannerForEvent={onOpenAIPlannerForEvent}
        />
      ) : (
        /* Mode 2: Cards Grid View with Search & Filter */
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFF8EF] dark:bg-[#393438] p-3 rounded-2xl border border-[#D6BDA5] dark:border-[#5A5055]">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Planning', 'Confirmed', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    filterStatus === st
                      ? 'bg-[#777B59] text-[#FFF8EF]'
                      : 'text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777B59] dark:text-[#A6A98A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gathering or venue..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#F4E8D9]/70 dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-1 focus:ring-[#777B59]"
              />
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const isActive = activeEvent?.id === evt.id;
              return (
                <div
                  key={evt.id}
                  className={`parchment-card rounded-3xl p-6 relative flex flex-col justify-between transition-all group ${
                    isActive
                      ? 'border-2 border-[#777B59] dark:border-[#B58D99] shadow-lg ring-2 ring-[#777B59]/20'
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className="absolute top-3 left-3"><ScrewRivet /></div>
                  <div className="absolute top-3 right-3"><ScrewRivet /></div>

                  <div>
                    {/* Status chip & Event Type */}
                    <div className="flex items-center justify-between gap-2 mb-3 pl-3 pr-3">
                      <span className="text-xs font-semibold text-[#777B59] dark:text-[#A6A98A]">
                        {evt.eventType}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                          evt.status === 'Confirmed'
                            ? 'bg-[#777B59] text-[#FFF8EF]'
                            : evt.status === 'Completed'
                            ? 'bg-[#A6A98A] text-[#392D29]'
                            : 'bg-[#B58D99] text-[#FFF8EF]'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </div>

                    {/* Event Name */}
                    <h3 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2 break-words leading-snug">
                      {evt.name}
                    </h3>

                    {/* Description / Theme */}
                    <p className="text-xs text-[#392D29]/75 dark:text-[#D7C5C0] mb-4 line-clamp-2 leading-relaxed">
                      {evt.theme || evt.notes || 'A quiet, heartfelt woodland celebration.'}
                    </p>

                    {/* Event Meta Details */}
                    <div className="space-y-1.5 text-xs text-[#63463C] dark:text-[#D7C5C0] bg-[#F4E8D9]/50 dark:bg-[#29272A]/50 p-3 rounded-xl border border-[#D6BDA5]/50 dark:border-[#5A5055]/50 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A] shrink-0" />
                        <span className="font-mono">{evt.eventDate || 'Date to be confirmed'}</span>
                      </div>
                      {evt.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A] shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-1 border-t border-[#D6BDA5]/30 dark:border-[#5A5055]/30">
                        <span className="flex items-center gap-1 font-mono">
                          <Users className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                          <span>{evt.guestCount} guests</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono font-bold text-[#63463C] dark:text-[#F5EDE5]">
                          <span>{formatMoney(evt.budget)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-3 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectEvent(evt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#777B59] text-[#FFF8EF]'
                          : 'bg-[#FFF8EF] dark:bg-[#393438] text-[#63463C] dark:text-[#F5EDE5] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] border border-[#D6BDA5] dark:border-[#5A5055]'
                      }`}
                    >
                      <span>{isActive ? 'Active Workspace' : 'Select'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1">
                      {onOpenTeamForEvent && (
                        <button
                          onClick={() => onOpenTeamForEvent(evt)}
                          className="p-1.5 rounded-lg text-[#777B59] dark:text-[#A6A98A] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors cursor-pointer"
                          title="Manage Circle & Collaborators"
                        >
                          <Users className="w-4 h-4 text-[#777B59]" />
                        </button>
                      )}
                      <button
                        onClick={() => onOpenAIPlannerForEvent(evt)}
                        className="p-1.5 rounded-lg text-[#777B59] dark:text-[#A6A98A] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors cursor-pointer"
                        title="Plan with Gemini AI"
                      >
                        <Sparkles className="w-4 h-4 text-[#B58D99]" />
                      </button>
                      <button
                        onClick={() => onEditEvent(evt)}
                        className="p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors cursor-pointer"
                        title="Edit event"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you wish to delete "${evt.name}"?`)) {
                            onDeleteEvent(evt.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-[#B58D99] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors cursor-pointer"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredEvents.length === 0 && (
              <div className="col-span-full parchment-card rounded-3xl p-12 text-center border-2 border-dashed border-[#D6BDA5] dark:border-[#5A5055]">
                <MushroomIcon className="w-12 h-12 text-[#777B59] dark:text-[#A6A98A] mx-auto mb-3" />
                <h3 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">
                  No Gatherings Found
                </h3>
                <p className="text-xs text-[#392D29]/70 dark:text-[#D7C5C0] max-w-sm mx-auto mb-4">
                  {searchQuery || filterStatus !== 'All'
                    ? 'Try adjusting your search terms or filter selection.'
                    : 'Your woodland calendar is currently clear. Let us create your first celebration.'}
                </p>
                <button
                  onClick={() => onOpenCreate()}
                  className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Create New Event
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
