import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Mail,
  Copy,
  Check,
  Trash2,
  Edit3,
  ExternalLink,
  Crown,
  KeyRound,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon, LeafIcon } from '../common/WoodlandIcons';
import {
  EventItem,
  UserProfile,
  Collaborator,
  EventInvitation,
  EventRole,
  EventSection,
} from '../../types';
import { storageService, ALL_EVENT_SECTIONS } from '../../services/storageService';

interface TeamPageProps {
  events: EventItem[];
  activeEvent: EventItem | undefined;
  onSelectEvent: (eventId: string) => void;
  currentUser: UserProfile;
  onNavigateTab: (tabId: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  currentUser,
  onNavigateTab,
}) => {
  // If no active event, fallback to first
  const event = activeEvent || events[0];

  // Collaborators & Invitations state
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() =>
    event ? storageService.getCollaborators(event.id) : []
  );
  const [invitations, setInvitations] = useState<EventInvitation[]>(() =>
    event ? storageService.getInvitations(event.id) : []
  );

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | EventRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'accepted' | 'pending'>('all');

  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCollab, setEditingCollab] = useState<Collaborator | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferTargetEmail, setTransferTargetEmail] = useState('');
  const [transferConfirmed, setTransferConfirmed] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [inviteTokenInput, setInviteTokenInput] = useState('');

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<EventRole>('editor');
  const [inviteSections, setInviteSections] = useState<EventSection[]>([
    'dashboard',
    'events',
    'tasks',
    'budget',
    'guests',
    'timeline',
    'moodboard',
  ]);

  // Current user's role on this active event
  const userRole = event
    ? storageService.getUserEventRole(currentUser.id, currentUser.email, event)
    : 'viewer';
  const canManage = userRole === 'owner' || userRole === 'co_organizer';
  const isOwner = userRole === 'owner';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const reloadData = () => {
    if (event) {
      setCollaborators(storageService.getCollaborators(event.id));
      setInvitations(storageService.getInvitations(event.id));
    }
  };

  // Re-fetch when active event changes
  React.useEffect(() => {
    reloadData();
  }, [event?.id]);

  // Filtered members list
  const filteredCollaborators = collaborators.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || c.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenInvite = () => {
    setInviteEmail('');
    setInviteName('');
    setInviteRole('editor');
    setInviteSections(['dashboard', 'events', 'tasks', 'budget', 'guests', 'timeline', 'moodboard']);
    setIsInviteModalOpen(true);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !inviteEmail.trim()) return;

    const result = storageService.createInvitation({
      eventId: event.id,
      email: inviteEmail.trim(),
      name: inviteName.trim(),
      role: inviteRole,
      permissions: inviteRole === 'co_organizer'
        ? (ALL_EVENT_SECTIONS.map((s) => s.id) as EventSection[])
        : inviteSections,
      invitedBy: currentUser,
    });

    reloadData();
    setIsInviteModalOpen(false);
    showToast(
      `Invitation sent to ${inviteEmail}! Token: ${result.invitation.token.substring(0, 16)}...`
    );
  };

  const handleOpenEdit = (collab: Collaborator) => {
    setEditingCollab(collab);
    setInviteRole(collab.role);
    setInviteSections(collab.permissions || []);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollab) return;

    storageService.updateCollaboratorRole(
      editingCollab.id,
      inviteRole,
      inviteRole === 'owner' || inviteRole === 'co_organizer'
        ? (ALL_EVENT_SECTIONS.map((s) => s.id) as EventSection[])
        : inviteSections
    );

    reloadData();
    setIsEditModalOpen(false);
    setEditingCollab(null);
    showToast(`Permissions updated for ${editingCollab.name || editingCollab.email}`);
  };

  const handleRemoveCollaborator = (collab: Collaborator) => {
    if (collab.role === 'owner') {
      showToast('Cannot remove the Event Owner. Ownership must be transferred first.');
      return;
    }
    if (confirm(`Are you sure you want to remove ${collab.name || collab.email} from this event?`)) {
      storageService.removeCollaborator(collab.id);
      reloadData();
      showToast(`Removed ${collab.name || collab.email} from the event.`);
    }
  };

  const handleResendInvite = (collab: Collaborator) => {
    const inv = invitations.find(
      (i) => i.invitedEmail.toLowerCase() === collab.email.toLowerCase()
    );
    if (inv) {
      const refreshed = storageService.resendInvitation(inv.id);
      reloadData();
      if (refreshed) {
        showToast(`Invitation re-dispatched to ${collab.email}. Direct link refreshed!`);
      }
    } else {
      // Re-create invite
      if (!event) return;
      storageService.createInvitation({
        eventId: event.id,
        email: collab.email,
        name: collab.name,
        role: collab.role,
        permissions: collab.permissions,
        invitedBy: currentUser,
      });
      reloadData();
      showToast(`New invitation generated and sent to ${collab.email}`);
    }
  };

  const handleCopyLink = (token?: string) => {
    if (!token) return;
    const url = `${window.location.origin}?invite=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
    showToast('Invitation link copied to clipboard!');
  };

  const handleTransferOwnership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !transferTargetEmail) return;

    const res = storageService.transferEventOwnership(event.id, transferTargetEmail, currentUser);
    if (res.success) {
      showToast(res.message);
      setIsTransferModalOpen(false);
      setTransferTargetEmail('');
      setTransferConfirmed(false);
      reloadData();
    } else {
      showToast(res.message);
    }
  };

  const handleAcceptToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteTokenInput.trim()) return;

    const res = storageService.acceptInvitation(inviteTokenInput.trim(), currentUser);
    showToast(res.message);
    if (res.success && res.eventId) {
      onSelectEvent(res.eventId);
      setIsAcceptModalOpen(false);
      setInviteTokenInput('');
      reloadData();
    }
  };

  const toggleSectionPermission = (secId: EventSection) => {
    if (inviteSections.includes(secId)) {
      setInviteSections(inviteSections.filter((s) => s !== secId));
    } else {
      setInviteSections([...inviteSections, secId]);
    }
  };

  const selectAllSections = () => {
    setInviteSections(ALL_EVENT_SECTIONS.map((s) => s.id) as EventSection[]);
  };

  const clearAllSections = () => {
    setInviteSections([]);
  };

  const getRoleBadge = (role: EventRole) => {
    switch (role) {
      case 'owner':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#63463C] text-[#FFF8EF] border border-[#D6BDA5]/60 shadow-xs">
            <Crown className="w-3 h-3 text-[#E2BA84]" />
            Owner
          </span>
        );
      case 'co_organizer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#777B59] text-[#FFF8EF] border border-[#A6A98A]/60 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-[#D6BDA5]" />
            Co-Organizer
          </span>
        );
      case 'editor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D6BDA5] dark:bg-[#4E4447] text-[#392D29] dark:text-[#FFF8EF] border border-[#63463C]/30 shadow-xs">
            <Edit3 className="w-3 h-3 text-[#63463C] dark:text-[#D6BDA5]" />
            Editor
          </span>
        );
      case 'viewer':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#A6A98A]/20 text-[#63463C] dark:text-[#D7C5C0] border border-[#A6A98A]/40">
            <Shield className="w-3 h-3 text-[#777B59]" />
            Viewer (Read-only)
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#63463C] dark:bg-[#393438] text-[#FFF8EF] px-4 py-3 rounded-2xl shadow-2xl border-2 border-[#D6BDA5] flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-[#E2BA84] shrink-0" />
          <p className="text-xs font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Main Wood Signboard Header */}
      <div className="relative bg-[#FFF8EF] dark:bg-[#393438] rounded-3xl border-2 border-[#D6BDA5] dark:border-[#5A5055] p-6 sm:p-8 shadow-xl overflow-hidden">
        {/* Screw Rivets on 4 corners */}
        <div className="absolute top-3 left-3 pointer-events-none opacity-80">
          <ScrewRivet />
        </div>
        <div className="absolute top-3 right-3 pointer-events-none opacity-80">
          <ScrewRivet />
        </div>
        <div className="absolute bottom-3 left-3 pointer-events-none opacity-80">
          <ScrewRivet />
        </div>
        <div className="absolute bottom-3 right-3 pointer-events-none opacity-80">
          <ScrewRivet />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#777B59] dark:text-[#A6A98A]">
              <Users className="w-4 h-4" />
              <span>Multi-User Event Collaboration</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#392D29] dark:text-[#F5EDE5] leading-tight">
              Woodland Circle & Event Collaborators
            </h1>
            <p className="text-xs sm:text-sm text-[#63463C] dark:text-[#D7C5C0] font-sans">
              Invite co-organizers, stylists, florists and guests with fine-grained section access
              to plan this celebration harmoniously together.
            </p>
          </div>

          {/* Active Event Selector & Quick Action Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-[#F4E8D9] dark:bg-[#29272A] p-3 rounded-2xl border border-[#D6BDA5]/60 dark:border-[#5A5055]">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#777B59] dark:text-[#A6A98A] uppercase tracking-wider">
                Active Celebration
              </span>
              <select
                value={event?.id}
                onChange={(e) => onSelectEvent(e.target.value)}
                className="bg-transparent font-serif font-bold text-xs sm:text-sm text-[#392D29] dark:text-[#F5EDE5] focus:outline-none cursor-pointer pr-4"
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id} className="bg-[#FFF8EF] dark:bg-[#393438]">
                    {evt.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-8 w-px bg-[#D6BDA5]/80 dark:bg-[#5A5055] mx-1 hidden sm:block" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAcceptModalOpen(true)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#F5EDE5] bg-[#FFF8EF] dark:bg-[#393438] hover:bg-[#D6BDA5]/30 border border-[#D6BDA5] dark:border-[#5A5055] transition-colors cursor-pointer flex items-center gap-1.5"
                title="Redeem an invitation token"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#777B59]" />
                <span className="hidden sm:inline">Have an Invite?</span>
                <span className="sm:hidden">Join</span>
              </button>

              {canManage && (
                <button
                  onClick={handleOpenInvite}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#FFF8EF] bg-[#777B59] hover:bg-[#63463C] transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-102"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Invite Collaborator</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Current User Role Notice Banner */}
        <div className="mt-6 pt-4 border-t border-[#D6BDA5]/50 dark:border-[#5A5055]/50 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-[#63463C] dark:text-[#D7C5C0] font-medium">Your Role on this Event:</span>
            {getRoleBadge(userRole)}
            <span className="text-[11px] text-[#777B59] dark:text-[#A6A98A]">
              {userRole === 'owner' && '• Complete control, manage collaborators, transfer ownership'}
              {userRole === 'co_organizer' && '• Edit event details, manage tasks/budget/guests, invite collaborators'}
              {userRole === 'editor' && '• Edit permitted sections only, cannot invite collaborators'}
              {userRole === 'viewer' && '• Read-only access to permitted sections'}
            </span>
          </div>

          {isOwner && (
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="text-[11px] font-bold text-[#B58D99] dark:text-[#DEBAC7] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Crown className="w-3 h-3" />
              <span>Transfer Event Ownership</span>
            </button>
          )}
        </div>
      </div>

      {/* Role & Permissions Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#FFF8EF] dark:bg-[#393438] p-4 rounded-2xl border border-[#D6BDA5]/60 dark:border-[#5A5055] space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-xs text-[#392D29] dark:text-[#F5EDE5]">Owner</h4>
            <Crown className="w-3.5 h-3.5 text-[#E2BA84]" />
          </div>
          <p className="text-[11px] text-[#63463C]/80 dark:text-[#D7C5C0] font-sans">
            Total authority. Edit all event info, invite & manage roles, delete or transfer event ownership.
          </p>
        </div>

        <div className="bg-[#FFF8EF] dark:bg-[#393438] p-4 rounded-2xl border border-[#D6BDA5]/60 dark:border-[#5A5055] space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-xs text-[#392D29] dark:text-[#F5EDE5]">Co-Organizer</h4>
            <ShieldCheck className="w-3.5 h-3.5 text-[#777B59]" />
          </div>
          <p className="text-[11px] text-[#63463C]/80 dark:text-[#D7C5C0] font-sans">
            Lead co-planner. Edit details, tasks, budget, guests and timeline. Can invite collaborators.
          </p>
        </div>

        <div className="bg-[#FFF8EF] dark:bg-[#393438] p-4 rounded-2xl border border-[#D6BDA5]/60 dark:border-[#5A5055] space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-xs text-[#392D29] dark:text-[#F5EDE5]">Editor</h4>
            <Edit3 className="w-3.5 h-3.5 text-[#63463C] dark:text-[#D6BDA5]" />
          </div>
          <p className="text-[11px] text-[#63463C]/80 dark:text-[#D7C5C0] font-sans">
            Specialized collaborator. Edit permitted sections (e.g. Florals, Budget). Cannot invite.
          </p>
        </div>

        <div className="bg-[#FFF8EF] dark:bg-[#393438] p-4 rounded-2xl border border-[#D6BDA5]/60 dark:border-[#5A5055] space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-xs text-[#392D29] dark:text-[#F5EDE5]">Viewer</h4>
            <Shield className="w-3.5 h-3.5 text-[#777B59]" />
          </div>
          <p className="text-[11px] text-[#63463C]/80 dark:text-[#D7C5C0] font-sans">
            Read-only observer. Can review permitted sections without making edits or deleting items.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#FFF8EF] dark:bg-[#393438] p-3.5 rounded-2xl border border-[#D6BDA5]/60 dark:border-[#5A5055]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777B59] dark:text-[#A6A98A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team member by name or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F4E8D9] dark:bg-[#29272A] rounded-xl border border-[#D6BDA5]/50 dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-1 focus:ring-[#777B59]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-[#63463C] dark:text-[#D7C5C0]">
            <Filter className="w-3.5 h-3.5 text-[#777B59]" />
            <span className="text-[11px] font-bold">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="text-xs bg-[#F4E8D9] dark:bg-[#29272A] rounded-lg border border-[#D6BDA5]/50 px-2 py-1 text-[#392D29] dark:text-[#F5EDE5]"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="co_organizer">Co-Organizer</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#63463C] dark:text-[#D7C5C0] ml-2">
            <span className="text-[11px] font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs bg-[#F4E8D9] dark:bg-[#29272A] rounded-lg border border-[#D6BDA5]/50 px-2 py-1 text-[#392D29] dark:text-[#F5EDE5]"
            >
              <option value="all">All Status</option>
              <option value="accepted">Accepted</option>
              <option value="pending">Pending Invite</option>
            </select>
          </div>
        </div>
      </div>

      {/* Collaborators List Card */}
      <div className="bg-[#FFF8EF] dark:bg-[#393438] rounded-3xl border-2 border-[#D6BDA5] dark:border-[#5A5055] shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055] flex items-center justify-between bg-[#F4E8D9]/40 dark:bg-[#29272A]/40">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#777B59]" />
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#392D29] dark:text-[#F5EDE5]">
              Active Members & Invitations ({filteredCollaborators.length})
            </h3>
          </div>
          <span className="text-[11px] text-[#777B59] dark:text-[#A6A98A]">
            Event: <strong className="text-[#63463C] dark:text-[#F5EDE5]">{event?.name}</strong>
          </span>
        </div>

        {filteredCollaborators.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F4E8D9] dark:bg-[#29272A] text-[#777B59] flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#392D29] dark:text-[#F5EDE5]">
              No collaborators matched your filter
            </h4>
            <p className="text-xs text-[#63463C]/80 dark:text-[#D7C5C0] max-w-sm mx-auto">
              Try adjusting your search terms or invite someone new to join this celebration.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#D6BDA5]/40 dark:divide-[#5A5055]/40">
            {filteredCollaborators.map((collab) => {
              const isCurrentUser =
                collab.userId === currentUser.id ||
                collab.email.toLowerCase() === currentUser.email.toLowerCase();
              const isEventOwner = collab.role === 'owner';
              const canEditThisMember =
                canManage && (!isEventOwner || isOwner) && !isCurrentUser;

              return (
                <div
                  key={collab.id}
                  className="p-4 sm:p-5 hover:bg-[#F4E8D9]/30 dark:hover:bg-[#454047]/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-2xl bg-[#777B59] text-[#FFF8EF] flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-[#D6BDA5]/60 dark:ring-[#5A5055]">
                        {collab.name.charAt(0).toUpperCase()}
                      </div>
                      {collab.role === 'owner' && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#63463C] text-[#E2BA84] flex items-center justify-center shadow-xs">
                          <Crown className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#392D29] dark:text-[#F5EDE5] truncate">
                          {collab.name}
                        </h4>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#777B59]/15 text-[#777B59] dark:text-[#A6A98A] border border-[#777B59]/30">
                            You
                          </span>
                        )}
                        {getRoleBadge(collab.role)}
                        {collab.status === 'accepted' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#777B59] dark:text-[#A6A98A]">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B58D99] dark:text-[#DEBAC7] bg-[#B58D99]/15 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 animate-spin" />
                            Pending Invitation
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#63463C]/80 dark:text-[#D7C5C0] font-sans flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#777B59]" />
                        <span>{collab.email}</span>
                        {collab.lastActive && (
                          <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A] ml-2">
                            • Last active: {collab.lastActive}
                          </span>
                        )}
                      </p>

                      {/* Permitted Sections Pills */}
                      <div className="pt-1.5 flex flex-wrap items-center gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#777B59] dark:text-[#A6A98A] mr-1">
                          Permitted:
                        </span>
                        {collab.role === 'owner' || collab.role === 'co_organizer' ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#777B59]/10 text-[#777B59] dark:text-[#A6A98A]">
                            All 8 Sections (Full Access)
                          </span>
                        ) : collab.permissions && collab.permissions.length > 0 ? (
                          collab.permissions.map((p) => {
                            const sec = ALL_EVENT_SECTIONS.find((s) => s.id === p);
                            return (
                              <span
                                key={p}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F4E8D9] dark:bg-[#29272A] text-[#63463C] dark:text-[#D7C5C0] border border-[#D6BDA5]/50 dark:border-[#5A5055]"
                              >
                                {sec?.label.split(' ')[0] || p}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-[10px] text-[#B58D99]">No sections assigned</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#D6BDA5]/40">
                    {/* Copy Invite Link if Pending */}
                    {collab.status === 'pending' && collab.inviteToken && (
                      <button
                        onClick={() => handleCopyLink(collab.inviteToken)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#F5EDE5] bg-[#F4E8D9] dark:bg-[#29272A] hover:bg-[#D6BDA5]/40 border border-[#D6BDA5] dark:border-[#5A5055] transition-colors cursor-pointer flex items-center gap-1.5"
                        title="Copy direct invite link"
                      >
                        {copiedToken === collab.inviteToken ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#777B59]" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#777B59]" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Resend invite if pending */}
                    {collab.status === 'pending' && canManage && (
                      <button
                        onClick={() => handleResendInvite(collab)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#777B59] dark:text-[#A6A98A] hover:bg-[#777B59]/10 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Resend</span>
                      </button>
                    )}

                    {/* Edit Permissions */}
                    {canEditThisMember && (
                      <button
                        onClick={() => handleOpenEdit(collab)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#F5EDE5] hover:bg-[#D6BDA5]/30 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#777B59]" />
                        <span>Edit Role</span>
                      </button>
                    )}

                    {/* Remove Member */}
                    {canEditThisMember && !isEventOwner && (
                      <button
                        onClick={() => handleRemoveCollaborator(collab)}
                        className="p-1.5 rounded-xl text-[#B58D99] hover:bg-[#B58D99]/15 transition-colors cursor-pointer"
                        title="Remove collaborator"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. INVITE COLLABORATOR MODAL */}
      {/* ======================================================== */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative bg-[#FFF8EF] dark:bg-[#393438] w-full max-w-xl rounded-3xl border-2 border-[#D6BDA5] dark:border-[#5A5055] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Rivets */}
            <div className="absolute top-3 left-3 pointer-events-none opacity-80">
              <ScrewRivet />
            </div>
            <div className="absolute top-3 right-3 pointer-events-none opacity-80">
              <ScrewRivet />
            </div>

            <div className="flex items-start justify-between border-b border-[#D6BDA5]/60 dark:border-[#5A5055] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#777B59] dark:text-[#A6A98A]">
                  <UserPlus className="w-4 h-4" />
                  <span>Woodland Dispatch</span>
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#392D29] dark:text-[#F5EDE5] mt-1">
                  Invite a New Collaborator
                </h3>
                <p className="text-xs text-[#63463C]/80 dark:text-[#D7C5C0] mt-0.5">
                  Send access to join "{event?.name}".
                </p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4E8D9] dark:bg-[#29272A] text-[#63463C] dark:text-[#D7C5C0] flex items-center justify-center hover:bg-[#D6BDA5] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-5">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#392D29] dark:text-[#F5EDE5]">
                  Collaborator Email Address <span className="text-[#B58D99]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777B59]" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. florist.clara@woodlandbotanicals.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#F4E8D9] dark:bg-[#29272A] rounded-xl border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-1 focus:ring-[#777B59]"
                  />
                </div>
              </div>

              {/* Full Name / Nickname */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#392D29] dark:text-[#F5EDE5]">
                  Full Name or Display Label (Optional)
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Clara Thorne (Lead Floral Stylist)"
                  className="w-full px-3 py-2 text-xs bg-[#F4E8D9] dark:bg-[#29272A] rounded-xl border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-1 focus:ring-[#777B59]"
                />
              </div>

              {/* Access Role Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#392D29] dark:text-[#F5EDE5]">
                  Select Access Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setInviteRole('co_organizer')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      inviteRole === 'co_organizer'
                        ? 'border-[#777B59] bg-[#777B59]/15 ring-2 ring-[#777B59]/40'
                        : 'border-[#D6BDA5] dark:border-[#5A5055] hover:bg-[#F4E8D9]/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-[#392D29] dark:text-[#F5EDE5]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#777B59]" />
                      <span>Co-Organizer</span>
                    </div>
                    <p className="text-[10px] text-[#63463C]/80 dark:text-[#D7C5C0] mt-1">
                      Lead planning, edit all sections & invite collaborators.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteRole('editor')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      inviteRole === 'editor'
                        ? 'border-[#63463C] bg-[#63463C]/15 ring-2 ring-[#63463C]/40'
                        : 'border-[#D6BDA5] dark:border-[#5A5055] hover:bg-[#F4E8D9]/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-[#392D29] dark:text-[#F5EDE5]">
                      <Edit3 className="w-3.5 h-3.5 text-[#63463C]" />
                      <span>Editor</span>
                    </div>
                    <p className="text-[10px] text-[#63463C]/80 dark:text-[#D7C5C0] mt-1">
                      Can edit only permitted sections selected below.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteRole('viewer')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      inviteRole === 'viewer'
                        ? 'border-[#A6A98A] bg-[#A6A98A]/20 ring-2 ring-[#A6A98A]/40'
                        : 'border-[#D6BDA5] dark:border-[#5A5055] hover:bg-[#F4E8D9]/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-[#392D29] dark:text-[#F5EDE5]">
                      <Shield className="w-3.5 h-3.5 text-[#777B59]" />
                      <span>Viewer</span>
                    </div>
                    <p className="text-[10px] text-[#63463C]/80 dark:text-[#D7C5C0] mt-1">
                      Read-only access to permitted sections.
                    </p>
                  </button>
                </div>
              </div>

              {/* Granular Section Permissions Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-[#D6BDA5]/40 dark:border-[#5A5055]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-[#392D29] dark:text-[#F5EDE5]">
                      Granular Section Permissions (8 Sections)
                    </label>
                    <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A]">
                      Select individual sections this collaborator can access.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={selectAllSections}
                      className="text-[#777B59] font-bold hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={clearAllSections}
                      className="text-[#B58D99] font-bold hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#F4E8D9]/40 dark:bg-[#29272A]/40 p-3 rounded-2xl border border-[#D6BDA5]/50">
                  {ALL_EVENT_SECTIONS.map((sec) => {
                    const isChecked =
                      inviteRole === 'co_organizer'
                        ? true
                        : inviteSections.includes(sec.id);
                    return (
                      <label
                        key={sec.id}
                        className={`flex items-start gap-2.5 p-2 rounded-xl transition-colors ${
                          inviteRole === 'co_organizer' ? 'opacity-80' : 'cursor-pointer hover:bg-[#F4E8D9] dark:hover:bg-[#393438]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={inviteRole === 'co_organizer'}
                          onChange={() => toggleSectionPermission(sec.id)}
                          className="mt-0.5 rounded border-[#63463C] text-[#777B59] focus:ring-[#777B59]"
                        />
                        <div className="text-left leading-tight">
                          <span className="text-xs font-bold text-[#392D29] dark:text-[#F5EDE5] block">
                            {sec.label}
                          </span>
                          <span className="text-[10px] text-[#63463C]/80 dark:text-[#D7C5C0] block">
                            {sec.description}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Disclosure */}
              <div className="p-3 rounded-xl bg-[#777B59]/10 border border-[#777B59]/30 text-[11px] text-[#63463C] dark:text-[#D7C5C0] space-y-1">
                <p className="font-bold text-[#777B59] dark:text-[#A6A98A] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Invitation Dispatch & Immediate Link Access
                </p>
                <p>
                  An invitation token will be created and associated with this celebration. You can also
                  copy the direct link immediately after creation to share via messaging or external mail.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6BDA5]/60">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#D6BDA5]/30 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#FFF8EF] bg-[#777B59] hover:bg-[#63463C] shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Woodland Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. EDIT PERMISSIONS MODAL */}
      {/* ======================================================== */}
      {isEditModalOpen && editingCollab && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative bg-[#FFF8EF] dark:bg-[#393438] w-full max-w-lg rounded-3xl border-2 border-[#D6BDA5] dark:border-[#5A5055] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Rivets */}
            <div className="absolute top-3 left-3 pointer-events-none opacity-80">
              <ScrewRivet />
            </div>
            <div className="absolute top-3 right-3 pointer-events-none opacity-80">
              <ScrewRivet />
            </div>

            <div className="flex items-start justify-between border-b border-[#D6BDA5]/60 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#392D29] dark:text-[#F5EDE5]">
                  Edit Collaborator Access
                </h3>
                <p className="text-xs text-[#63463C]/80 dark:text-[#D7C5C0] mt-0.5">
                  Update role and section access for <strong>{editingCollab.name || editingCollab.email}</strong>.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4E8D9] dark:bg-[#29272A] text-[#63463C] flex items-center justify-center hover:bg-[#D6BDA5] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#392D29] dark:text-[#F5EDE5]">
                  Assigned Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['co_organizer', 'editor', 'viewer'] as EventRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setInviteRole(r)}
                      className={`p-2.5 rounded-xl border text-xs font-bold capitalize cursor-pointer transition-all ${
                        inviteRole === r
                          ? 'border-[#777B59] bg-[#777B59] text-[#FFF8EF]'
                          : 'border-[#D6BDA5] bg-[#F4E8D9]/40 text-[#392D29] dark:text-[#F5EDE5]'
                      }`}
                    >
                      {r.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sections checkboxes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#392D29] dark:text-[#F5EDE5]">
                    Permitted Sections
                  </label>
                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={selectAllSections}
                      className="text-[#777B59] font-bold hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={clearAllSections}
                      className="text-[#B58D99] font-bold hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#F4E8D9]/40 dark:bg-[#29272A]/40 p-3 rounded-2xl border border-[#D6BDA5]/50 max-h-56 overflow-y-auto">
                  {ALL_EVENT_SECTIONS.map((sec) => {
                    const isChecked =
                      inviteRole === 'co_organizer'
                        ? true
                        : inviteSections.includes(sec.id);
                    return (
                      <label
                        key={sec.id}
                        className={`flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-[#392D29] dark:text-[#F5EDE5] ${
                          inviteRole === 'co_organizer' ? 'opacity-80' : 'cursor-pointer hover:bg-[#F4E8D9]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={inviteRole === 'co_organizer'}
                          onChange={() => toggleSectionPermission(sec.id)}
                          className="rounded border-[#63463C] text-[#777B59]"
                        />
                        <span>{sec.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6BDA5]/60">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#D6BDA5]/30 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#FFF8EF] bg-[#777B59] hover:bg-[#63463C] shadow-md transition-all cursor-pointer"
                >
                  Save Access Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TRANSFER OWNERSHIP MODAL */}
      {/* ======================================================== */}
      {isTransferModalOpen && isOwner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative bg-[#FFF8EF] dark:bg-[#393438] w-full max-w-lg rounded-3xl border-2 border-[#D6BDA5] dark:border-[#5A5055] p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Rivets */}
            <div className="absolute top-3 left-3 pointer-events-none opacity-80">
              <ScrewRivet />
            </div>
            <div className="absolute top-3 right-3 pointer-events-none opacity-80">
              <ScrewRivet />
            </div>

            <div className="flex items-start justify-between border-b border-[#D6BDA5]/60 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B58D99]">
                  <Crown className="w-4 h-4" />
                  <span>Permanent Transfer</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-[#392D29] dark:text-[#F5EDE5] mt-1">
                  Transfer Event Ownership
                </h3>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4E8D9] dark:bg-[#29272A] text-[#63463C] flex items-center justify-center hover:bg-[#D6BDA5] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#B58D99]/15 border border-[#B58D99]/30 text-xs text-[#63463C] dark:text-[#F5EDE5] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#B58D99] dark:text-[#DEBAC7]">
                <AlertCircle className="w-4 h-4" />
                <span>Important Ownership Transfer Notice</span>
              </div>
              <p>
                Transferring ownership gives the new owner complete control over <strong>"{event?.name}"</strong>,
                including the power to manage or remove collaborators and delete the celebration.
                You will become a Co-Organizer with lead planning access.
              </p>
            </div>

            <form onSubmit={handleTransferOwnership} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#392D29] dark:text-[#F5EDE5]">
                  Select New Owner (must be an accepted collaborator)
                </label>
                <select
                  required
                  value={transferTargetEmail}
                  onChange={(e) => setTransferTargetEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F4E8D9] dark:bg-[#29272A] rounded-xl border border-[#D6BDA5] text-[#392D29] dark:text-[#F5EDE5]"
                >
                  <option value="">-- Choose Collaborator --</option>
                  {collaborators
                    .filter((c) => c.role !== 'owner' && c.status === 'accepted')
                    .map((c) => (
                      <option key={c.id} value={c.email}>
                        {c.name} ({c.email}) - {c.role.replace('_', ' ')}
                      </option>
                    ))}
                </select>
              </div>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-[#F4E8D9]/40 border border-[#D6BDA5]/50 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={transferConfirmed}
                  onChange={(e) => setTransferConfirmed(e.target.checked)}
                  className="rounded text-[#63463C]"
                />
                <span className="text-[#392D29] dark:text-[#F5EDE5] font-medium">
                  I understand that I am transferring primary event ownership.
                </span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6BDA5]/60">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#D6BDA5]/30 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!transferConfirmed || !transferTargetEmail}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#FFF8EF] bg-[#63463C] hover:bg-[#392D29] disabled:opacity-50 transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Crown className="w-3.5 h-3.5 text-[#E2BA84]" />
                  <span>Confirm Ownership Transfer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. ACCEPT INVITATION TOKEN MODAL */}
      {/* ======================================================== */}
      {isAcceptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative bg-[#FFF8EF] dark:bg-[#393438] w-full max-w-md rounded-3xl border-2 border-[#D6BDA5] dark:border-[#5A5055] p-6 shadow-2xl space-y-5">
            {/* Rivets */}
            <div className="absolute top-3 left-3 pointer-events-none opacity-80">
              <ScrewRivet />
            </div>
            <div className="absolute top-3 right-3 pointer-events-none opacity-80">
              <ScrewRivet />
            </div>

            <div className="flex items-start justify-between border-b border-[#D6BDA5]/60 pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#777B59]">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Woodland Key</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#392D29] dark:text-[#F5EDE5] mt-0.5">
                  Redeem Invitation Token
                </h3>
              </div>
              <button
                onClick={() => setIsAcceptModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F4E8D9] text-[#63463C] flex items-center justify-center hover:bg-[#D6BDA5] cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#63463C]/80 dark:text-[#D7C5C0]">
              Enter the invitation code received from an event organizer to join the planning circle:
            </p>

            <form onSubmit={handleAcceptToken} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#392D29] dark:text-[#F5EDE5]">
                  Invitation Token
                </label>
                <input
                  type="text"
                  required
                  value={inviteTokenInput}
                  onChange={(e) => setInviteTokenInput(e.target.value)}
                  placeholder="e.g. mm-inv-clara-finch-782"
                  className="w-full px-3 py-2 text-xs font-mono bg-[#F4E8D9] dark:bg-[#29272A] rounded-xl border border-[#D6BDA5] text-[#392D29] dark:text-[#F5EDE5]"
                />
              </div>

              {/* Sample tokens quick helper for demo evaluation */}
              <div className="p-2.5 rounded-xl bg-[#F4E8D9]/50 dark:bg-[#29272A]/50 border border-[#D6BDA5]/40 text-[10px] text-[#63463C] dark:text-[#D7C5C0] space-y-1">
                <span className="font-bold text-[#777B59] block">Quick Demo Tokens:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setInviteTokenInput('mm-inv-clara-finch-782')}
                    className="underline text-[#777B59] hover:text-[#63463C] cursor-pointer"
                  >
                    mm-inv-clara-finch-782 (Viewer)
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setInviteTokenInput('mm-inv-marigold-music-991')}
                    className="underline text-[#777B59] hover:text-[#63463C] cursor-pointer"
                  >
                    mm-inv-marigold-music-991 (Editor)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D6BDA5]/50">
                <button
                  type="button"
                  onClick={() => setIsAcceptModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#D6BDA5]/30 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-[#FFF8EF] bg-[#777B59] hover:bg-[#63463C] transition-all cursor-pointer shadow-xs"
                >
                  Join Celebration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
