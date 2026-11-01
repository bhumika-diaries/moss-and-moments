import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Edit2,
  Utensils,
  Mail,
  Phone,
  X,
  Share2,
  Check,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon } from '../common/WoodlandIcons';
import { GuestItem, RSVPStatus, EventItem } from '../../types';

interface GuestManagerProps {
  guests: GuestItem[];
  events: EventItem[];
  activeEvent: EventItem | undefined;
  onSaveGuest: (guest: Omit<GuestItem, 'id' | 'createdAt'> & { id?: string }) => void;
  onUpdateRSVP: (id: string, status: RSVPStatus) => void;
  onDeleteGuest: (id: string) => void;
}

export const GuestManager: React.FC<GuestManagerProps> = ({
  guests,
  events,
  activeEvent,
  onSaveGuest,
  onUpdateRSVP,
  onDeleteGuest,
}) => {
  const [filterEventId, setFilterEventId] = useState<string>(activeEvent?.id || 'all');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>('Pending');
  const [groupType, setGroupType] = useState<GuestItem['groupType']>('Friends');
  const [plusOnes, setPlusOnes] = useState(0);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [guestEventId, setGuestEventId] = useState(activeEvent?.id || events[0]?.id || '');
  const [formError, setFormError] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const openAddModal = () => {
    setEditingGuest(null);
    setName('');
    setEmail('');
    setPhone('');
    setRsvpStatus('Pending');
    setGroupType('Friends');
    setPlusOnes(0);
    setDietaryRestrictions('');
    setTableNumber('');
    setGuestEventId(activeEvent?.id || events[0]?.id || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (g: GuestItem) => {
    setEditingGuest(g);
    setName(g.name);
    setEmail(g.email || '');
    setPhone(g.phone || '');
    setRsvpStatus(g.rsvpStatus);
    setGroupType(g.groupType);
    setPlusOnes(g.plusOnes || 0);
    setDietaryRestrictions(g.dietaryRestrictions || '');
    setTableNumber(g.tableNumber || '');
    setGuestEventId(g.eventId);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Guest name or party title is required.');
      return;
    }
    if (!guestEventId) {
      setFormError('Please select a gathering.');
      return;
    }

    onSaveGuest({
      id: editingGuest ? editingGuest.id : undefined,
      eventId: guestEventId,
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      rsvpStatus,
      groupType,
      plusOnes: Number(plusOnes) || 0,
      dietaryRestrictions: dietaryRestrictions.trim() || undefined,
      tableNumber: tableNumber.trim() || undefined,
    });
    setIsModalOpen(false);
  };

  // Metrics calculation
  const activeEventGuests = filterEventId === 'all'
    ? guests
    : guests.filter((g) => g.eventId === filterEventId);

  const acceptedGuests = activeEventGuests.filter((g) => g.rsvpStatus === 'Accepted');
  const pendingGuests = activeEventGuests.filter((g) => g.rsvpStatus === 'Pending');
  const declinedGuests = activeEventGuests.filter((g) => g.rsvpStatus === 'Declined');
  const totalGuests = activeEventGuests.length;
  const totalPlusOnes = activeEventGuests.reduce((sum, g) => sum + (g.plusOnes || 0), 0);
  const dietaryCount = activeEventGuests.filter((g) => g.dietaryRestrictions && g.dietaryRestrictions.trim().length > 0).length;

  const displayedGuests = activeEventGuests.filter((g) => {
    const matchesStatus = filterStatus === 'All' || g.rsvpStatus === filterStatus;
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.email && g.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.dietaryRestrictions && g.dietaryRestrictions.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleCopySummary = () => {
    const eventObj = events.find((e) => e.id === filterEventId);
    const text = `Moss & Moments RSVP Report for: ${eventObj ? eventObj.name : 'All Gatherings'}
Total Invited: ${totalGuests} (Plus ${totalPlusOnes} plus-ones)
Attending: ${acceptedGuests.length}
Pending: ${pendingGuests.length}
Declined: ${declinedGuests.length}
Dietary Notes: ${dietaryCount} guests with special requests.
`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A]">
              Circle of Kin & Guests
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
            Guest & RSVP Management
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopySummary}
            className="bg-[#FFF8EF] dark:bg-[#393438] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] text-[#63463C] dark:text-[#F5EDE5] font-bold px-3 py-2 rounded-xl border border-[#D6BDA5] dark:border-[#5A5055] text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copied' : 'RSVP Summary'}</span>
          </button>
          <button
            onClick={openAddModal}
            className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2 rounded-xl border border-[#A6A98A] text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attending */}
        <div className="parchment-card rounded-2xl p-4 relative">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#777B59] dark:text-[#A6A98A]">
            <CheckCircle2 className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
            <span>Attending</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5] tabular-nums font-mono">
              {acceptedGuests.length}
            </span>
            <span className="text-[11px] text-[#777B59] dark:text-[#A6A98A] font-semibold">
              (+{acceptedGuests.reduce((s, g) => s + (g.plusOnes || 0), 0)} companions)
            </span>
          </div>
        </div>

        {/* Pending */}
        <div className="parchment-card rounded-2xl p-4 relative">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#63463C] dark:text-[#D7C5C0]">
            <Clock className="w-4 h-4 text-[#D6BDA5] dark:text-[#A6A98A]" />
            <span>Awaiting RSVP</span>
          </div>
          <span className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5] tabular-nums font-mono">
            {pendingGuests.length}
          </span>
        </div>

        {/* Declined */}
        <div className="parchment-card rounded-2xl p-4 relative">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#B58D99]">
            <XCircle className="w-4 h-4 text-[#B58D99]" />
            <span>Cannot Attend</span>
          </div>
          <span className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5] tabular-nums font-mono">
            {declinedGuests.length}
          </span>
        </div>

        {/* Dietary Alerts */}
        <div className="parchment-card rounded-2xl p-4 relative">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#63463C] dark:text-[#D7C5C0]">
            <Utensils className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
            <span>Dietary Needs</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5] tabular-nums font-mono">
              {dietaryCount}
            </span>
            <span className="text-[11px] text-[#392D29]/70 dark:text-[#B7A9A6]">special menus</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFF8EF] dark:bg-[#393438] p-4 rounded-2xl border border-[#D6BDA5] dark:border-[#5A5055] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-[#63463C] dark:text-[#D7C5C0]">Gathering:</span>
          <select
            value={filterEventId}
            onChange={(e) => setFilterEventId(e.target.value)}
            className="text-xs p-1.5 rounded-xl bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5]"
          >
            <option value="all">All Gatherings</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 pl-2 border-l border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
            {['All', 'Accepted', 'Pending', 'Declined'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#777B59] text-[#FFF8EF]'
                    : 'text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#777B59] dark:text-[#A6A98A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guest or dietary note..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#F4E8D9]/70 dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-1 focus:ring-[#777B59]"
          />
        </div>
      </div>

      {/* Guest Table */}
      <div className="parchment-card rounded-3xl p-6 relative shadow-md overflow-hidden">
        <div className="overflow-x-auto rounded-2xl border border-[#D6BDA5] dark:border-[#5A5055]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#63463C] dark:bg-[#393438] text-[#FFF8EF] font-serif text-xs font-semibold border-b border-[#4A322A] dark:border-[#5A5055]">
              <tr>
                <th className="py-2.5 px-3">Guest Name & Group</th>
                <th className="py-2.5 px-3">Contact Details</th>
                <th className="py-2.5 px-3">RSVP Status & Toggle</th>
                <th className="py-2.5 px-3">Plus-Ones</th>
                <th className="py-2.5 px-3">Dietary & Table</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6BDA5]/40 dark:divide-[#5A5055]/40 bg-[#FFF8EF] dark:bg-[#393438]">
              {displayedGuests.map((guest) => {
                return (
                  <tr key={guest.id} className="hover:bg-[#F4E8D9]/50 dark:hover:bg-[#454047] transition-colors">
                    {/* Name & Group */}
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#63463C] dark:text-[#F5EDE5] text-sm break-words">{guest.name}</p>
                      <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A] font-semibold">
                        Group: {guest.groupType}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3 text-[#392D29]/80 dark:text-[#D7C5C0]/80 font-mono text-[11px]">
                      {guest.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-[#777B59] dark:text-[#A6A98A]" />
                          <span>{guest.email}</span>
                        </div>
                      )}
                      {guest.phone && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-[#777B59] dark:text-[#A6A98A]" />
                          <span>{guest.phone}</span>
                        </div>
                      )}
                      {!guest.email && !guest.phone && <span className="text-gray-400 dark:text-gray-500">—</span>}
                    </td>

                    {/* Quick RSVP toggle buttons */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateRSVP(guest.id, 'Accepted')}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            guest.rsvpStatus === 'Accepted'
                              ? 'bg-[#777B59] text-[#FFF8EF] shadow-xs'
                              : 'bg-[#F4E8D9] dark:bg-[#29272A] text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#A6A98A]/30'
                          }`}
                          title="Set status to Attending"
                        >
                          Attending
                        </button>
                        <button
                          onClick={() => onUpdateRSVP(guest.id, 'Pending')}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            guest.rsvpStatus === 'Pending'
                              ? 'bg-[#63463C] dark:bg-[#454047] text-[#FFF8EF] shadow-xs'
                              : 'bg-[#F4E8D9] dark:bg-[#29272A] text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#D6BDA5]/50'
                          }`}
                          title="Set status to Pending"
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => onUpdateRSVP(guest.id, 'Declined')}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            guest.rsvpStatus === 'Declined'
                              ? 'bg-[#B58D99] text-[#FFF8EF] shadow-xs'
                              : 'bg-[#F4E8D9] dark:bg-[#29272A] text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#B58D99]/20'
                          }`}
                          title="Set status to Declined"
                        >
                          Declined
                        </button>
                      </div>
                    </td>

                    {/* Plus Ones */}
                    <td className="py-3 px-3 font-mono font-bold text-[#63463C] dark:text-[#F5EDE5]">
                      {guest.plusOnes > 0 ? `+${guest.plusOnes}` : '0'}
                    </td>

                    {/* Dietary & Seating Table */}
                    <td className="py-3 px-3">
                      {guest.dietaryRestrictions && (
                        <p className="text-[11px] text-[#B58D99] font-medium flex items-center gap-1">
                          <Utensils className="w-3 h-3 shrink-0" />
                          <span>{guest.dietaryRestrictions}</span>
                        </p>
                      )}
                      {guest.tableNumber && (
                        <p className="text-[10px] text-[#777B59] dark:text-[#A6A98A] font-semibold mt-0.5">
                          {guest.tableNumber}
                        </p>
                      )}
                      {!guest.dietaryRestrictions && !guest.tableNumber && (
                        <span className="text-gray-400 dark:text-gray-500 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(guest)}
                          className="p-1 rounded text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#29272A] cursor-pointer"
                          title="Edit guest"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Remove "${guest.name}" from guest list?`)) {
                              onDeleteGuest(guest.id);
                            }
                          }}
                          className="p-1 rounded text-[#B58D99] hover:bg-[#F4E8D9] dark:hover:bg-[#29272A] cursor-pointer"
                          title="Delete guest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {displayedGuests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#392D29]/60 dark:text-[#B7A9A6]">
                    <p className="font-serif text-base font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">No guests found</p>
                    <p className="text-xs">Click "Add Guest" to record your first invitation.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29272A]/70 backdrop-blur-xs font-sans">
          <div className="parchment-card rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055]">
            <div className="absolute top-4 left-4"><ScrewRivet /></div>
            <div className="absolute top-4 right-4"><ScrewRivet /></div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-10 p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-4">
              {editingGuest ? 'Edit Guest' : 'Add New Guest'}
            </h2>

            {formError && (
              <div className="mb-4 p-2.5 rounded-xl bg-[#B58D99]/20 border border-[#B58D99] text-xs text-[#63463C] dark:text-[#F5EDE5]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">
                  Full Name / Party Title <span className="text-[#B58D99]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor & Alistair Vance"
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Gathering</label>
                <select
                  value={guestEventId}
                  onChange={(e) => setGuestEventId(e.target.value)}
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
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guest@domain.com"
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">RSVP Status</label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value as RSVPStatus)}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  >
                    <option value="Accepted">Accepted</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Group Type</label>
                  <select
                    value={groupType}
                    onChange={(e) => setGroupType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  >
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="VIP">VIP</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Plus-Ones</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={plusOnes}
                    onChange={(e) => setPlusOnes(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs font-mono text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Dietary Requirements</label>
                  <input
                    type="text"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    placeholder="e.g. Vegan, Gluten-free, Nut allergy"
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Table Assignment</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 1 — Oak Canopy"
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
                >
                  {editingGuest ? 'Save Guest' : 'Add Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
