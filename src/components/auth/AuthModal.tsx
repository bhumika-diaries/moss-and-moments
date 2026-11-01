import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Key, Mail, Lock, User, Check } from 'lucide-react';
import { ScrewRivet, MushroomIcon } from '../common/WoodlandIcons';
import { UserProfile } from '../../types';
import { isSupabaseConfigured, supabase } from '../../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
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

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'switch'>('switch');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    if (isSupabaseConfigured && supabase) {
      try {
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { display_name: displayName || email.split('@')[0] },
            },
          });
          if (error) throw error;
          setStatusMessage('Account created with Supabase Auth!');
          if (data.user) {
            onSelectUser({
              id: data.user.id,
              email: data.user.email || email,
              displayName: displayName || email.split('@')[0],
              role: 'Organizer',
              avatarSeed: 'woodland-custom',
            });
            setTimeout(onClose, 1000);
          }
        } else if (mode === 'signin') {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          setStatusMessage('Signed in successfully with Supabase!');
          if (data.user) {
            onSelectUser({
              id: data.user.id,
              email: data.user.email || email,
              displayName: data.user.user_metadata?.display_name || email.split('@')[0],
              role: 'Organizer',
              avatarSeed: 'woodland-custom',
            });
            setTimeout(onClose, 1000);
          }
        }
      } catch (err: any) {
        setStatusMessage(err.message || 'Authentication error.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Local Woodland Vault authentication simulation
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email: email || 'organizer@mossmoments.com',
        displayName: displayName || email.split('@')[0] || 'Woodland Planner',
        role: 'Event Organizer',
        avatarSeed: 'woodland-deer',
      };
      onSelectUser(newUser);
      setStatusMessage('Signed in to Woodland Local Vault.');
      setTimeout(onClose, 800);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#392D29]/60 dark:bg-black/75 backdrop-blur-xs">
      <div className="parchment-card rounded-3xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055]">
        <div className="absolute top-4 left-4"><ScrewRivet /></div>
        <div className="absolute top-4 right-4"><ScrewRivet /></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-10 p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
          <span className="font-hand text-lg text-[#777B59] dark:text-[#A6A98A]">Organizer Gate & Vault</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-4">
          Authentication & Profiles
        </h2>

        {/* Backend status pill */}
        <div className="mb-5 p-2.5 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] flex items-center gap-2 text-xs text-[#63463C] dark:text-[#D7C5C0]">
          <ShieldCheck className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A] shrink-0" />
          <div className="leading-tight">
            <span className="font-bold text-[#392D29] dark:text-[#F5EDE5]">
              {isSupabaseConfigured ? 'Supabase Database Connected' : 'Woodland Local Vault (Active)'}
            </span>
            <p className="text-[10px] text-[#392D29]/70 dark:text-[#D7C5C0]/75">
              {isSupabaseConfigured
                ? 'Authenticating securely against remote PostgreSQL.'
                : 'Session & events are safely persisted in your browser.'}
            </p>
          </div>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F4E8D9] dark:bg-[#29272A] rounded-xl border border-[#D6BDA5] dark:border-[#5A5055] mb-5 text-xs">
          <button
            onClick={() => setMode('switch')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
              mode === 'switch' ? 'bg-[#777B59] text-[#FFF8EF]' : 'text-[#63463C] dark:text-[#D7C5C0] hover:text-[#392D29] dark:hover:text-[#FFF8EF]'
            }`}
          >
            Switch Persona
          </button>
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
              mode === 'signin' ? 'bg-[#777B59] text-[#FFF8EF]' : 'text-[#63463C] dark:text-[#D7C5C0] hover:text-[#392D29] dark:hover:text-[#FFF8EF]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
              mode === 'signup' ? 'bg-[#777B59] text-[#FFF8EF]' : 'text-[#63463C] dark:text-[#D7C5C0] hover:text-[#392D29] dark:hover:text-[#FFF8EF]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {statusMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-[#777B59]/15 border border-[#777B59] text-xs text-[#63463C] dark:text-[#F5EDE5]">
            {statusMessage}
          </div>
        )}

        {/* Persona Switcher Mode */}
        {mode === 'switch' && (
          <div className="space-y-3">
            <p className="text-xs text-[#392D29]/75 dark:text-[#D7C5C0] mb-2">
              Select an organizer profile to view gatherings and permissions:
            </p>
            {PRESET_ORGANIZERS.map((org) => {
              const isSelected = currentUser.id === org.id;
              return (
                <button
                  key={org.id}
                  onClick={() => {
                    onSelectUser(org);
                    setStatusMessage(`Switched to ${org.displayName}`);
                    setTimeout(onClose, 600);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#777B59] text-[#FFF8EF] border-[#777B59]'
                      : 'bg-[#FFF8EF] dark:bg-[#29272A] border-[#D6BDA5] dark:border-[#5A5055] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-[#FFF8EF] text-[#777B59]' : 'bg-[#777B59] text-[#FFF8EF]'
                      }`}
                    >
                      {org.displayName.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-bold text-xs ${isSelected ? 'text-[#FFF8EF]' : 'text-[#63463C] dark:text-[#F5EDE5]'}`}>
                        {org.displayName}
                      </p>
                      <p className={`text-[10px] ${isSelected ? 'text-[#FFF8EF]/80' : 'text-[#777B59] dark:text-[#A6A98A]'}`}>
                        {org.role}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#FFF8EF]" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Sign In / Sign Up Form */}
        {(mode === 'signin' || mode === 'signup') && (
          <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Organizer Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777B59] dark:text-[#A6A98A]" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Elspeth Rowan"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] placeholder:text-[#A6A98A]/70 focus:outline-none focus:ring-1 focus:ring-[#777B59]"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777B59] dark:text-[#A6A98A]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="organizer@foresthaven.org"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] placeholder:text-[#A6A98A]/70 focus:outline-none focus:ring-1 focus:ring-[#777B59]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777B59] dark:text-[#A6A98A]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] placeholder:text-[#A6A98A]/70 focus:outline-none focus:ring-1 focus:ring-[#777B59]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-[#777B59] hover:bg-[#65694b] text-[#FFF8EF] font-bold p-2.5 rounded-xl border border-[#A6A98A] shadow-md flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
            >
              <span>{mode === 'signup' ? 'Create Organizer Vault' : 'Sign In'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
