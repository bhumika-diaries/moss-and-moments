import React, { useState } from 'react';
import {
  Palette,
  PlusCircle,
  Copy,
  Check,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon, LeafIcon, AcornIcon, FlowerIcon } from '../common/WoodlandIcons';
import { MoodboardPin, EventItem } from '../../types';

interface MoodboardGalleryProps {
  pins: MoodboardPin[];
  events: EventItem[];
  activeEvent: EventItem | undefined;
  onSavePin: (pin: Omit<MoodboardPin, 'id'> & { id?: string }) => void;
  onDeletePin: (id: string) => void;
}

const BRAND_PALETTE = [
  { name: 'Parchment', hex: '#F4E8D9', textDark: true, note: 'App backdrop' },
  { name: 'Cream', hex: '#FFF8EF', textDark: true, note: 'Card surfaces' },
  { name: 'Wood Brown', hex: '#63463C', textDark: false, note: 'Headers & accents' },
  { name: 'Dark Cocoa', hex: '#392D29', textDark: false, note: 'Primary typography' },
  { name: 'Muted Sage', hex: '#A6A98A', textDark: true, note: 'Secondary foliage' },
  { name: 'Olive Green', hex: '#777B59', textDark: false, note: 'Primary actions' },
  { name: 'Dusty Mauve', hex: '#B58D99', textDark: false, note: 'Berry accents' },
  { name: 'Mushroom Beige', hex: '#D6BDA5', textDark: true, note: 'Borders & dividers' },
];

