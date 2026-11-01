import React, { useState } from 'react';
import {
  Clock,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Edit2,
  Printer,
  X,
  MapPin,
  UserCheck,
  Shield,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon } from '../common/WoodlandIcons';
import { TimelineSlot, EventItem, TaskItem } from '../../types';

interface TimelineCalendarProps {
  timeline: TimelineSlot[];
  events: EventItem[];
  tasks: TaskItem[];
  activeEvent: EventItem | undefined;
  onSaveSlot: (slot: Omit<TimelineSlot, 'id'> & { id?: string }) => void;
  onDeleteSlot: (id: string) => void;
  canEdit?: boolean;
}

export const TimelineCalendar: React.FC<TimelineCalendarProps> = ({
  timeline,
  events,
  tasks,
  activeEvent,
  onSaveSlot,
  onDeleteSlot,
  canEdit = true,
}) => {
  const [filterEventId, setFilterEventId] = useState<string>(activeEvent?.id || events[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimelineSlot | null>(null);

  const [time, setTime] = useState('14:00');
  const [activity, setActivity] = useState('');
  const [location, setLocation] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('Lead Coordinator');
  const [notes, setNotes] = useState('');
  const [slotEventId, setSlotEventId] = useState(activeEvent?.id || events[0]?.id || '');
  const [formError, setFormError] = useState('');

  const activeTimeline = timeline
    .filter((t) => t.eventId === filterEventId)
    .sort((a, b) => a.time.localeCompare(b.time));

  const openAddModal = () => {
    setEditingSlot(null);
    setTime('14:00');
    setActivity('');
    setLocation(activeEvent?.location || '');
    setResponsiblePerson('Bhumika Devnath');
    setNotes('');
    setSlotEventId(filterEventId);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (slot: TimelineSlot) => {
    setEditingSlot(slot);
    setTime(slot.time);
    setActivity(slot.activity);
    setLocation(slot.location || '');
    setResponsiblePerson(slot.responsiblePerson || '');
    setNotes(slot.notes || '');
    setSlotEventId(slot.eventId);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) {
      setFormError('Activity name is required.');
      return;
    }
    if (!time.trim()) {
      setFormError('Time slot is required.');
      return;
    }

    onSaveSlot({
      id: editingSlot ? editingSlot.id : undefined,
      eventId: slotEventId,
      time: time.trim(),
      activity: activity.trim(),
      location: location.trim(),
      responsiblePerson: responsiblePerson.trim(),
      notes: notes.trim(),
      completed: editingSlot ? editingSlot.completed : false,
    });
    setIsModalOpen(false);
  };

  const handleToggleComplete = (slot: TimelineSlot) => {
    onSaveSlot({
      ...slot,
      completed: !slot.completed,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedEventObj = events.find((e) => e.id === filterEventId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A]">
              Day-of Itinerary & Milestones
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
            Run of Show & Timeline
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="bg-[#FFF8EF] dark:bg-[#393438] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] text-[#63463C] dark:text-[#F5EDE5] font-bold px-3 py-2 rounded-xl border border-[#D6BDA5] dark:border-[#5A5055] text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
            <span>Print Itinerary</span>
          </button>
          {canEdit ? (
            <button
              onClick={openAddModal}
              className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2 rounded-xl border border-[#A6A98A] text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Time Slot</span>
            </button>
          ) : (
            <div className="bg-[#A6A98A]/20 text-[#63463C] dark:text-[#D7C5C0] font-bold px-3 py-2 rounded-xl border border-[#A6A98A]/40 text-xs flex items-center gap-1.5 shadow-xs">
              <Shield className="w-4 h-4 text-[#777B59]" />
              <span>View-Only Mode</span>
            </div>
          )}
        </div>
      </div>

      {/* Gathering selector bar */}
      <div className="parchment-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#63463C] dark:text-[#D7C5C0]">Select Gathering:</span>
          <select
            value={filterEventId}
            onChange={(e) => setFilterEventId(e.target.value)}
            className="text-xs p-2 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5] font-medium"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.eventDate || 'Upcoming'})
              </option>
            ))}
          </select>
        </div>

        {selectedEventObj && (
          <div className="text-xs text-[#777B59] dark:text-[#A6A98A] font-medium flex items-center gap-2">
            <span>{selectedEventObj.location || 'Botanical Glasshouse'}</span>
            <span>·</span>
            <span>{selectedEventObj.guestCount} guests expected</span>
          </div>
        )}
      </div>

      {/* Timeline Run of Show View */}
      <div className="parchment-card rounded-3xl p-6 sm:p-8 relative shadow-md">
        <div className="absolute top-4 left-4"><ScrewRivet /></div>
        <div className="absolute top-4 right-4"><ScrewRivet /></div>

        <h3 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
          <span>Day-of Schedule ({selectedEventObj?.name})</span>
        </h3>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D6BDA5] dark:border-[#5A5055] space-y-6">
          {activeTimeline.map((slot) => {
            const isDone = slot.completed;
            return (
              <div key={slot.id} className="relative group">
                {/* Node rivet */}
                <button
                  onClick={() => canEdit && handleToggleComplete(slot)}
                  disabled={!canEdit}
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                    isDone
                      ? 'bg-[#777B59] border-[#FFF8EF] dark:border-[#29272A] text-[#FFF8EF]'
                      : 'bg-[#FFF8EF] dark:bg-[#393438] border-[#777B59] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]'
                  } ${!canEdit ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                  title={canEdit ? (isDone ? 'Mark as incomplete' : 'Mark as completed') : 'Read-only access'}
                >
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                {/* Card slot */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-[#F4E8D9]/40 dark:bg-[#29272A]/40 border-[#D6BDA5]/50 dark:border-[#5A5055]/50 opacity-75'
                      : 'bg-[#FFF8EF] dark:bg-[#393438] border-[#D6BDA5] dark:border-[#5A5055] hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold bg-[#777B59] text-[#FFF8EF] px-2.5 py-1 rounded-lg">
                        {slot.time}
                      </span>
                      <h4
                        className={`font-serif text-lg font-bold text-[#63463C] dark:text-[#F5EDE5] break-words ${
                          isDone ? 'line-through text-[#392D29]/50 dark:text-[#D7C5C0]/50' : ''
                        }`}
                      >
                        {slot.activity}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {slot.responsiblePerson && (
                        <span className="text-[11px] text-[#63463C] dark:text-[#D7C5C0] bg-[#F4E8D9] dark:bg-[#29272A] px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-[#777B59] dark:text-[#A6A98A]" />
                          <span>{slot.responsiblePerson}</span>
                        </span>
                      )}
                      {canEdit ? (
                        <>
                          <button
                            onClick={() => openEditModal(slot)}
                            className="p-1 rounded text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#29272A] cursor-pointer"
                            title="Edit slot"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteSlot(slot.id)}
                            className="p-1 rounded text-[#B58D99] hover:bg-[#F4E8D9] dark:hover:bg-[#29272A] cursor-pointer"
                            title="Delete slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-[#777B59] dark:text-[#A6A98A]">Read-Only</span>
                      )}
                    </div>
                  </div>

                  {slot.location && (
                    <p className="text-xs text-[#777B59] dark:text-[#A6A98A] flex items-center gap-1 mb-1 font-medium">
                      <MapPin className="w-3 h-3" />
                      <span>{slot.location}</span>
                    </p>
                  )}

                  {slot.notes && (
                    <p className="text-xs text-[#392D29]/80 dark:text-[#D7C5C0]/80 leading-relaxed font-sans">{slot.notes}</p>
                  )}
                </div>
              </div>
            );
          })}

          {activeTimeline.length === 0 && (
            <div className="py-8 text-center text-[#392D29]/60 dark:text-[#D7C5C0]/60">
              <Clock className="w-10 h-10 text-[#777B59] dark:text-[#A6A98A] mx-auto mb-2 opacity-60" />
              <p className="font-serif text-base font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">
                No Schedule Configured Yet
              </p>
              <p className="text-xs max-w-sm mx-auto mb-3">
                Generate a timeline using our AI Event Planner or add your own milestones.
              </p>
              <button
                onClick={openAddModal}
                className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2 rounded-xl text-xs"
              >
                Add First Time Slot
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Time Slot Modal */}
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
              {editingSlot ? 'Edit Timeline Slot' : 'Add Time Slot'}
            </h2>

            {formError && (
              <div className="mb-4 p-2.5 rounded-xl bg-[#B58D99]/20 border border-[#B58D99] text-xs text-[#63463C] dark:text-[#F5EDE5]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">
                    Time <span className="text-[#B58D99]">*</span>
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 15:30 or 3:30 PM"
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs font-mono text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">
                    Activity / Milestone <span className="text-[#B58D99]">*</span>
                  </label>
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    placeholder="e.g. Guest Arrival & Botanical Spritzers"
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">Location / Zone</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Center Lawn or Glasshouse Rotunda"
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">Person in Charge</label>
                  <input
                    type="text"
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    placeholder="e.g. Lead Stylist, Musician, Officiant"
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#D7C5C0] mb-1">Coordination Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Cues, lighting adjustments, song signals..."
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
                  {editingSlot ? 'Save Changes' : 'Add Time Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
