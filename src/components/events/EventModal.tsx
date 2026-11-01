import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { ScrewRivet, MushroomIcon } from '../common/WoodlandIcons';
import { EventItem, EventType, EventStatus } from '../../types';
import { useCurrency } from '../../hooks/useCurrency';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'> & { id?: string }) => void;
  initialData?: EventItem | null;
  initialDate?: string;
}

const EVENT_TYPES: EventType[] = [
  'Wedding',
  'Birthday',
  'Anniversary',
  'Garden Tea Party',
  'Baby Shower',
  'Dinner Soirée',
  'Community Festival',
  'Woodland Workshop',
  'Other',
];

const EVENT_STATUSES: EventStatus[] = ['Planning', 'Confirmed', 'Completed', 'Archived'];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  initialDate,
}) => {
  const { activeCurrency } = useCurrency();
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState<EventType>('Garden Tea Party');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState(30);
  const [budget, setBudget] = useState(3500);
  const [theme, setTheme] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<EventStatus>('Planning');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEventType(initialData.eventType);
      setEventDate(initialData.eventDate || '');
      setLocation(initialData.location || '');
      setGuestCount(initialData.guestCount || 0);
      setBudget(initialData.budget || 0);
      setTheme(initialData.theme || '');
      setNotes(initialData.notes || '');
      setStatus(initialData.status || 'Planning');
    } else {
      setName('');
      setEventType('Garden Tea Party');
      setEventDate(initialDate || '');
      setLocation('');
      setGuestCount(30);
      setBudget(3500);
      setTheme('Misty Moss, Beeswax Candles & Pressed Ferns');
      setNotes('');
      setStatus('Planning');
    }
    setErrors({});
  }, [initialData, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Please provide a name for this gathering.';
    }
    if (guestCount < 1) {
      newErrors.guestCount = 'Guest estimate must be at least 1.';
    }
    if (budget < 0) {
      newErrors.budget = 'Budget cannot be negative.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: initialData ? initialData.id : undefined,
      name: name.trim(),
      eventType,
      eventDate,
      location: location.trim(),
      guestCount: Number(guestCount),
      budget: Number(budget),
      theme: theme.trim(),
      notes: notes.trim(),
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29272A]/70 backdrop-blur-xs animate-in fade-in font-sans">
      <div className="parchment-card rounded-3xl w-full max-w-xl p-6 sm:p-8 relative shadow-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055] max-h-[90vh] overflow-y-auto">
        <div className="absolute top-4 left-4"><ScrewRivet /></div>
        <div className="absolute top-4 right-4"><ScrewRivet /></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-10 p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58D99] cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
          <span className="text-xs uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A]">
            {initialData ? 'Update Gathering Details' : 'Weave a New Celebration'}
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-6">
          {initialData ? 'Edit Event' : 'Create New Event'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          {/* Name */}
          <div>
            <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">
              Event Name <span className="text-[#B58D99]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Midsummer Wildflower Picnic"
              className={`w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59] ${
                errors.name ? 'border-[#B58D99]' : 'border-[#D6BDA5] dark:border-[#5A5055]'
              }`}
            />
            {errors.name && <p className="text-[#B58D99] text-[11px] mt-1">{errors.name}</p>}
          </div>

          {/* Type & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
              >
                {EVENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Location Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Location / Venue</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Whispering Pines Orchard"
                className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
              />
            </div>
          </div>

          {/* Guests & Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Estimated Guests</label>
              <input
                type="number"
                min="1"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs font-mono text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
              />
              {errors.guestCount && <p className="text-[#B58D99] text-[11px] mt-1">{errors.guestCount}</p>}
            </div>

            <div>
              <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">
                Total Budget (USD base, converted in {activeCurrency.code})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-[#777B59] dark:text-[#A6A98A]">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs font-mono text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                />
              </div>
              {errors.budget && <p className="text-[#B58D99] text-[11px] mt-1">{errors.budget}</p>}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Theme & Color Palette</label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. Moss green, antique brass, dried hydrangeas and linen"
              className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Notes & Aspirations</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special musical requests, heirloom decor details, seasonal dishes..."
              className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#777B59] cursor-pointer"
            >
              <span>{initialData ? 'Save Changes' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