export const MoodboardGallery: React.FC<MoodboardGalleryProps> = ({
  pins,
  events,
  activeEvent,
  onSavePin,
  onDeletePin,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [filterEventId, setFilterEventId] = useState<string>(activeEvent?.id || 'all');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pinTitle, setPinTitle] = useState('');
  const [pinCategory, setPinCategory] = useState<MoodboardPin['category']>('Tablescape');
  const [pinNotes, setPinNotes] = useState('');
  const [pinIcon, setPinIcon] = useState<MoodboardPin['iconType']>('leaf');
  const [pinEventId, setPinEventId] = useState(activeEvent?.id || events[0]?.id || '');
  const [formError, setFormError] = useState('');

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCreatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinTitle.trim()) {
      setFormError('Pin title is required.');
      return;
    }
    if (!pinEventId) {
      setFormError('Please choose a gathering for this pin.');
      return;
    }

    onSavePin({
      eventId: pinEventId,
      title: pinTitle.trim(),
      category: pinCategory,
      notes: pinNotes.trim(),
      iconType: pinIcon,
      palette: ['#777B59', '#A6A98A', '#F4E8D9', '#63463C'],
    });

    setIsModalOpen(false);
    setPinTitle('');
    setPinNotes('');
    setFormError('');
  };

  const displayedPins = pins.filter((p) => {
    const matchesEvent = filterEventId === 'all' || p.eventId === filterEventId;
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesEvent && matchesCategory;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A]">
              Cottagecore & Botanical Visuals
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
            Moodboard & Design Sanctuary
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2.5 rounded-xl border border-[#A6A98A] text-xs flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Inspiration Pin</span>
        </button>
      </div>

      {/* Brand Color Tokens Swatches */}
      <div className="parchment-card rounded-3xl p-6 sm:p-7 relative shadow-md">
        <div className="absolute top-4 left-4"><ScrewRivet /></div>
        <div className="absolute top-4 right-4"><ScrewRivet /></div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
            <span className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
              Woodland Palette Swatches
            </span>
          </div>
          <p className="text-xs text-[#392D29]/75 dark:text-[#D7C5C0]/80">
            Click any color chip to copy its hexadecimal code for invitations, floral orders, and stationery.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {BRAND_PALETTE.map((c) => (
            <button
              key={c.hex}
              onClick={() => handleCopyColor(c.hex)}
              className="p-2.5 rounded-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055] hover:scale-103 transition-transform text-left group relative shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#777B59]"
              style={{ backgroundColor: c.hex }}
              title={`Click to copy ${c.hex}`}
            >
              <div className="flex items-center justify-between mb-8">
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    c.textDark ? 'text-[#392D29] bg-black/10' : 'text-[#FFF8EF] bg-white/20'
                  }`}
                >
                  {copiedHex === c.hex ? 'Copied!' : c.hex}
                </span>
                {copiedHex === c.hex ? (
                  <Check className={`w-3 h-3 ${c.textDark ? 'text-[#392D29]' : 'text-[#FFF8EF]'}`} />
                ) : (
                  <Copy className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${c.textDark ? 'text-[#392D29]' : 'text-[#FFF8EF]'}`} />
                )}
              </div>
              <div>
                <p
                  className={`font-serif text-xs font-bold leading-tight ${
                    c.textDark ? 'text-[#392D29]' : 'text-[#FFF8EF]'
                  }`}
                >
                  {c.name}
                </p>
                <p
                  className={`text-[9px] truncate ${
                    c.textDark ? 'text-[#392D29]/80' : 'text-[#FFF8EF]/80'
                  }`}
                >
                  {c.note}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FFF8EF] dark:bg-[#393438] p-4 rounded-2xl border border-[#D6BDA5] dark:border-[#5A5055] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#63463C] dark:text-[#D7C5C0]">Gathering:</span>
          <select
            value={filterEventId}
            onChange={(e) => setFilterEventId(e.target.value)}
            className="p-1.5 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5]"
          >
            <option value="all">All Gatherings</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Tablescape', 'Stationery', 'Catering', 'Lighting', 'Florals', 'Attire'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterCategory === cat
                  ? 'bg-[#777B59] text-[#FFF8EF]'
                  : 'text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inspiration Pins Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPins.map((pin) => {
          const matchedEvent = events.find((e) => e.id === pin.eventId);
          return (
            <div
              key={pin.id}
              className="parchment-card rounded-3xl p-6 relative flex flex-col justify-between hover:shadow-lg transition-all border-2 border-[#D6BDA5] dark:border-[#5A5055]"
            >
              <div className="absolute top-3 left-3"><ScrewRivet /></div>
              <div className="absolute top-3 right-3"><ScrewRivet /></div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-3 pl-3 pr-3">
                  <span className="text-[10px] font-bold bg-[#777B59] text-[#FFF8EF] px-2 py-0.5 rounded-md">
                    {pin.category}
                  </span>
                  {matchedEvent && filterEventId === 'all' && (
                    <span className="text-[10px] font-semibold text-[#777B59] dark:text-[#A6A98A] truncate max-w-[150px]">
                      {matchedEvent.name}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] flex items-center justify-center shrink-0">
                    {pin.iconType === 'mushroom' ? (
                      <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
                    ) : pin.iconType === 'flower' ? (
                      <FlowerIcon className="w-5 h-5 text-[#B58D99]" />
                    ) : pin.iconType === 'leaf' ? (
                      <LeafIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
                    ) : (
                      <AcornIcon className="w-5 h-5 text-[#63463C] dark:text-[#D7C5C0]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#63463C] dark:text-[#F5EDE5] leading-snug break-words">
                      {pin.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#392D29]/80 dark:text-[#D7C5C0]/80 leading-relaxed mb-4 font-sans">
                  {pin.notes}
                </p>

                {/* Color swatches for this pin */}
                {pin.palette && pin.palette.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-2 mb-2">
                    {pin.palette.map((hex, idx) => (
                      <div
                        key={idx}
                        className="w-5 h-5 rounded-full border border-[#D6BDA5] dark:border-[#5A5055] shadow-xs cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: hex }}
                        title={`Copy ${hex}`}
                        onClick={() => handleCopyColor(hex)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#D6BDA5]/50 dark:border-[#5A5055]/50 flex items-center justify-between text-xs">
                <span className="text-[10px] text-[#63463C] dark:text-[#D7C5C0] font-medium">Woodland Inspiration</span>
                <button
                  onClick={() => onDeletePin(pin.id)}
                  className="p-1 rounded text-[#B58D99] hover:bg-[#F4E8D9] dark:hover:bg-[#29272A]"
                  title="Delete pin"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {displayedPins.length === 0 && (
          <div className="col-span-full parchment-card rounded-3xl p-12 text-center border-2 border-dashed border-[#D6BDA5] dark:border-[#5A5055]">
            <Sparkles className="w-12 h-12 text-[#777B59] dark:text-[#A6A98A] mx-auto mb-3" />
            <h3 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">
              No Moodboard Pins Found
            </h3>
            <p className="text-xs text-[#392D29]/70 dark:text-[#D7C5C0]/80 max-w-sm mx-auto mb-4">
              Add your first inspiration pin with aesthetic ideas, florals, lighting, or catering details.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2 rounded-xl text-xs"
            >
              Create Inspiration Pin
            </button>
          </div>
        )}
      </div>

      {/* Add Pin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#392D29]/60 dark:bg-black/75 backdrop-blur-xs font-sans">
          <div className="parchment-card rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055]">
            <div className="absolute top-4 left-4"><ScrewRivet /></div>
            <div className="absolute top-4 right-4"><ScrewRivet /></div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-10 p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-4">
              Add Inspiration Pin
            </h2>

            {formError && (
              <div className="mb-4 p-2.5 rounded-xl bg-[#B58D99]/20 border border-[#B58D99] text-xs text-[#63463C] dark:text-[#F5EDE5]">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">
                  Pin Title <span className="text-[#B58D99]">*</span>
                </label>
                <input
                  type="text"
                  value={pinTitle}
                  onChange={(e) => setPinTitle(e.target.value)}
                  placeholder="e.g. Amber Beeswax Candelabras with Wild Ivy"
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">Gathering</label>
                <select
                  value={pinEventId}
                  onChange={(e) => setPinEventId(e.target.value)}
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
                  <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">Category</label>
                  <select
                    value={pinCategory}
                    onChange={(e) => setPinCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  >
                    <option value="Tablescape">Tablescape</option>
                    <option value="Florals">Florals</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Catering">Catering</option>
                    <option value="Attire">Attire</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">Botanical Icon</label>
                  <select
                    value={pinIcon}
                    onChange={(e) => setPinIcon(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  >
                    <option value="mushroom">Mushroom</option>
                    <option value="leaf">Fern & Leaf</option>
                    <option value="flower">Wildflower</option>
                    <option value="sparkle">Beeswax Lantern</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">Inspiration Notes & Textures</label>
                <textarea
                  rows={3}
                  value={pinNotes}
                  onChange={(e) => setPinNotes(e.target.value)}
                  placeholder="Materials, textures, styling instructions, scent profiles..."
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-5 py-2.5 rounded-xl text-xs shadow-md"
                >
                  Pin to Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
