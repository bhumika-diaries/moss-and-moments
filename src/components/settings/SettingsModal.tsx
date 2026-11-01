import React, { useState, useEffect } from 'react';
import {
  X,
  Globe,
  DollarSign,
  RefreshCw,
  User,
  Check,
  ShieldCheck,
  Sparkles,
  Info,
  RotateCcw,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon } from '../common/WoodlandIcons';
import { useCurrency } from '../../hooks/useCurrency';
import { UserProfile } from '../../types';
import { isSupabaseConfigured } from '../../services/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  initialTab?: 'currency' | 'profile' | 'security';
  onResetData?: () => void;
  onOpenAuth?: () => void;
}

const PRESET_ORGANIZERS: UserProfile[] = [
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

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onSelectUser,
  initialTab = 'profile',
  onResetData,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'currency' | 'profile' | 'security'>(initialTab);
  const {
    settings,
    ratesState,
    isRefreshing,
    activeCountry,
    activeCurrency,
    updateCountry,
    updateCurrency,
    refreshRates,
    formatMoney,
    exchangeRateDisplay,
    supportedCountries,
    supportedCurrencies,
  } = useCurrency();

  // Keep activeTab in sync with initialTab when reopened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Local editing for custom profile
  const [customName, setCustomName] = useState(user.displayName);
  const [customRole, setCustomRole] = useState(user.role);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setCustomName(user.displayName);
    setCustomRole(user.role);
  }, [user]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      displayName: customName.trim() || user.displayName,
      role: customRole.trim() || user.role,
    };
    onSelectUser(updated);
    setSaveMessage('Profile details saved successfully!');
    setTimeout(() => setSaveMessage(''), 2500);
  };

  const sampleAmounts = [150, 4800, 18500];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29272A]/70 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="parchment-card rounded-3xl w-full max-w-xl p-6 sm:p-8 relative shadow-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 left-4"><ScrewRivet /></div>
        <div className="absolute top-4 right-4"><ScrewRivet /></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-10 p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58D99] cursor-pointer"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
          <span className="font-hand text-lg text-[#777B59] dark:text-[#A6A98A]">Woodland Settings & Account</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-5">
          Account & Preferences
        </h2>

        {/* Tab navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4E8D9] dark:bg-[#29272A] rounded-xl border border-[#D6BDA5] dark:border-[#5A5055] mb-6 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#777B59] text-[#FFF8EF] shadow-sm'
                : 'text-[#63463C] dark:text-[#D7C5C0] hover:text-[#392D29] dark:hover:text-[#F5EDE5]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('currency')}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'currency'
                ? 'bg-[#777B59] text-[#FFF8EF] shadow-sm'
                : 'text-[#63463C] dark:text-[#D7C5C0] hover:text-[#392D29] dark:hover:text-[#F5EDE5]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Currency & Region</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#777B59] text-[#FFF8EF] shadow-sm'
                : 'text-[#63463C] dark:text-[#D7C5C0] hover:text-[#392D29] dark:hover:text-[#F5EDE5]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security & Demo</span>
          </button>
        </div>

        {/* Tab 1: Currency & Region */}
        {activeTab === 'currency' && (
          <div className="space-y-6 text-xs">
            {/* Country Selector */}
            <div>
              <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                <span>Select Your Country / Territory</span>
              </label>
              <p className="text-[11px] text-[#392D29]/70 dark:text-[#B7A9A6] mb-2">
                Selecting your country will automatically suggest the standard national currency and formatting conventions.
              </p>
              <select
                value={settings.countryCode}
                onChange={(e) => updateCountry(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs font-medium text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-1 focus:ring-[#777B59]"
              >
                {supportedCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.defaultCurrency})
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Selector (Manual override supported) */}
            <div>
              <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                <span>Preferred Display Currency</span>
              </label>
              <p className="text-[11px] text-[#392D29]/70 dark:text-[#B7A9A6] mb-2">
                You may override the country default to view amounts in any currency of your choice at any time.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {supportedCurrencies.map((curr) => {
                  const isSelected = settings.currencyCode === curr.code;
                  return (
                    <button
                      key={curr.code}
                      onClick={() => updateCurrency(curr.code)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#777B59] text-[#FFF8EF] border-[#777B59] shadow-sm font-bold'
                          : 'bg-[#FFF8EF] dark:bg-[#29272A] border-[#D6BDA5] dark:border-[#5A5055] text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-mono text-sm block font-bold">{curr.symbol} {curr.code}</span>
                        <span className="text-[10px] block truncate opacity-85">{curr.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#FFF8EF] shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exchange Rate Card & Live Status */}
            <div className="p-4 rounded-2xl bg-[#F4E8D9]/70 dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A] block">
                    Current Valuation Rate
                  </span>
                  <p className="font-mono text-sm font-bold text-[#63463C] dark:text-[#F5EDE5]">
                    {exchangeRateDisplay}
                  </p>
                </div>
                <button
                  onClick={refreshRates}
                  disabled={isRefreshing}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FFF8EF] dark:bg-[#454047] border border-[#D6BDA5] dark:border-[#5A5055] text-[11px] font-medium text-[#63463C] dark:text-[#F5EDE5] hover:bg-[#F4E8D9] flex items-center gap-1.5 transition-colors disabled:opacity-60"
                  title="Check latest live exchange rate"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#777B59]' : ''}`} />
                  <span>{isRefreshing ? 'Fetching...' : 'Check Live Rates'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#392D29]/75 dark:text-[#B7A9A6] pt-2 border-t border-[#D6BDA5]/50 dark:border-[#5A5055]/50">
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${ratesState.source === 'live' ? 'bg-[#777B59]' : 'bg-[#B58D99]'}`} />
                  <span>{ratesState.source === 'live' ? 'Live Exchange Rate' : 'Verified Reference Rates'}</span>
                </span>
                <span>Last updated: {ratesState.lastUpdated}</span>
              </div>
            </div>

            {/* Live Formatting Preview */}
            <div className="p-3.5 rounded-2xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055]">
              <div className="flex items-center gap-1.5 mb-2 text-[#777B59] dark:text-[#A6A98A] font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real-Time Formatting Preview ({activeCurrency.name})</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {sampleAmounts.map((amt) => (
                  <div key={amt} className="p-2 rounded-xl bg-[#F4E8D9]/50 dark:bg-[#393438] border border-[#D6BDA5]/40 dark:border-[#5A5055]/40">
                    <span className="text-[10px] text-[#392D29]/60 dark:text-[#B7A9A6] block font-mono">${amt} USD</span>
                    <span className="font-mono font-bold text-xs text-[#63463C] dark:text-[#F5EDE5]">
                      {formatMoney(amt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanatory notice */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#777B59]/10 border border-[#777B59]/30 text-[11px] text-[#63463C] dark:text-[#D7C5C0] leading-relaxed">
              <Info className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A] shrink-0 mt-0.5" />
              <p>
                <strong>Preservation of Financial Records:</strong> Stored event budgets and expense ledger line-items retain their base currency in the vault. Changing your display currency translates numbers cleanly across cards, charts, and AI planning without recalculation drift or rounding accumulation.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Profile & Account */}
        {activeTab === 'profile' && (
          <div className="space-y-6 text-xs">
            {/* Active profile card */}
            <div className="p-4 rounded-2xl bg-[#F4E8D9]/70 dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#777B59] text-[#FFF8EF] flex items-center justify-center font-bold text-lg shadow-sm">
                {user.displayName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-[#63463C] dark:text-[#F5EDE5] truncate">{user.displayName}</h4>
                <p className="text-[11px] text-[#777B59] dark:text-[#A6A98A] font-medium">{user.role}</p>
                <p className="text-[10px] text-[#392D29]/60 dark:text-[#B7A9A6] truncate">{user.email}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#777B59]/15 text-[#777B59] dark:text-[#A6A98A] border border-[#777B59]/30">
                Active Vault
              </span>
            </div>

            {/* Edit details form */}
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
              <h4 className="font-bold text-[#63463C] dark:text-[#F5EDE5]">Edit Profile Details</h4>

              <div>
                <label className="block text-[11px] font-semibold text-[#63463C] dark:text-[#D7C5C0] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Bhumika Devnath"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-1 focus:ring-[#777B59]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#63463C] dark:text-[#D7C5C0] mb-1">
                  Role / Specialization
                </label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. Lead Floral & Event Stylist"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-1 focus:ring-[#777B59]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#63463C] dark:text-[#D7C5C0] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4E8D9]/50 dark:bg-[#393438]/50 border border-[#D6BDA5]/50 dark:border-[#5A5055]/50 text-xs text-[#392D29]/70 dark:text-[#B7A9A6] cursor-not-allowed"
                />
                <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A] mt-1 block">
                  Managed via Woodland Vault credentials.
                </span>
              </div>

              {saveMessage && (
                <div className="p-2.5 rounded-xl bg-[#777B59]/15 border border-[#777B59]/30 text-[11px] text-[#777B59] dark:text-[#A6A98A] font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>{saveMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Security & Demo Settings */}
        {activeTab === 'security' && (
          <div className="space-y-5 text-xs">
            {/* Cloud Vault & Authentication */}
            <div className="p-4 rounded-2xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#777B59]/15 text-[#777B59] dark:text-[#A6A98A] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#63463C] dark:text-[#F5EDE5]">
                      Woodland Vault & Cloud Auth
                    </h4>
                    <p className="text-[10px] text-[#777B59] dark:text-[#A6A98A]">
                      {isSupabaseConfigured ? 'Cloud Sync Enabled' : 'Local Vault Storage (Browser Storage)'}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                  isSupabaseConfigured
                    ? 'bg-[#777B59]/15 text-[#777B59] border-[#777B59]/30'
                    : 'bg-[#B58D99]/15 text-[#B58D99] dark:text-[#DEBAC7] border-[#B58D99]/30'
                }`}>
                  {isSupabaseConfigured ? 'Cloud Synced' : 'Local Mode'}
                </span>
              </div>

              <p className="text-[11px] text-[#392D29]/70 dark:text-[#B7A9A6] leading-relaxed">
                Log in or switch accounts using the Woodland Vault credentials modal to persist and sync event documents across devices.
              </p>

              {onOpenAuth && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Open Woodland Vault Login</span>
                </button>
              )}
            </div>

            {/* Developer & Demo Data Management */}
            <div className="p-4 rounded-2xl bg-[#F4E8D9]/70 dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#B58D99]/15 text-[#B58D99] dark:text-[#DEBAC7] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#63463C] dark:text-[#F5EDE5]">
                    Developer & Showcase Data
                  </h4>
                  <p className="text-[10px] text-[#392D29]/65 dark:text-[#B7A9A6]">
                    Demo reset & test management
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-[#392D29]/75 dark:text-[#B7A9A6] leading-relaxed">
                Resetting sample data restores all curated woodland events (Enchanted Autumn Harvest, Secret Forest Wedding), tasks, budget entries, guest lists, and moodboards to their initial showcase state.
              </p>

              {onResetData && (
                <button
                  onClick={() => {
                    if (window.confirm('Reset all events, tasks, budget items, and guests back to default woodland showcase data?')) {
                      onResetData();
                      onClose();
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#FFF8EF] dark:bg-[#393438] border border-[#B58D99] hover:bg-[#B58D99]/10 text-[#63463C] dark:text-[#F5EDE5] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#B58D99]" />
                  <span>Reset Showcase Data</span>
                </button>
              )}
            </div>

            {/* Demo Personas for Multi-User Testing */}
            <div className="p-4 rounded-2xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#777B59]/15 text-[#777B59] dark:text-[#A6A98A] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#63463C] dark:text-[#F5EDE5]">
                    Demo Organizer Personas (Testing)
                  </h4>
                  <p className="text-[10px] text-[#777B59] dark:text-[#A6A98A]">
                    Simulate collaborating planners
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                {PRESET_ORGANIZERS.map((org) => {
                  const isSelected = user.id === org.id;
                  return (
                    <button
                      key={org.id}
                      onClick={() => {
                        onSelectUser(org);
                        setCustomName(org.displayName);
                        setCustomRole(org.role);
                        setSaveMessage(`Switched to ${org.displayName}`);
                        setTimeout(() => setSaveMessage(''), 2000);
                      }}
                      className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#777B59] text-[#FFF8EF] border-[#777B59] shadow-xs'
                          : 'bg-[#F4E8D9]/50 dark:bg-[#393438] border-[#D6BDA5]/60 dark:border-[#5A5055] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                            isSelected ? 'bg-[#FFF8EF] text-[#777B59]' : 'bg-[#777B59] text-[#FFF8EF]'
                          }`}
                        >
                          {org.displayName.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-bold text-xs ${isSelected ? 'text-[#FFF8EF]' : 'text-[#63463C] dark:text-[#F5EDE5]'}`}>
                            {org.displayName}
                          </p>
                          <p className={`text-[9px] ${isSelected ? 'text-[#FFF8EF]/80' : 'text-[#777B59] dark:text-[#A6A98A]'}`}>
                            {org.role}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FFF8EF]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
