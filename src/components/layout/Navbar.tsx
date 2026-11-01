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
  Sun,
  Moon,
  Globe,
  LogOut,
  CalendarDays,
  Sparkle,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon } from '../common/WoodlandIcons';
import { EventItem, UserProfile } from '../../types';
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
  onOpenSettings: (tab?: 'currency' | 'profile' | 'security') => void;
  onOpenAuth: () => void;
  onResetData: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

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
  theme,
  onToggleTheme,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { activeCountry, activeCurrency } = useCurrency();

  // Distinct refs for desktop and mobile trigger areas
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileUserMenuRef = useRef<HTMLDivElement>(null);
  const eventMenuRef = useRef<HTMLDivElement>(null);
  const mobileEventMenuRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);

  // Exclusive toggle handlers: opening one closes any other overlay
  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => {
      if (!prev) {
        setEventDropdownOpen(false);
        setMenuOpen(false);
      }
      return !prev;
    });
  };

  const toggleEventDropdown = () => {
    setEventDropdownOpen((prev) => {
      if (!prev) {
        setUserDropdownOpen(false);
        setMenuOpen(false);
      }
      return !prev;
    });
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      if (!prev) {
        setUserDropdownOpen(false);
        setEventDropdownOpen(false);
      }
      return !prev;
    });
  };

  // Close menus on click outside & Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // User dropdown
      const inUserMenu = userMenuRef.current?.contains(target);
      const inMobileUserMenu = mobileUserMenuRef.current?.contains(target);
      if (!inUserMenu && !inMobileUserMenu) {
        setUserDropdownOpen(false);
      }

      // Event dropdown
      const inEventMenu = eventMenuRef.current?.contains(target);
      const inMobileEventMenu = mobileEventMenuRef.current?.contains(target);
      if (!inEventMenu && !inMobileEventMenu) {
        setEventDropdownOpen(false);
      }

      // Drawer
      const inDrawer = drawerRef.current?.contains(target);
      const inMenuBtn = menuBtnRef.current?.contains(target);
      const inMobileMenuBtn = mobileMenuBtnRef.current?.contains(target);
      if (!inDrawer && !inMenuBtn && !inMobileMenuBtn) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setEventDropdownOpen(false);
        setMenuOpen(false);
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
    {
      id: 'landing',
      label: 'Home',
      description: 'Welcome & showcase',
      icon: Home,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Metrics & activity',
      icon: Compass,
    },
    {
      id: 'events',
      label: 'Events & Calendar',
      description: 'Monthly schedule & list',
      icon: CalendarDays,
    },
    {
      id: 'planner',
      label: 'AI Planner',
      description: 'GenAI plans & themes',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'tasks',
      label: 'Checklist',
      description: 'Tasks & deadlines',
      icon: CheckSquare,
    },
    {
      id: 'budget',
      label: 'Budget Tracker',
      description: 'Expenses & analytics',
      icon: DollarSign,
    },
    {
      id: 'guests',
      label: 'Guests',
      description: 'RSVPs & tables',
      icon: Users,
    },
    {
      id: 'timeline',
      label: 'Timeline',
      description: 'Day-of itinerary',
      icon: Calendar,
    },
    {
      id: 'moodboard',
      label: 'Inspo Sanctuary',
      description: 'Color swatches & pins',
      icon: Palette,
    },
    {
      id: 'team',
      label: 'Team & Circle',
      description: 'Collaborators & roles',
      icon: Users,
    },
  ];

  const activeNavItem = navItems.find((item) => item.id === activeTab) || navItems[0];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMenuOpen(false);
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

  // Reusable Event Dropdown Content (floating overlay)
  const renderEventDropdownContent = () => (
    <div
      className="fixed left-2.5 right-2.5 top-[84px] sm:absolute sm:top-full sm:left-0 sm:right-auto sm:mt-2 sm:w-72 max-w-sm mx-auto sm:mx-0 bg-[#FFF8EF] dark:bg-[#393438] rounded-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055] shadow-2xl text-[#392D29] dark:text-[#F5EDE5] py-2 z-50 animate-in fade-in zoom-in-95 max-h-[calc(100vh-100px)] overflow-y-auto"
      style={{
        boxShadow: '0 16px 40px -4px rgba(57, 45, 41, 0.4), 0 6px 16px rgba(0,0,0,0.2)',
      }}
    >
      <div className="px-3.5 py-1.5 text-[11px] font-bold font-serif text-[#63463C] dark:text-[#D7C5C0] uppercase tracking-wider border-b border-[#D6BDA5]/40 dark:border-[#5A5055]/50 mb-1">
        Active Gathering
      </div>
      <div className="max-h-56 overflow-y-auto divide-y divide-[#D6BDA5]/30 dark:divide-[#5A5055]/40">
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
              <p className="text-[10px] text-[#777B59] dark:text-[#A6A98A] font-mono">{evt.eventDate || 'Upcoming'}</p>
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
  );

  // Reusable Profile Dropdown Content (floating overlay)
  const renderProfileDropdownContent = () => (
    <div
      className="fixed left-2.5 right-2.5 top-[80px] sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-80 max-w-sm mx-auto sm:mx-0 bg-[#FFF8EF] dark:bg-[#393438] rounded-3xl border-2 border-[#D6BDA5] dark:border-[#5A5055] shadow-2xl text-[#392D29] dark:text-[#F5EDE5] p-3.5 sm:p-4 z-50 animate-in fade-in zoom-in-95 relative max-h-[calc(100vh-90px)] overflow-y-auto"
      style={{
        boxShadow: '0 16px 40px -4px rgba(57, 45, 41, 0.4), 0 6px 16px rgba(0,0,0,0.2)',
      }}
    >

      {/* Decorative Rivets */}
      <div className="absolute top-3 left-3 pointer-events-none opacity-80">
        <ScrewRivet />
      </div>
      <div className="absolute top-3 right-3 pointer-events-none opacity-80">
        <ScrewRivet />
      </div>

      {/* 1. PROFILE HEADER */}
      <div className="pb-3 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60 pt-0.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#777B59] text-[#FFF8EF] flex items-center justify-center font-bold text-sm sm:text-base shadow-xs shrink-0 ring-2 ring-[#D6BDA5]/60 dark:ring-[#5A5055]">
            {user.displayName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#392D29] dark:text-[#F5EDE5] leading-tight truncate">
              {user.displayName}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-[#63463C]/80 dark:text-[#D7C5C0] truncate mt-0.5 font-sans">
              {user.email}
            </p>
            <p className="text-[9px] sm:text-[10px] text-[#777B59] dark:text-[#A6A98A] font-medium truncate mt-0.5">
              {user.role}
            </p>
          </div>
        </div>

        {/* Account Status */}
        <div className="mt-2.5 pt-2 border-t border-[#D6BDA5]/40 dark:border-[#5A5055]/40 flex items-center justify-between text-[10px] sm:text-[11px]">
          <span className="text-[#63463C]/75 dark:text-[#D7C5C0] font-sans">
            Account Status:
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#777B59]/15 text-[#777B59] dark:text-[#A6A98A] border border-[#777B59]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#777B59] dark:bg-[#A6A98A] animate-pulse" />
            Active Planner
          </span>
        </div>
      </div>

      {/* 2. MY ACCOUNT */}
      <div className="py-2.5 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#777B59] dark:text-[#A6A98A] block px-1 mb-1.5 font-sans">
          My Account
        </span>
        <div className="space-y-1">
          {/* My Profile */}
          <button
            onClick={() => {
              setUserDropdownOpen(false);
              onOpenSettings('profile');
            }}
            className="w-full text-left p-2 rounded-xl text-xs hover:bg-[#F4E8D9] dark:hover:bg-[#454047] text-[#63463C] dark:text-[#F5EDE5] flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5]/50 dark:border-[#5A5055] flex items-center justify-center text-[#777B59] dark:text-[#A6A98A] shrink-0 group-hover:scale-105 transition-transform">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="font-bold text-xs text-[#392D29] dark:text-[#F5EDE5] block">
                  My Profile
                </span>
                <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A] block truncate">
                  Personal details & role
                </span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#777B59] dark:text-[#A6A98A] px-2 py-0.5 rounded-md bg-[#777B59]/10 group-hover:bg-[#777B59] group-hover:text-[#FFF8EF] transition-colors">
              Edit
            </span>
          </button>

          {/* My Events */}
          <button
            onClick={() => {
              setUserDropdownOpen(false);
              setActiveTab('events');
            }}
            className="w-full text-left p-2 rounded-xl text-xs hover:bg-[#F4E8D9] dark:hover:bg-[#454047] text-[#63463C] dark:text-[#F5EDE5] flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5]/50 dark:border-[#5A5055] flex items-center justify-center text-[#777B59] dark:text-[#A6A98A] shrink-0 group-hover:scale-105 transition-transform">
                <CalendarDays className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="font-bold text-xs text-[#392D29] dark:text-[#F5EDE5] block">
                  My Events
                </span>
                <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A] block truncate">
                  {events.length} celebrations planned
                </span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#777B59] dark:text-[#A6A98A] px-2 py-0.5 rounded-md bg-[#777B59]/10 group-hover:bg-[#777B59] group-hover:text-[#FFF8EF] transition-colors">
              View
            </span>
          </button>

          {/* My Team & Collaborators */}
          <button
            onClick={() => {
              setUserDropdownOpen(false);
              setActiveTab('team');
            }}
            className="w-full text-left p-2 rounded-xl text-xs hover:bg-[#F4E8D9] dark:hover:bg-[#454047] text-[#63463C] dark:text-[#F5EDE5] flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5]/50 dark:border-[#5A5055] flex items-center justify-center text-[#777B59] dark:text-[#A6A98A] shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="font-bold text-xs text-[#392D29] dark:text-[#F5EDE5] block">
                  My Team & Collaborators
                </span>
                <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A] block truncate">
                  Roles & section access
                </span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#777B59] dark:text-[#A6A98A] px-2 py-0.5 rounded-md bg-[#777B59]/10 group-hover:bg-[#777B59] group-hover:text-[#FFF8EF] transition-colors">
              Manage
            </span>
          </button>

          {/* Currency & Region */}
          <button
            onClick={() => {
              setUserDropdownOpen(false);
              onOpenSettings('currency');
            }}
            className="w-full text-left p-2 rounded-xl text-xs hover:bg-[#F4E8D9] dark:hover:bg-[#454047] text-[#63463C] dark:text-[#F5EDE5] flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5]/50 dark:border-[#5A5055] flex items-center justify-center text-[#777B59] dark:text-[#A6A98A] shrink-0 group-hover:scale-105 transition-transform">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="font-bold text-xs text-[#392D29] dark:text-[#F5EDE5] block">
                  Currency & Region
                </span>
                <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A] block truncate">
                  {activeCountry.name}
                </span>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-[#63463C] dark:text-[#F5EDE5] bg-[#F4E8D9] dark:bg-[#29272A] px-2 py-0.5 rounded-lg border border-[#D6BDA5]/60 dark:border-[#5A5055]">
              {activeCountry.flag} {activeCurrency.code}
            </span>
          </button>
        </div>
      </div>

      {/* 3. PREFERENCES */}
      <div className="py-2.5 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#777B59] dark:text-[#A6A98A] block px-1 mb-1.5 font-sans">
          Preferences
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleTheme();
          }}
          className="w-full text-left p-2 rounded-xl text-xs hover:bg-[#F4E8D9] dark:hover:bg-[#454047] text-[#63463C] dark:text-[#F5EDE5] flex items-center justify-between transition-colors cursor-pointer group"
          title={theme === 'dark' ? 'Switch to Cozy Parchment (Light)' : 'Switch to Warm Vintage Evening (Dark)'}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5]/50 dark:border-[#5A5055] flex items-center justify-center text-[#777B59] dark:text-[#A6A98A] shrink-0 group-hover:scale-105 transition-transform">
              {theme === 'dark' ? (
                <Moon className="w-3.5 h-3.5 text-[#DEBAC7]" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-[#777B59]" />
              )}
            </div>
            <div className="truncate">
              <span className="font-bold text-xs text-[#392D29] dark:text-[#F5EDE5] block">
                Appearance
              </span>
              <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A] block truncate">
                {theme === 'dark' ? 'Warm Evening (Dark)' : 'Cozy Parchment (Light)'}
              </span>
            </div>
          </div>
          {/* Interactive Visual Toggle Pill */}
          <div
            className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center shrink-0 ${
              theme === 'dark'
                ? 'bg-[#777B59] justify-end'
                : 'bg-[#D6BDA5] dark:bg-[#5A5055] justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#FFF8EF] shadow-xs" />
          </div>
        </button>
      </div>

      {/* 4. ACCOUNT ACTIONS */}
      <div className="pt-2.5 space-y-1">
        <button
          onClick={handleSignOut}
          className="w-full text-left p-2 rounded-xl text-xs text-[#B58D99] dark:text-[#DEBAC7] hover:bg-[#B58D99]/15 flex items-center justify-between font-medium transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#B58D99]/15 text-[#B58D99] dark:text-[#DEBAC7] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <LogOut className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#392D29] dark:text-[#F5EDE5] group-hover:text-[#B58D99] dark:group-hover:text-[#DEBAC7] block">
                Sign Out
              </span>
              <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A] block">
                Switch to guest mode
              </span>
            </div>
          </div>
          <span className="text-[10px] text-[#B58D99] dark:text-[#DEBAC7] font-semibold">
            Exit
          </span>
        </button>

        {/* Subtle Relocated Security & Demo Settings */}
        <div className="pt-2 mt-1 text-center border-t border-[#D6BDA5]/30 dark:border-[#5A5055]/30">
          <button
            onClick={() => {
              setUserDropdownOpen(false);
              onOpenSettings('security');
            }}
            className="text-[10px] text-[#777B59] dark:text-[#A6A98A] hover:underline font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Woodland Vault & Demo Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 bg-[#F4E8D9]/95 dark:bg-[#29272A]/95 backdrop-blur-md border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60 transition-colors duration-200">
      <div className="max-w-6xl mx-auto relative w-full">
        {/* Carved wood signboard navigation header */}
        <div className="wood-signboard rounded-2xl px-2.5 sm:px-3.5 md:px-4 py-2 sm:py-2.5 text-[#FFF8EF] dark:text-[#F5EDE5] relative shadow-lg border border-[#4A322A] dark:border-[#5A5055] transition-all duration-150">
          {/* Rivets in corners */}
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 pointer-events-none opacity-80">
            <ScrewRivet />
          </div>
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 pointer-events-none opacity-80">
            <ScrewRivet />
          </div>
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 pointer-events-none opacity-80">
            <ScrewRivet />
          </div>
          <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 pointer-events-none opacity-80">
            <ScrewRivet />
          </div>

          {/* Top/Main Row:
              - Left: Brand Logo & Wordmark (with Tagline on large screens)
              - Desktop Right (md+): Full single-row toolbar with all 6 controls
              - Mobile Right (<md): Primary quick controls (Theme, Profile, Hamburger)
          */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            {/* LEFT: Logo & Brand Wordmark */}
            <div className="flex items-center gap-2 sm:gap-2.5 pl-1 sm:pl-2 min-w-0 shrink">
              <button
                onClick={() => handleNavClick('landing')}
                className="flex items-center gap-2 sm:gap-2.5 text-left group transition-transform active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58D99] rounded-xl cursor-pointer min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#777B59] border border-[#A6A98A]/70 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform shrink-0">
                  <MushroomIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#FFF8EF]" />
                </div>
                <div className="min-w-0 truncate">
                  <span className="font-serif text-base sm:text-lg lg:text-xl font-bold tracking-tight text-[#FFF8EF] dark:text-[#F5EDE5] block leading-tight truncate">
                    Moss & Moments
                  </span>
                  <span className="text-[10px] lg:text-[11px] font-medium text-[#D6BDA5] dark:text-[#D7C5C0] hidden xl:block leading-none mt-0.5 tracking-wide truncate">
                    Little details. Beautifully planned moments.
                  </span>
                </div>
              </button>
            </div>

            {/* DESKTOP RIGHT (md and above): Complete compact single-row controls */}
            <div className="hidden md:flex items-center gap-1.5 lg:gap-2 pr-1 sm:pr-2 shrink-0">
              {/* 1. Event Selector */}
              {events.length > 0 && (
                <div className="relative shrink-0" ref={eventMenuRef}>
                  <button
                    onClick={toggleEventDropdown}
                    className="h-8.5 px-2.5 rounded-xl bg-[#4A322A] dark:bg-[#454047] hover:bg-[#392D29] dark:hover:bg-[#5A5055] text-[#FFF8EF] dark:text-[#F5EDE5] border border-[#777B59]/40 dark:border-[#5A5055] text-xs font-medium flex items-center gap-2 max-w-[130px] lg:max-w-[170px] xl:max-w-[200px] shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B58D99] cursor-pointer"
                    title="Switch active event workspace"
                    aria-expanded={eventDropdownOpen}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#777B59] shrink-0" />
                    <span className="truncate font-sans font-medium">
                      {activeEvent ? activeEvent.name : 'Select Event'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#D6BDA5] dark:text-[#D7C5C0] shrink-0" />
                  </button>

                  {eventDropdownOpen && renderEventDropdownContent()}
                </div>
              )}

              {/* 2. New Event Button */}
              <button
                onClick={onOpenCreateEvent}
                className="h-8.5 px-2.5 sm:px-3 rounded-xl bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold text-xs border border-[#A6A98A] shadow-md flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF8EF] cursor-pointer shrink-0"
                title="Create a new gathering or celebration"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#FFF8EF] shrink-0" />
                <span className="hidden sm:inline">New Event</span>
              </button>

              {/* 3. Currency Selector */}
              <button
                onClick={() => onOpenSettings('currency')}
                className="h-8.5 px-2 sm:px-2.5 rounded-xl bg-[#4A322A] dark:bg-[#454047] border border-[#777B59]/40 dark:border-[#5A5055] text-xs font-mono font-medium text-[#FFF8EF] dark:text-[#F5EDE5] hover:bg-[#392D29] dark:hover:bg-[#5A5055] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B58D99] cursor-pointer flex items-center gap-1.5 shrink-0"
                title={`Active Currency: ${activeCurrency.name} (${activeCurrency.code})`}
              >
                <span className="text-sm leading-none">{activeCountry.flag}</span>
                <span className="font-bold">{activeCurrency.code}</span>
              </button>

              {/* 4. Theme Toggle */}
              <button
                onClick={onToggleTheme}
                className="h-8.5 w-8.5 rounded-xl bg-[#4A322A] dark:bg-[#454047] border border-[#777B59]/40 dark:border-[#5A5055] text-[#FFF8EF] dark:text-[#F5EDE5] hover:bg-[#392D29] dark:hover:bg-[#5A5055] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58D99] cursor-pointer flex items-center justify-center shrink-0"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to light mode (Cozy Parchment)' : 'Switch to dark mode (Warm Vintage Evening)'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#D7C5C0] hover:text-[#FFF8EF] transition-colors" />
                ) : (
                  <Moon className="w-4 h-4 text-[#D6BDA5] hover:text-[#FFF8EF] transition-colors" />
                )}
              </button>

              {/* 5. Profile Menu */}
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="h-8.5 p-1 pl-1.5 pr-2 rounded-xl bg-[#4A322A] dark:bg-[#454047] border border-[#777B59]/50 dark:border-[#5A5055] text-[#FFF8EF] hover:bg-[#392D29] dark:hover:bg-[#5A5055] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58D99] cursor-pointer flex items-center gap-1.5"
                  title={`Active Organizer: ${user.displayName}`}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#777B59] text-[#FFF8EF] flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    {user.displayName.charAt(0)}
                  </div>
                  <div className="hidden xl:block text-left text-xs leading-none">
                    <span className="font-bold block truncate max-w-[80px] text-[#FFF8EF] dark:text-[#F5EDE5]">
                      {user.displayName.split(' ')[0]}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#D6BDA5] dark:text-[#D7C5C0] shrink-0" />
                </button>

                {userDropdownOpen && renderProfileDropdownContent()}
              </div>

              {/* 6. Navigation Menu (Hamburger) Button */}
              <button
                ref={menuBtnRef}
                onClick={toggleMenu}
                className={`h-8.5 w-8.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58D99] shrink-0 ${
                  menuOpen
                    ? 'bg-[#B58D99] text-[#FFF8EF] border-[#DEBAC7] shadow-md'
                    : 'bg-[#4A322A] dark:bg-[#454047] hover:bg-[#392D29] dark:hover:bg-[#5A5055] text-[#FFF8EF] border-[#777B59]/40 dark:border-[#5A5055] shadow-xs'
                }`}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                title="Open Navigation Menu"
              >
                {menuOpen ? <X className="w-4.5 h-4.5 shrink-0" /> : <Menu className="w-4.5 h-4.5 shrink-0" />}
              </button>
            </div>

            {/* MOBILE RIGHT (< md): Primary quick actions (Theme, Profile, Hamburger) */}
            <div className="flex md:hidden items-center gap-1 sm:gap-1.5 pr-0.5 shrink-0">
              {/* Mobile Theme Toggle */}
              <button
                onClick={onToggleTheme}
                className="h-8 w-8 rounded-lg bg-[#4A322A] dark:bg-[#454047] border border-[#777B59]/40 dark:border-[#5A5055] text-[#FFF8EF] dark:text-[#F5EDE5] hover:bg-[#392D29] transition-colors flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-[#D7C5C0]" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-[#D6BDA5]" />
                )}
              </button>

              {/* Mobile Profile Trigger */}
              <div className="relative shrink-0" ref={mobileUserMenuRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="h-8 p-1 pl-1 pr-1.5 rounded-lg bg-[#4A322A] dark:bg-[#454047] border border-[#777B59]/50 dark:border-[#5A5055] text-[#FFF8EF] hover:bg-[#392D29] transition-all flex items-center gap-1 cursor-pointer"
                  aria-label="User Profile"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-6 h-6 rounded-md bg-[#777B59] text-[#FFF8EF] flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    {user.displayName.charAt(0)}
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#D6BDA5] dark:text-[#D7C5C0] shrink-0" />
                </button>

                {userDropdownOpen && renderProfileDropdownContent()}
              </div>

              {/* Mobile Hamburger Menu Button */}
              <button
                ref={mobileMenuBtnRef}
                onClick={toggleMenu}
                className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 ${
                  menuOpen
                    ? 'bg-[#B58D99] text-[#FFF8EF] border-[#DEBAC7] shadow-md'
                    : 'bg-[#4A322A] dark:bg-[#454047] hover:bg-[#392D29] text-[#FFF8EF] border-[#777B59]/40 dark:border-[#5A5055] shadow-xs'
                }`}
                aria-expanded={menuOpen}
                aria-label="Toggle navigation menu"
              >
                {menuOpen ? <X className="w-4 h-4 shrink-0" /> : <Menu className="w-4 h-4 shrink-0" />}
              </button>
            </div>
          </div>

          {/* MOBILE SECONDARY TIER (< md):
              - Event Selector (flex-1 min-w-0)
              - + New Event Button (shrink-0)
              - Currency & Region Indicator (shrink-0)
              Ensures that on small and medium mobile screens, controls never collide with the logo,
              never wrap awkwardly, and maintain a fixed, predictable compact height.
          */}
          <div className="flex md:hidden items-center gap-1.5 pt-2 mt-2 border-t border-[#4A322A]/70 dark:border-[#5A5055]/70 w-full">
            {/* 1. Mobile Event Selector */}
            {events.length > 0 && (
              <div className="relative flex-1 min-w-0" ref={mobileEventMenuRef}>
                <button
                  onClick={toggleEventDropdown}
                  className="w-full h-7.5 px-2 rounded-lg bg-[#4A322A] dark:bg-[#454047] hover:bg-[#392D29] dark:hover:bg-[#5A5055] text-[#FFF8EF] dark:text-[#F5EDE5] border border-[#777B59]/40 dark:border-[#5A5055] text-[11px] font-medium flex items-center justify-between gap-1 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B58D99] cursor-pointer"
                  title="Switch active event workspace"
                  aria-expanded={eventDropdownOpen}
                >
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#777B59] shrink-0" />
                    <span className="truncate font-sans font-medium">
                      {activeEvent ? activeEvent.name : 'Select Event'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#D6BDA5] dark:text-[#D7C5C0] shrink-0" />
                </button>

                {eventDropdownOpen && renderEventDropdownContent()}
              </div>
            )}

            {/* 2. Mobile New Event CTA */}
            <button
              onClick={onOpenCreateEvent}
              className="h-7.5 px-2 sm:px-2.5 rounded-lg bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold text-[11px] border border-[#A6A98A] shadow-md flex items-center gap-1 transition-all whitespace-nowrap active:scale-95 cursor-pointer shrink-0"
              title="Create a new gathering or celebration"
            >
              <PlusCircle className="w-3 h-3 text-[#FFF8EF] shrink-0" />
              <span>New</span>
            </button>

            {/* 3. Mobile Currency Selector */}
            <button
              onClick={() => onOpenSettings('currency')}
              className="h-7.5 px-2 rounded-lg bg-[#4A322A] dark:bg-[#454047] border border-[#777B59]/40 dark:border-[#5A5055] text-[11px] font-mono font-medium text-[#FFF8EF] dark:text-[#F5EDE5] hover:bg-[#392D29] dark:hover:bg-[#5A5055] transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              title={`Active Currency: ${activeCurrency.name} (${activeCurrency.code})`}
            >
              <span className="text-xs leading-none">{activeCountry.flag}</span>
              <span className="font-bold">{activeCurrency.code}</span>
            </button>
          </div>
        </div>

        {/* Navigation Drawer Overlay - Shared by Desktop, Tablet, and Mobile */}
        {menuOpen && (
          <div
            ref={drawerRef}
            className="absolute top-full left-0 right-0 mt-2 bg-[#FFF8EF] dark:bg-[#393438] border-2 border-[#D6BDA5] dark:border-[#5A5055] rounded-3xl p-4 sm:p-6 shadow-2xl text-[#392D29] dark:text-[#F5EDE5] z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-90px)] overflow-y-auto"
            style={{
              boxShadow: '0 20px 50px -4px rgba(57, 45, 41, 0.45), 0 8px 20px rgba(0,0,0,0.25)',
            }}
          >
            {/* Decorative Rivets */}
            <div className="absolute top-3 left-3 pointer-events-none opacity-80">
              <ScrewRivet />
            </div>
            <div className="absolute top-3 right-3 pointer-events-none opacity-80">
              <ScrewRivet />
            </div>

            {/* Drawer Title Bar */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60 px-1 sm:px-2">
              <div className="flex items-center gap-2">
                <MushroomIcon className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
                <span className="font-serif text-sm sm:text-base font-bold text-[#63463C] dark:text-[#F5EDE5]">
                  Woodland Navigation & Event Hub
                </span>
                <span className="text-[11px] text-[#777B59] dark:text-[#A6A98A] font-medium hidden md:inline">
                  · Choose an area to plan and manage
                </span>
              </div>
              <div className="text-[11px] text-[#63463C] dark:text-[#D7C5C0] font-sans">
                Active view: <strong className="text-[#777B59] dark:text-[#A6A98A] font-bold">{activeNavItem.label}</strong>
              </div>
            </div>

            {/* Navigation Cards Grid: Clean responsive grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2.5 group relative ${
                      isActive
                        ? 'bg-[#777B59] text-[#FFF8EF] border-[#777B59] shadow-md scale-[1.02]'
                        : 'bg-[#F4E8D9]/70 dark:bg-[#29272A]/80 border-[#D6BDA5] dark:border-[#5A5055] text-[#63463C] dark:text-[#F5EDE5] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] hover:border-[#A6A98A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'bg-[#FFF8EF] text-[#777B59]'
                            : 'bg-[#FFF8EF] dark:bg-[#393438] text-[#777B59] dark:text-[#A6A98A] border border-[#D6BDA5] dark:border-[#5A5055]'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>
                      {item.highlight && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                            isActive
                              ? 'bg-[#FFF8EF]/20 text-[#FFF8EF]'
                              : 'bg-[#B58D99]/20 text-[#B58D99] dark:text-[#DEBAC7]'
                          }`}
                        >
                          <Sparkle className="w-2.5 h-2.5" />
                          <span>AI</span>
                        </span>
                      )}
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#FFF8EF] shadow-xs" />
                      )}
                    </div>
                    <div>
                      <span className="font-serif text-xs sm:text-sm font-bold block leading-tight">
                        {item.label}
                      </span>
                      <span
                        className={`text-[10px] block mt-0.5 leading-tight ${
                          isActive ? 'text-[#FFF8EF]/80' : 'text-[#777B59] dark:text-[#A6A98A]'
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Utility Bar */}
            <div className="mt-4 pt-3.5 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs px-1">
              {/* Active Gathering Selector */}
              {events.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] shrink-0">
                    Active Gathering:
                  </span>
                  <select
                    value={activeEvent?.id || ''}
                    onChange={(e) => onSelectEvent(e.target.value)}
                    className="text-xs p-1.5 px-2 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5] max-w-xs truncate font-medium"
                  >
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.eventDate || 'Upcoming'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quick links */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenSettings('currency');
                  }}
                  className="flex items-center gap-1.5 text-xs text-[#63463C] dark:text-[#F5EDE5] hover:text-[#777B59] font-medium transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                  <span>Region & Currency: <strong>{activeCountry.flag} {activeCurrency.code}</strong></span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenSettings('profile');
                  }}
                  className="flex items-center gap-1.5 text-xs text-[#777B59] dark:text-[#A6A98A] hover:underline font-bold transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{user.displayName.split(' ')[0]} Profile</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
