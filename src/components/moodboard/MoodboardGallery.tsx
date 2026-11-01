import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  PlusCircle,
  Copy,
  Check,
  Sparkles,
  Trash2,
  X,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  Edit3,
  Sliders,
  RotateCcw,
  Layers,
  Sparkle,
  Plus,
  Compass,
  Star,
  Heart,
  Camera,
  Music,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon, LeafIcon, AcornIcon, FlowerIcon } from '../common/WoodlandIcons';
import {
  MoodboardPin,
  EventItem,
  EventMoodboardConfig,
  EventMoodboardTheme,
  PaletteColor,
} from '../../types';
import { storageService } from '../../services/storageService';
import {
  PREDEFINED_THEMES,
  getThemesForEventType,
  getDefaultThemeForEvent,
} from '../../services/eventThemes';

interface MoodboardGalleryProps {
  pins: MoodboardPin[];
  events: EventItem[];
  activeEvent: EventItem | undefined;
  onSelectEvent?: (eventId: string) => void;
  onSavePin: (pin: Omit<MoodboardPin, 'id'> & { id?: string }) => void;
  onDeletePin: (id: string) => void;
}

export const MoodboardGallery: React.FC<MoodboardGalleryProps> = ({
  pins,
  events,
  activeEvent,
  onSelectEvent,
  onSavePin,
  onDeletePin,
}) => {
  // Selected Event tracking (defaults to activeEvent, or first event)
  const [selectedEventId, setSelectedEventId] = useState<string>(activeEvent?.id || events[0]?.id || '');

  // Derived current event
  const currentEvent = events.find((e) => e.id === selectedEventId) || activeEvent || events[0];

  // Event-specific theme configuration
  const [moodConfig, setMoodConfig] = useState<EventMoodboardConfig>(() => {
    return (
      storageService.getEventMoodboardConfig(currentEvent) || {
        eventId: currentEvent?.id || 'default',
        themeId: 'theme-wedding-woodland',
        themeName: 'Enchanted Woodland Cottagecore',
        themeDescription: 'Botanical sanctuary with moss runners, beeswax candles, and forest textures.',
        palette: PREDEFINED_THEMES[1].palette,
        categories: PREDEFINED_THEMES[1].categories,
        isCustomTheme: false,
        updatedAt: new Date().toISOString(),
      }
    );
  });

  // UI States
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isThemeChooserOpen, setIsThemeChooserOpen] = useState(false);
  const [isPaletteEditorOpen, setIsPaletteEditorOpen] = useState(false);
  const [isCustomThemeModalOpen, setIsCustomThemeModalOpen] = useState(false);
  const [isAddPinModalOpen, setIsAddPinModalOpen] = useState(false);
  const [themeFilterType, setThemeFilterType] = useState<string>('All');

  // Custom Theme Form State
  const [customThemeName, setCustomThemeName] = useState('');
  const [customThemeDesc, setCustomThemeDesc] = useState('');
  const [customThemeKeywords, setCustomThemeKeywords] = useState('');
  const [customThemeColors, setCustomThemeColors] = useState<PaletteColor[]>([
    { id: 'c-1', name: 'Primary Accent', hex: '#777B59', note: 'Main theme tone', textDark: false },
    { id: 'c-2', name: 'Background Surface', hex: '#F4E8D9', note: 'Base linen & canvas', textDark: true },
    { id: 'c-3', name: 'Secondary Shade', hex: '#A6A98A', note: 'Subtle contrast', textDark: true },
    { id: 'c-4', name: 'Highlight Pop', hex: '#B58D99', note: 'Decorative accents', textDark: false },
    { id: 'c-5', name: 'Deep Grounding', hex: '#392D29', note: 'Dark structures & text', textDark: false },
  ]);

  // Palette Editor Form State
  const [editingPalette, setEditingPalette] = useState<PaletteColor[]>(moodConfig.palette);

  // Pin Creation Form State
  const [pinTitle, setPinTitle] = useState('');
  const [pinCategory, setPinCategory] = useState('');
  const [pinCustomCategory, setPinCustomCategory] = useState('');
  const [pinNotes, setPinNotes] = useState('');
  const [pinIcon, setPinIcon] = useState<MoodboardPin['iconType']>('leaf');
  const [pinImageUrl, setPinImageUrl] = useState('');
  const [pinLinkUrl, setPinLinkUrl] = useState('');
  const [pinSelectedPalette, setPinSelectedPalette] = useState<string[]>([]);
  const [formError, setFormError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When activeEvent or selectedEventId changes, load saved config & default category
  useEffect(() => {
    if (currentEvent) {
      const savedConfig = storageService.getEventMoodboardConfig(currentEvent);
      if (savedConfig) {
        setMoodConfig(savedConfig);
        setEditingPalette(savedConfig.palette);
      }
      setFilterCategory('All');
    }
  }, [selectedEventId, currentEvent?.id]);

  // Keep selectedEventId synced if prop activeEvent changes from header
  useEffect(() => {
    if (activeEvent?.id && activeEvent.id !== selectedEventId) {
      setSelectedEventId(activeEvent.id);
    }
  }, [activeEvent?.id]);

  const handleEventSwitch = (eventId: string) => {
    setSelectedEventId(eventId);
    if (onSelectEvent) {
      onSelectEvent(eventId);
    }
  };

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Switch to a Predefined Theme
  const handleSelectTheme = (theme: EventMoodboardTheme) => {
    if (!currentEvent) return;
    const newConfig: EventMoodboardConfig = {
      eventId: currentEvent.id,
      themeId: theme.id,
      themeName: theme.name,
      themeDescription: theme.description,
      palette: [...theme.palette],
      categories: [...theme.categories],
      isCustomTheme: false,
      updatedAt: new Date().toISOString(),
    };
    storageService.saveEventMoodboardConfig(newConfig);
    setMoodConfig(newConfig);
    setEditingPalette(newConfig.palette);
    setIsThemeChooserOpen(false);
  };

  // Save Custom Theme
  const handleCreateCustomTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customThemeName.trim()) {
      alert('Please enter a theme name');
      return;
    }
    if (!currentEvent) return;

    const keywords = customThemeKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const newConfig: EventMoodboardConfig = {
      eventId: currentEvent.id,
      themeId: `custom-${Date.now()}`,
      themeName: customThemeName.trim(),
      themeDescription: customThemeDesc.trim() || 'Custom curated moodboard palette and inspiration for this celebration.',
      palette: customThemeColors,
      categories: [
        'Centerpieces & Tables',
        'Backdrops & Decor',
        'Stationery & Paper',
        'Lighting & Ambience',
        'Attire & Styling',
        'Specialty Treats',
      ],
      isCustomTheme: true,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveEventMoodboardConfig(newConfig);
    setMoodConfig(newConfig);
    setEditingPalette(newConfig.palette);
    setIsCustomThemeModalOpen(false);
  };

  // Save Palette Customizations
  const handleSavePalette = () => {
    if (!currentEvent) return;
    const updatedConfig: EventMoodboardConfig = {
      ...moodConfig,
      palette: editingPalette,
      updatedAt: new Date().toISOString(),
    };
    storageService.saveEventMoodboardConfig(updatedConfig);
    setMoodConfig(updatedConfig);
    setIsPaletteEditorOpen(false);
  };

  // Reset Palette to Theme Defaults
  const handleResetPaletteToDefault = () => {
    const predefined = PREDEFINED_THEMES.find((t) => t.id === moodConfig.themeId);
    if (predefined) {
      setEditingPalette([...predefined.palette]);
    } else {
      const fallback = getDefaultThemeForEvent(currentEvent);
      setEditingPalette([...fallback.palette]);
    }
  };

  // Palette color edits
  const handleColorChange = (index: number, newHex: string) => {
    const updated = [...editingPalette];
    updated[index] = {
      ...updated[index],
      hex: newHex,
      textDark: isColorLight(newHex),
    };
    setEditingPalette(updated);
  };

  const handleColorNameChange = (index: number, newName: string) => {
    const updated = [...editingPalette];
    updated[index] = { ...updated[index], name: newName };
    setEditingPalette(updated);
  };

  const handleAddPaletteColor = () => {
    if (editingPalette.length >= 8) {
      alert('Maximum 8 colors in palette');
      return;
    }
    const newColor: PaletteColor = {
      id: `clr-${Date.now()}`,
      name: `Accent ${editingPalette.length + 1}`,
      hex: '#B58D99',
      note: 'Custom color tone',
      textDark: false,
    };
    setEditingPalette([...editingPalette, newColor]);
  };

  const handleRemovePaletteColor = (index: number) => {
    if (editingPalette.length <= 3) {
      alert('A palette must have at least 3 colors');
      return;
    }
    setEditingPalette(editingPalette.filter((_, idx) => idx !== index));
  };

  // Image Upload Handler using FileReader data URL
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('Image size exceeds 4MB. Please choose a smaller image.');
      return;
    }

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPinImageUrl(result);
      setIsUploadingImage(false);
    };
    reader.onerror = () => {
      alert('Failed to read image file');
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  // Open Pin Modal
  const openAddPinModal = () => {
    setPinTitle('');
    setPinCategory(moodConfig.categories[0] || 'Decor');
    setPinCustomCategory('');
    setPinNotes('');
    setPinImageUrl('');
    setPinLinkUrl('');
    setPinSelectedPalette(moodConfig.palette.slice(0, 4).map((c) => c.hex));
    setPinIcon('leaf');
    setFormError('');
    setIsAddPinModalOpen(true);
  };

  // Submit Pin
  const handleCreatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinTitle.trim()) {
      setFormError('Pin title is required.');
      return;
    }
    if (!currentEvent) {
      setFormError('Please select a gathering first.');
      return;
    }

    const resolvedCategory =
      pinCategory === '__custom__' && pinCustomCategory.trim()
        ? pinCustomCategory.trim()
        : pinCategory || moodConfig.categories[0] || 'General Inspo';

    // If new category, add to event categories
    if (!moodConfig.categories.includes(resolvedCategory)) {
      const updatedConfig = {
        ...moodConfig,
        categories: [...moodConfig.categories, resolvedCategory],
      };
      storageService.saveEventMoodboardConfig(updatedConfig);
      setMoodConfig(updatedConfig);
    }

    onSavePin({
      eventId: currentEvent.id,
      title: pinTitle.trim(),
      category: resolvedCategory,
      notes: pinNotes.trim(),
      iconType: pinIcon,
      imageUrl: pinImageUrl.trim() || undefined,
      linkUrl: pinLinkUrl.trim() || undefined,
      palette: pinSelectedPalette.length > 0 ? pinSelectedPalette : moodConfig.palette.slice(0, 4).map((c) => c.hex),
      createdAt: new Date().toISOString(),
    });

    setIsAddPinModalOpen(false);
  };

  // Add Suggested Idea Directly to Board
  const handleAddSuggestedIdea = (idea: { title: string; category: string; description: string }) => {
    if (!currentEvent) return;
    onSavePin({
      eventId: currentEvent.id,
      title: idea.title,
      category: idea.category,
      notes: idea.description,
      iconType: 'sparkle',
      palette: moodConfig.palette.slice(0, 4).map((c) => c.hex),
      createdAt: new Date().toISOString(),
    });
  };

  // Filter Pins
  const eventPins = pins.filter((p) => p.eventId === currentEvent?.id);
  const displayedPins = eventPins.filter((p) => {
    return filterCategory === 'All' || p.category === filterCategory;
  });

  // Calculate luminosity helper
  function isColorLight(hexColor: string): boolean {
    const hex = hexColor.replace('#', '');
    if (hex.length !== 6) return true;
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  }

  // Predefined theme filtered list
  const filteredPredefinedThemes = PREDEFINED_THEMES.filter((t) => {
    if (themeFilterType === 'All') return true;
    return t.eventType === themeFilterType;
  });

  const availableCategories = ['All', ...moodConfig.categories];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* 1. Header & Active Gathering Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A]">
              Dynamic Design Sanctuary & Aesthetics
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
            Moodboard & Color Studio
          </h1>
          <p className="text-xs text-[#392D29]/70 dark:text-[#D7C5C0] mt-0.5 font-sans">
            Tailored visual direction, custom palettes, and inspiration pins for every gathering.
          </p>
        </div>

        {/* Gathering Switcher Bar + Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-[#FFF8EF] dark:bg-[#393438] border border-[#D6BDA5] dark:border-[#5A5055] rounded-xl px-2.5 py-1.5 shadow-xs">
            <span className="text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] shrink-0">Gathering:</span>
            <select
              value={selectedEventId}
              onChange={(e) => handleEventSwitch(e.target.value)}
              className="text-xs font-semibold bg-transparent text-[#392D29] dark:text-[#F5EDE5] focus:outline-none cursor-pointer max-w-[180px] sm:max-w-xs truncate"
            >
              {events.map((e) => (
                <option key={e.id} value={e.id} className="bg-[#FFF8EF] dark:bg-[#29272A] text-[#392D29] dark:text-[#F5EDE5]">
                  {e.name} ({e.eventType})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsThemeChooserOpen(true)}
            className="h-9 px-3 rounded-xl bg-[#4A322A] dark:bg-[#454047] hover:bg-[#392D29] dark:hover:bg-[#5A5055] text-[#FFF8EF] border border-[#777B59]/40 dark:border-[#5A5055] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Choose from predefined themes or create custom aesthetic"
          >
            <Compass className="w-3.5 h-3.5 text-[#B58D99]" />
            <span>Theme: {moodConfig.themeName.split(' ')[0]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#D6BDA5]" />
          </button>

          <button
            onClick={openAddPinModal}
            className="h-9 px-3.5 rounded-xl bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold text-xs flex items-center gap-1.5 shadow-md border border-[#A6A98A] transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Inspiration Pin</span>
          </button>
        </div>
      </div>

      {/* 2. Active Theme Hero Banner & Palette Swatches */}
      <div className="parchment-card rounded-3xl p-6 sm:p-7 relative shadow-md overflow-hidden">
        <div className="absolute top-4 left-4"><ScrewRivet /></div>
        <div className="absolute top-4 right-4"><ScrewRivet /></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#D6BDA5]/50 dark:border-[#5A5055]/50">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#777B59] text-[#FFF8EF]">
                {currentEvent?.eventType || 'Celebration'} Theme
              </span>
              {moodConfig.isCustomTheme && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#B58D99]/20 text-[#B58D99] dark:text-[#DEBAC7] border border-[#B58D99]/40">
                  Custom Curated
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
              {moodConfig.themeName}
            </h2>
            <p className="text-xs sm:text-sm text-[#392D29]/80 dark:text-[#D7C5C0] mt-1 max-w-2xl leading-relaxed">
              {moodConfig.themeDescription}
            </p>
          </div>

          {/* Theme actions: Change Theme & Customize Palette */}
          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <button
              onClick={() => setIsPaletteEditorOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs font-bold text-[#63463C] dark:text-[#F5EDE5] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
              <span>Customize Palette</span>
            </button>
            <button
              onClick={() => setIsThemeChooserOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse Themes</span>
            </button>
          </div>
        </div>

        {/* Dynamic Color Palette Swatches */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
              <span className="font-serif text-sm font-bold text-[#63463C] dark:text-[#F5EDE5]">
                Event Color Recipe ({moodConfig.palette.length} Swatches)
              </span>
            </div>
            <span className="text-[11px] text-[#777B59] dark:text-[#A6A98A] font-medium hidden sm:inline">
              Click any chip to copy Hex code
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {moodConfig.palette.map((color) => (
              <button
                key={color.id}
                onClick={() => handleCopyColor(color.hex)}
                className="p-3 rounded-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055] hover:scale-103 transition-transform text-left group relative shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#777B59] cursor-pointer"
                style={{ backgroundColor: color.hex }}
                title={`Click to copy ${color.hex}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      color.textDark ? 'text-[#392D29] bg-black/10' : 'text-[#FFF8EF] bg-white/20'
                    }`}
                  >
                    {copiedHex === color.hex ? 'Copied!' : color.hex}
                  </span>
                  {copiedHex === color.hex ? (
                    <Check className={`w-3.5 h-3.5 ${color.textDark ? 'text-[#392D29]' : 'text-[#FFF8EF]'}`} />
                  ) : (
                    <Copy className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${color.textDark ? 'text-[#392D29]' : 'text-[#FFF8EF]'}`} />
                  )}
                </div>
                <div>
                  <p className={`font-serif text-xs font-bold leading-tight ${color.textDark ? 'text-[#392D29]' : 'text-[#FFF8EF]'}`}>
                    {color.name}
                  </p>
                  {color.note && (
                    <p className={`text-[9px] truncate mt-0.5 ${color.textDark ? 'text-[#392D29]/75' : 'text-[#FFF8EF]/75'}`}>
                      {color.note}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Theme-Suggested Curated Ideas Strip */}
      {(() => {
        const matchingTheme = PREDEFINED_THEMES.find((t) => t.id === moodConfig.themeId);
        if (!matchingTheme?.suggestedIdeas || matchingTheme.suggestedIdeas.length === 0) return null;
        return (
          <div className="bg-[#FFF8EF] dark:bg-[#393438] rounded-2xl p-4 sm:p-5 border border-[#D6BDA5] dark:border-[#5A5055]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B58D99]" />
                <span className="font-serif text-base font-bold text-[#63463C] dark:text-[#F5EDE5]">
                  Curated Inspiration for {moodConfig.themeName}
                </span>
              </div>
              <span className="text-[11px] text-[#777B59] dark:text-[#A6A98A]">1-click add to your board</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {matchingTheme.suggestedIdeas.map((idea, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F4E8D9]/70 dark:bg-[#29272A]/70 border border-[#D6BDA5]/60 dark:border-[#5A5055]/60 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#777B59] dark:text-[#A6A98A] block mb-1">
                      {idea.category}
                    </span>
                    <h4 className="font-serif text-xs font-bold text-[#63463C] dark:text-[#F5EDE5] leading-snug mb-1">
                      {idea.title}
                    </h4>
                    <p className="text-[11px] text-[#392D29]/75 dark:text-[#D7C5C0] line-clamp-2 leading-relaxed">
                      {idea.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddSuggestedIdea(idea)}
                    className="mt-2.5 text-[10px] font-bold text-[#777B59] dark:text-[#A6A98A] hover:text-[#63463C] dark:hover:text-[#FFF8EF] flex items-center gap-1 transition-colors self-start cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Pin to My Board</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 4. Filter Bar (Dynamic Categories for this Event) */}
      <div className="bg-[#FFF8EF] dark:bg-[#393438] p-3.5 sm:p-4 rounded-2xl border border-[#D6BDA5] dark:border-[#5A5055] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#63463C] dark:text-[#D7C5C0]">Filter Area:</span>
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 cursor-pointer ${
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

        <div className="text-[11px] font-medium text-[#777B59] dark:text-[#A6A98A]">
          {displayedPins.length} {displayedPins.length === 1 ? 'Pin' : 'Pins'} for {currentEvent?.name}
        </div>
      </div>

      {/* 5. Inspiration Pins Grid (Supports Images, Links, & Custom Colors) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPins.map((pin) => (
          <div
            key={pin.id}
            className="parchment-card rounded-3xl overflow-hidden relative flex flex-col justify-between hover:shadow-lg transition-all border-2 border-[#D6BDA5] dark:border-[#5A5055] group"
          >
            {/* Top screws */}
            <div className="absolute top-3 left-3 z-10 pointer-events-none"><ScrewRivet /></div>
            <div className="absolute top-3 right-3 z-10 pointer-events-none"><ScrewRivet /></div>

            {/* Pin Image Preview (if uploaded or linked) */}
            {pin.imageUrl ? (
              <div className="w-full h-48 bg-[#392D29]/10 relative overflow-hidden border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
                <img
                  src={pin.imageUrl}
                  alt={pin.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-[#FFF8EF]">
                  {pin.category}
                </div>
              </div>
            ) : null}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                {!pin.imageUrl && (
                  <div className="flex items-center justify-between gap-2 mb-3 pl-3 pr-3">
                    <span className="text-[10px] font-bold bg-[#777B59] text-[#FFF8EF] px-2 py-0.5 rounded-md">
                      {pin.category}
                    </span>
                    <span className="text-[10px] font-medium text-[#777B59] dark:text-[#A6A98A]">
                      {currentEvent?.name}
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-3 mb-2.5">
                  {!pin.imageUrl && (
                    <div className="w-10 h-10 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] flex items-center justify-center shrink-0">
                      {pin.iconType === 'mushroom' ? (
                        <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
                      ) : pin.iconType === 'flower' ? (
                        <FlowerIcon className="w-5 h-5 text-[#B58D99]" />
                      ) : pin.iconType === 'camera' ? (
                        <Camera className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
                      ) : pin.iconType === 'music' ? (
                        <Music className="w-5 h-5 text-[#B58D99]" />
                      ) : pin.iconType === 'heart' ? (
                        <Heart className="w-5 h-5 text-[#B58D99]" />
                      ) : pin.iconType === 'star' ? (
                        <Star className="w-5 h-5 text-[#D4AF37]" />
                      ) : (
                        <LeafIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
                      )}
                    </div>
                  )}
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#63463C] dark:text-[#F5EDE5] leading-snug break-words">
                      {pin.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#392D29]/80 dark:text-[#D7C5C0]/80 leading-relaxed mb-4 font-sans">
                  {pin.notes}
                </p>

                {/* Pin Color Swatches */}
                {pin.palette && pin.palette.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-3">
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

              {/* Pin Footer with Link & Delete */}
              <div className="pt-3 border-t border-[#D6BDA5]/50 dark:border-[#5A5055]/50 flex items-center justify-between text-xs">
                {pin.linkUrl ? (
                  <a
                    href={pin.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#777B59] dark:text-[#A6A98A] hover:underline flex items-center gap-1 font-medium"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Inspiration Link</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-[#63463C] dark:text-[#D7C5C0] font-medium">Curated Reference</span>
                )}

                <button
                  onClick={() => onDeletePin(pin.id)}
                  className="p-1 rounded text-[#B58D99] hover:bg-[#F4E8D9] dark:hover:bg-[#29272A] transition-colors cursor-pointer"
                  title="Delete pin"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {displayedPins.length === 0 && (
          <div className="col-span-full parchment-card rounded-3xl p-12 text-center border-2 border-dashed border-[#D6BDA5] dark:border-[#5A5055]">
            <Sparkles className="w-12 h-12 text-[#777B59] dark:text-[#A6A98A] mx-auto mb-3" />
            <h3 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">
              No Moodboard Pins Yet for {currentEvent?.name}
            </h3>
            <p className="text-xs text-[#392D29]/70 dark:text-[#D7C5C0]/80 max-w-sm mx-auto mb-4">
              Add your first photo, floral palette, tablescape reference, or design cue for this celebration.
            </p>
            <button
              onClick={openAddPinModal}
              className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
            >
              Create Inspiration Pin
            </button>
          </div>
        )}
      </div>

      {/* --- MODAL 1: Theme Chooser & Predefined Themes Catalog --- */}
      {isThemeChooserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#392D29]/60 dark:bg-black/75 backdrop-blur-xs font-sans">
          <div className="parchment-card rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055]">
            <div className="absolute top-4 left-4"><ScrewRivet /></div>
            <div className="absolute top-4 right-4"><ScrewRivet /></div>

            <button
              onClick={() => setIsThemeChooserOpen(false)}
              className="absolute top-4 right-10 p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A]">
                Theme Selector for {currentEvent?.name}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5] mt-0.5">
                Choose Aesthetic Theme
              </h2>
              <p className="text-xs text-[#392D29]/75 dark:text-[#D7C5C0] mt-1">
                Selecting a theme updates color swatches, styling ideas, and relevant categories for this event.
              </p>
            </div>

            {/* Filter by Event Type Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 mb-5 pb-3 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60 text-xs">
              {['All', 'Wedding', 'Birthday', 'Corporate', 'Baby Shower', 'College Fest', 'Festival'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setThemeFilterType(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    themeFilterType === cat
                      ? 'bg-[#777B59] text-[#FFF8EF]'
                      : 'bg-[#FFF8EF] dark:bg-[#29272A] text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9]'
                  }`}
                >
                  {cat}
                </button>
              ))}

              <button
                onClick={() => {
                  setIsThemeChooserOpen(false);
                  setIsCustomThemeModalOpen(true);
                }}
                className="ml-auto px-3 py-1.5 rounded-xl bg-[#B58D99] hover:bg-[#a27b87] text-[#FFF8EF] font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Custom Theme</span>
              </button>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPredefinedThemes.map((theme) => {
                const isCurrent = moodConfig.themeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                      isCurrent
                        ? 'border-[#777B59] bg-[#777B59]/10 dark:bg-[#777B59]/20 shadow-md'
                        : 'border-[#D6BDA5] dark:border-[#5A5055] bg-[#FFF8EF] dark:bg-[#29272A] hover:border-[#777B59] hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#777B59] text-[#FFF8EF]">
                          {theme.eventType}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-[#777B59] dark:text-[#A6A98A] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Active Theme</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-base font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">
                        {theme.name}
                      </h3>
                      <p className="text-xs text-[#392D29]/75 dark:text-[#D7C5C0] line-clamp-2 leading-relaxed mb-3">
                        {theme.description}
                      </p>
                    </div>

                    <div>
                      {/* Color strip preview */}
                      <div className="flex items-center gap-1 mb-2.5">
                        {theme.palette.map((c) => (
                          <div
                            key={c.id}
                            className="h-4 flex-1 rounded-sm border border-black/10"
                            style={{ backgroundColor: c.hex }}
                            title={`${c.name} (${c.hex})`}
                          />
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {theme.moodKeywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-[#F4E8D9] dark:bg-[#393438] text-[#63463C] dark:text-[#D7C5C0] font-medium"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Create Custom Theme --- */}
      {isCustomThemeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#392D29]/60 dark:bg-black/75 backdrop-blur-xs font-sans">
          <div className="parchment-card rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055]">
            <div className="absolute top-4 left-4"><ScrewRivet /></div>
            <div className="absolute top-4 right-4"><ScrewRivet /></div>

            <button
              onClick={() => setIsCustomThemeModalOpen(false)}
              className="absolute top-4 right-10 p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">
              Create Custom Aesthetic Theme
            </h2>
            <p className="text-xs text-[#392D29]/75 dark:text-[#D7C5C0] mb-4">
              Design a unique theme and palette tailored specifically for {currentEvent?.name}.
            </p>

            <form onSubmit={handleCreateCustomTheme} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">
                  Theme Name <span className="text-[#B58D99]">*</span>
                </label>
                <input
                  type="text"
                  value={customThemeName}
                  onChange={(e) => setCustomThemeName(e.target.value)}
                  placeholder="e.g. Celestial Starlight & Midnight Velvet"
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">Theme Vision & Description</label>
                <textarea
                  rows={2}
                  value={customThemeDesc}
                  onChange={(e) => setCustomThemeDesc(e.target.value)}
                  placeholder="Describe textures, fabrics, floral types, or mood..."
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">Mood Keywords (comma separated)</label>
                <input
                  type="text"
                  value={customThemeKeywords}
                  onChange={(e) => setCustomThemeKeywords(e.target.value)}
                  placeholder="e.g. Ethereal, Indigo, Starry, Gold"
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                />
              </div>

              {/* Color Palette Builder */}
              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-2">Palette Colors (Click chip to pick color)</label>
                <div className="space-y-2">
                  {customThemeColors.map((color, idx) => (
                    <div key={color.id} className="flex items-center gap-2 p-2 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055]">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => {
                          const updated = [...customThemeColors];
                          updated[idx] = { ...updated[idx], hex: e.target.value };
                          setCustomThemeColors(updated);
                        }}
                        className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => {
                          const updated = [...customThemeColors];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setCustomThemeColors(updated);
                        }}
                        placeholder="Color name"
                        className="flex-1 p-1.5 rounded-lg bg-transparent border-0 font-medium text-xs text-[#392D29] dark:text-[#F5EDE5]"
                      />
                      <span className="font-mono text-[11px] text-[#777B59] dark:text-[#A6A98A]">{color.hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
                <button
                  type="button"
                  onClick={() => setIsCustomThemeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#D7C5C0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-5 py-2.5 rounded-xl text-xs shadow-md"
                >
                  Apply Custom Theme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: Palette Editor (Edit every color, add/remove colors) --- */}
      {isPaletteEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#392D29]/60 dark:bg-black/75 backdrop-blur-xs font-sans">
          <div className="parchment-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055]">
            <div className="absolute top-4 left-4"><ScrewRivet /></div>
            <div className="absolute top-4 right-4"><ScrewRivet /></div>

            <button
              onClick={() => setIsPaletteEditorOpen(false)}
              className="absolute top-4 right-10 p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">
              Customize Color Palette
            </h2>
            <p className="text-xs text-[#392D29]/75 dark:text-[#D7C5C0] mb-4">
              Fine-tune the individual color swatches for {moodConfig.themeName}.
            </p>

            <div className="space-y-3 mb-5">
              {editingPalette.map((col, idx) => (
                <div
                  key={col.id}
                  className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055]"
                >
                  <input
                    type="color"
                    value={col.hex}
                    onChange={(e) => handleColorChange(idx, e.target.value)}
                    className="w-9 h-9 rounded-xl border-0 cursor-pointer p-0 shrink-0"
                    title="Click to open color picker"
                  />
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) => handleColorNameChange(idx, e.target.value)}
                      className="w-full text-xs font-bold text-[#63463C] dark:text-[#F5EDE5] bg-transparent border-0 p-0 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={col.hex}
                      onChange={(e) => handleColorChange(idx, e.target.value)}
                      className="w-24 text-[10px] font-mono text-[#777B59] dark:text-[#A6A98A] bg-transparent border-0 p-0 focus:outline-none uppercase"
                    />
                  </div>
                  <button
                    onClick={() => handleRemovePaletteColor(idx)}
                    className="p-1 rounded text-[#B58D99] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]"
                    title="Remove color"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddPaletteColor}
                  className="px-3 py-1.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] font-bold text-[#63463C] dark:text-[#F5EDE5] hover:bg-[#F4E8D9] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Color</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetPaletteToDefault}
                  className="px-2.5 py-1.5 rounded-xl text-[#777B59] dark:text-[#A6A98A] hover:bg-[#F4E8D9] flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaletteEditorOpen(false)}
                  className="px-3 py-1.5 rounded-xl font-bold text-[#63463C] dark:text-[#D7C5C0]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePalette}
                  className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2 rounded-xl shadow-md"
                >
                  Save Palette
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: Add Inspiration Pin with Image Upload --- */}
      {isAddPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#392D29]/60 dark:bg-black/75 backdrop-blur-xs font-sans">
          <div className="parchment-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055]">
            <div className="absolute top-4 left-4"><ScrewRivet /></div>
            <div className="absolute top-4 right-4"><ScrewRivet /></div>

            <button
              onClick={() => setIsAddPinModalOpen(false)}
              className="absolute top-4 right-10 p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">
              Add Inspiration Pin
            </h2>
            <p className="text-xs text-[#392D29]/75 dark:text-[#D7C5C0] mb-4">
              Saving to: <strong className="text-[#777B59] dark:text-[#A6A98A]">{currentEvent?.name}</strong>
            </p>

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

              {/* Category Picker (Dynamic based on active theme) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">Category Area</label>
                  <select
                    value={pinCategory}
                    onChange={(e) => setPinCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  >
                    {moodConfig.categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom__">+ Custom Category...</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">Botanical Icon</label>
                  <select
                    value={pinIcon}
                    onChange={(e) => setPinIcon(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  >
                    <option value="leaf">Fern & Leaf</option>
                    <option value="mushroom">Mushroom</option>
                    <option value="flower">Wildflower</option>
                    <option value="sparkle">Beeswax Sparkle</option>
                    <option value="star">Starlight</option>
                    <option value="camera">Photography</option>
                    <option value="music">Acoustic / DJ</option>
                  </select>
                </div>
              </div>

              {pinCategory === '__custom__' && (
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">Enter Custom Category</label>
                  <input
                    type="text"
                    value={pinCustomCategory}
                    onChange={(e) => setPinCustomCategory(e.target.value)}
                    placeholder="e.g. Stage AV & Pyrotechnics"
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  />
                </div>
              )}

              {/* Image Upload / URL Section */}
              <div className="p-3.5 rounded-2xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#63463C] dark:text-[#F5EDE5] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                    <span>Inspiration Photo or Sketch</span>
                  </span>
                  <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A]">Upload or Paste Link</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="px-3 py-2 rounded-xl bg-[#777B59]/15 dark:bg-[#777B59]/25 hover:bg-[#777B59]/25 border border-[#777B59]/30 text-xs font-bold text-[#63463C] dark:text-[#F5EDE5] flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                    <span>{isUploadingImage ? 'Reading...' : 'Upload Image'}</span>
                  </button>

                  <input
                    type="url"
                    value={pinImageUrl}
                    onChange={(e) => setPinImageUrl(e.target.value)}
                    placeholder="or paste image URL..."
                    className="flex-1 p-2 rounded-xl bg-[#F4E8D9] dark:bg-[#393438] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none"
                  />
                </div>

                {pinImageUrl && (
                  <div className="relative rounded-xl overflow-hidden h-32 w-full border border-[#D6BDA5] dark:border-[#5A5055]">
                    <img src={pinImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPinImageUrl('')}
                      className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white hover:bg-black"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Reference Link */}
              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">
                  External Reference Link (optional)
                </label>
                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777B59] dark:text-[#A6A98A]" />
                  <input
                    type="url"
                    value={pinLinkUrl}
                    onChange={(e) => setPinLinkUrl(e.target.value)}
                    placeholder="https://pinterest.com/pin/... or vendor catalog link"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">
                  Styling Notes & Textures
                </label>
                <textarea
                  rows={2}
                  value={pinNotes}
                  onChange={(e) => setPinNotes(e.target.value)}
                  placeholder="Materials, textures, floral species, vendor notes..."
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
                <button
                  type="button"
                  onClick={() => setIsAddPinModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#D7C5C0]"
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
