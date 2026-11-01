import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  CheckSquare,
  DollarSign,
  Users,
  Compass,
  Palette,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  Home,
  ShieldCheck,
  User,
  RotateCcw,
  Sun,
  Moon,
  Globe,
  Settings,
  LogOut,
  Check,
  CalendarDays,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon } from '../common/WoodlandIcons';
import { EventItem, UserProfile } from '../../types';
import { isSupabaseConfigured } from '../../services/supabase';
import { useCurrency } from '../../hooks/useCurrency';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  events: EventItem[];
  activeEvent: EventItem | undefined;
  onSelectEvent: (eventId: string) => void;
  onOpenCreateEvent: () => void;
  user: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onOpenSettings: (tab?: 'currency' | 'profile') => void;
  onOpenAuth: () => void;
  onResetData: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const AVAILABLE_PROFILES: UserProfile[] = [
  {
    id: 'usr-forest-lead-1',
    email: 'bhumikadevnath@gmail.com',
    displayName: 'Bhumika Devnath',
    role: 'Lead Floral & Event Stylist',
    avatarSeed: 'woodland-owl',
  },
  {
    id: 'usr-coordinator-2',
    email: 'julian.thorne@foresthaven.org',
    displayName: 'Julian Thorne',
    role: 'Senior Wedding Coordinator',
    avatarSeed: 'woodland-stag',
  },
  {
    id: 'usr-host-3',
    email: 'lyra.hawthorne@meadows.net',
    displayName: 'Lyra Hawthorne',
    role: 'Private Estate Host',
    avatarSeed: 'woodland-fox',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  events,
  activeEvent,
  onSelectEvent,
  onOpenCreateEvent,
  user,
  onSelectUser,
  onOpenSettings,
  onOpenAuth,
  onResetData,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { activeCountry, activeCurrency } = useCurrency();

  // Refs for click outside handling
  const userMenuRef = useRef<HTMLDivElement>(null);
  const eventMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (eventMenuRef.current && !eventMenuRef.current.contains(event.target as Node)) {
        setEventDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setEventDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'events', label: 'Events & Calendar', icon: CalendarDays },
    { id: 'planner', label: 'AI Planner', icon: Sparkles, highlight: true },
    { id: 'tasks', label: 'Checklist', icon: CheckSquare },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'moodboard', label: 'Inspo', icon: Palette },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleProfileSelect = (p: UserProfile) => {
    onSelectUser(p);
    setUserDropdownOpen(false);
  };

  const handleSignOut = () => {
    const guestUser: UserProfile = {
      id: 'usr-guest',
      email: 'guest@mossmoments.com',
      displayName: 'Woodland Guest',
      role: 'Guest Organizer',
      avatarSeed: 'woodland-guest',
    };
    onSelectUser(guestUser);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 px-3 pt-2 pb-1 bg-[#F4E8D9]/95 dark:bg-[#29272A]/95 backdrop-blur-xs border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Carved wood signboard navigation header (overflow-visible to prevent clipping dropdowns) */}
        <div className="wood-signboard rounded-2xl px-4 py-2.5 flex items-center justify-between text-[#FFF8EF] dark:text-[#F5EDE5] relative shadow-lg border border-[#4A322A] dark:border-[#5A5055]">
          {/* Rivets in corners */}
          <div className="absolute top-2 left-2 pointer-events-none">
            <ScrewRivet />
          </div>
          <div className="absolute top-2 right-2 pointer-events-none">
            <ScrewRivet />
          </div>
          <div className="absolute bottom-2 left-2 pointer-events-none">
            <ScrewRivet />
          </div>
          <div className="absolute bottom-2 right-2 pointer-events-none">
            <ScrewRivet />
          </div>

          {/* Left: Brand wordmark & subtitle */}
          <div className="flex items-center gap-3 pl-3">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2.5 text-left group transition-transform active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58D99] rounded-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-[#777B59] border border-[#A6A98A]/70 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                <MushroomIcon className="w-6 h-6 text-[#FFF8EF]" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#FFF8EF] dark:text-[#F5EDE5] block leading-none">
                  Moss & Moments
                </span>
                <span className="text-[11px] font-medium text-[#D6BDA5] dark:text-[#D7C5C0] block leading-none mt-1 tracking-wide">
                  Little details. Beautifully planned moments.
                </span>
              </div>
            </button>
          </div>

          {/* Center: Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#4A322A]/80 dark:bg-[#29272A]/90 p-1 rounded-xl border border-[#392D29]/60 dark:border-[#5A5055] shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans flex items-center gap-1.5 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B58D99] cursor-pointer ${
                    isActive
                      ? 'bg-[#777B59] text-[#FFF8EF] font-bold shadow-md border border-[#A6A98A]/50 scale-102'
                      : 'text-[#D6BDA5] hover:text-[#FFF8EF] hover:bg-[#63463C]/60 dark:text-[#D7C5C0] dark:hover:text-[#F5EDE5] dark:hover:bg-[#454047]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight && !isActive ? 'text-[#B58D99]' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Event Switcher + Prominent New Event CTA + Currency Badge + Theme Toggle + User Account Menu */}
          <div className="flex items-center gap-2 pr-3">
            {/* Active event dropdown */}
            {events.length > 0 && (
              <div className="relative hidden sm:block" ref={eventMenuRef}>
                <button
                  onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                  className="bg-[#4A322A] dark:bg-[#454047] hover:bg-[#392D29] dark:hover:bg-[#5A5055] text-[#FFF8EF] dark:text-[#F5EDE5] border border-[#777B59]/40 dark:border-[#5A5055] rounded-xl px-2.5 py-1.5 text-xs font-medium flex items-center gap-2 max-w-[190px] shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B58D99] cursor-pointer"
                  title="Switch current event workspace"
                  aria-expanded={eventDropdownOpen}
                >
                  <span className="w-2 h-2 rounded-full bg-[#777B59] shrink-0" />
                  <span className="truncate font-sans">{activeEvent ? activeEvent.name : 'Select Event'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#D6BDA5] dark:text-[#D7C5C0] shrink-0" />
                </button>

                {eventDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-[#FFF8EF] dark:bg-[#393438] rounded-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055] shadow-2xl text-[#392D29] dark:text-[#F5EDE5] py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3.5 py-1.5 text-[11px] font-bold font-serif text-[#63463C] dark:text-[#D7C5C0] uppercase tracking-wider border-b border-[#D6BDA5]/40 dark:border-[#5A5055]/50 mb-1">
                      Active Event Workspace
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {events.map((evt) => (
                        <button
                          key={evt.id}
                          onClick={() => {
                            onSelectEvent(evt.id);
                            setEventDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-start gap-2.5 hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors cursor-pointer ${
                            activeEvent?.id === evt.id
                              ? 'bg-[#F4E8D9] dark:bg-[#454047] font-bold text-[#63463C] dark:text-[#F5EDE5]'
                              : ''
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              evt.status === 'Confirmed' ? 'bg-[#777B59]' : 'bg-[#B58D99]'
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-sans font-medium">{evt.name}</p>
                            <p className="text-[10px] text-[#777B59] dark:text-[#A6A98A] font-mono">{evt.eventDate || 'No date set'}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-[#D6BDA5]/40 dark:border-[#5A5055]/50 pt-1.5 mt-1 px-2.5">
                      <button
                        onClick={() => {
                          setEventDropdownOpen(false);
                          onOpenCreateEvent();
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-[#777B59] dark:text-[#A6A98A] font-bold hover:bg-[#F4E8D9] dark:hover:bg-[#454047] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Create New Event</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Prominent New Event CTA Button */}
            <button
              onClick={onOpenCreateEvent}
              className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold text-xs px-3.5 py-1.5 rounded-xl border border-[#A6A98A] shadow-md flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF8EF] cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#FFF8EF]" />
              <span className="hidden sm:inline">New Event</span>
            </button>

            {/* Country & Currency Quick Indicator Button */}
            <button
              onClick={() => onOpenSettings('currency')}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#4A322A] dark:bg-[#454047] border border-[#777B59]/40 dark:border-[#5A5055] text-xs font-mono font-medium text-[#FFF8EF] dark:text-[#F5EDE5] hover:bg-[#392D29] dark:hover:bg-[#5A5055] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B58D99] cursor-pointer"
              title={`Active Currency: ${activeCurrency.name} (${activeCurrency.code}). Click to change region & currency.`}
              aria-label="Country and Currency Settings"
            >
              <span>{activeCountry.flag}</span>
              <span className="font-bold">{activeCurrency.code}</span>
            </button>

            {/* Theme Toggle (Sun for Light, Moon for Dark) */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-xl bg-[#4A322A] dark:bg-[#454047] border border-[#777B59]/40 dark:border-[#5A5055] text-[#FFF8EF] dark:text-[#F5EDE5] hover:bg-[#392D29] dark:hover:bg-[#5A5055] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58D99] cursor-pointer"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode (Cozy Parchment)' : 'Switch to dark mode (Warm Vintage Evening)'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#D7C5C0] hover:text-[#FFF8EF] transition-colors" />
              ) : (
                <Moon className="w-4 h-4 text-[#D6BDA5] hover:text-[#FFF8EF] transition-colors" />
              )}
            </button>

            {/* TASK 1: Fixed Profile Selection & Account Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-[#4A322A] dark:bg-[#454047] border border-[#777B59]/50 dark:border-[#5A5055] text-[#FFF8EF] hover:bg-[#392D29] dark:hover:bg-[#5A5055] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58D99] cursor-pointer"
                title={`Active Organizer: ${user.displayName}`}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                aria-label="Account and Profile Menu"
              >
                <div className="w-7 h-7 rounded-lg bg-[#777B59] text-[#FFF8EF] flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.displayName.charAt(0)}
                </div>
                <div className="hidden xl:block text-left text-xs leading-none">
                  <span className="font-bold block truncate max-w-[100px] text-[#FFF8EF] dark:text-[#F5EDE5]">
                    {user.displayName.split(' ')[0]}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#D6BDA5] dark:text-[#D7C5C0] shrink-0" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#FFF8EF] dark:bg-[#393438] rounded-3xl border-2 border-[#D6BDA5] dark:border-[#5A5055] shadow-2xl text-[#392D29] dark:text-[#F5EDE5] p-3.5 z-50 animate-in fade-in zoom-in-95">
                  {/* Active Profile Info Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[#D6BDA5]/50 dark:border-[#5A5055]/50">
                    <div className="w-10 h-10 rounded-2xl bg-[#777B59] text-[#FFF8EF] flex items-center justify-center font-bold text-sm shadow-sm">
                      {user.displayName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-[#63463C] dark:text-[#F5EDE5] truncate">
                        {user.displayName}
                      </p>
                      <p className="text-[10px] text-[#777B59] dark:text-[#A6A98A] font-medium truncate">
                        {user.role}
                      </p>
                      <p className="text-[10px] text-[#392D29]/60 dark:text-[#B7A9A6] truncate">
                        {user.email}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#777B59]/15 text-[#777B59] dark:text-[#A6A98A] border border-[#777B59]/30">
                      Active
                    </span>
                  </div>

                  {/* Profile / Workspace Switcher Section */}
                  <div className="py-2.5">
                    <span className="text-[10px] font-bold font-serif uppercase tracking-wider text-[#777B59] dark:text-[#A6A98A] block mb-1.5">
                      Switch Organizer Workspace
                    </span>
                    <div className="space-y-1">
                      {AVAILABLE_PROFILES.map((p) => {
                        const isSelected = user.id === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => handleProfileSelect(p)}
                            className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#777B59] text-[#FFF8EF] font-bold shadow-xs'
                                : 'hover:bg-[#F4E8D9] dark:hover:bg-[#454047] text-[#63463C] dark:text-[#D7C5C0]'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                  isSelected ? 'bg-[#FFF8EF] text-[#777B59]' : 'bg-[#777B59] text-[#FFF8EF]'
                                }`}
                              >
                                {p.displayName.charAt(0)}
                              </span>
                              <div className="truncate">
                                <span className="block truncate">{p.displayName}</span>
                                <span className={`text-[9px] block ${isSelected ? 'text-[#FFF8EF]/80' : 'text-[#777B59] dark:text-[#A6A98A]'}`}>
                                  {p.role}
                                </span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#FFF8EF] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Account Menu Actions */}
                  <div className="pt-2 border-t border-[#D6BDA5]/50 dark:border-[#5A5055]/50 space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenSettings('profile');
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-[#63463C] dark:text-[#F5EDE5] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] rounded-xl flex items-center justify-between font-medium transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                        <span>My Profile & Account</span>
                      </div>
                      <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A]">Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenSettings('currency');
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-[#63463C] dark:text-[#F5EDE5] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] rounded-xl flex items-center justify-between font-medium transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                        <span>Currency & Region</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#777B59] dark:text-[#A6A98A]">
                        {activeCountry.flag} {activeCurrency.code}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-[#63463C] dark:text-[#F5EDE5] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] rounded-xl flex items-center justify-between font-medium transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                        <span>{isSupabaseConfigured ? 'Supabase Auth' : 'Woodland Vault Login'}</span>
                      </div>
                      <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A]">Auth</span>
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-2.5 py-1.5 text-[#B58D99] dark:text-[#DEBAC7] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] rounded-xl flex items-center gap-2 font-medium transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out (Guest Mode)</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (window.confirm('Reset events, tasks, budget and guests back to default woodland showcase data?')) {
                          onResetData();
                        }
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-[#B7A9A6] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] rounded-xl flex items-center gap-2 font-medium transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Sample Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl bg-[#4A322A] dark:bg-[#454047] text-[#FFF8EF] hover:bg-[#392D29] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B58D99] cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-[#FFF8EF] dark:bg-[#393438] border-2 border-[#D6BDA5] dark:border-[#5A5055] rounded-2xl p-3.5 shadow-xl text-[#392D29] dark:text-[#F5EDE5]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`p-2.5 rounded-xl text-xs font-medium font-sans flex items-center gap-2 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#777B59] text-[#FFF8EF] font-bold'
                        : 'text-[#63463C] dark:text-[#F5EDE5] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Country & Currency button */}
            <div className="mt-3 pt-3 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSettings('currency');
                }}
                className="flex items-center gap-1.5 text-xs text-[#63463C] dark:text-[#F5EDE5] font-bold"
              >
                <Globe className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
                <span>Region & Currency: {activeCountry.flag} {activeCurrency.code}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSettings('profile');
                }}
                className="text-xs font-bold text-[#777B59] dark:text-[#A6A98A]"
              >
                Profile Settings
              </button>
            </div>

            {events.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#63463C] dark:text-[#D7C5C0]">Active Event:</span>
                <select
                  value={activeEvent?.id || ''}
                  onChange={(e) => onSelectEvent(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5]"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
