import React, { useState } from 'react';
import {
  CheckSquare,
  PlusCircle,
  Search,
  Trash2,
  Edit2,
  Calendar,
  X,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon } from '../common/WoodlandIcons';
import { TaskItem, TaskPriority, EventItem } from '../../types';

interface TaskManagerProps {
  tasks: TaskItem[];
  events: EventItem[];
  activeEvent: EventItem | undefined;
  onToggleTask: (id: string) => void;
  onSaveTask: (task: Omit<TaskItem, 'id' | 'createdAt'> & { id?: string }) => void;
  onDeleteTask: (id: string) => void;
  onSelectEvent: (id: string) => void;
}

const CATEGORIES = [
  'All',
  'Venue',
  'Catering',
  'Floral & Decor',
  'Music & Sound',
  'Stationery',
  'Favors',
  'Photography',
  'Logistics',
];

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  events,
  activeEvent,
  onToggleTask,
  onSaveTask,
  onDeleteTask,
}) => {
  const [filterEventId, setFilterEventId] = useState<string>(activeEvent?.id || 'all');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Task Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium');
  const [taskCategory, setTaskCategory] = useState('Floral & Decor');
  const [taskEventId, setTaskEventId] = useState(activeEvent?.id || events[0]?.id || '');
  const [taskNotes, setTaskNotes] = useState('');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setTaskPriority('Medium');
    setTaskCategory('Floral & Decor');
    setTaskEventId(activeEvent?.id || events[0]?.id || '');
    setTaskNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDueDate(task.dueDate || '');
    setTaskPriority(task.priority);
    setTaskCategory(task.category || 'Floral & Decor');
    setTaskEventId(task.eventId);
    setTaskNotes(task.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setFormError('Task title is required.');
      return;
    }
    if (!taskEventId) {
      setFormError('Please choose which celebration this task belongs to.');
      return;
    }

    onSaveTask({
      id: editingTask ? editingTask.id : undefined,
      eventId: taskEventId,
      title: taskTitle.trim(),
      dueDate: taskDueDate,
      priority: taskPriority,
      status: editingTask ? editingTask.status : 'Pending',
      category: taskCategory,
      notes: taskNotes.trim(),
    });
    setIsModalOpen(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesEvent = filterEventId === 'all' || task.eventId === filterEventId;
    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Completed' && task.status === 'Completed') ||
      (filterStatus === 'Pending' && task.status === 'Pending');
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesCategory =
      filterCategory === 'All' || task.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesEvent && matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const pendingCount = totalTasks - completedCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MushroomIcon className="w-5 h-5 text-[#777B59] dark:text-[#A6A98A]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A]">
              Forest Task Ledger
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
            Preparation Checklist
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2.5 rounded-xl border border-[#A6A98A] text-xs flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Progress Metric Banner */}
      <div className="parchment-card rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#777B59]/15 dark:bg-[#777B59]/25 flex items-center justify-center text-[#777B59] dark:text-[#A6A98A]">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] tabular-nums font-mono">
                {completedCount} of {totalTasks}
              </span>
              <span className="text-xs text-[#777B59] dark:text-[#A6A98A] font-bold">
                ({totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0}% complete)
              </span>
            </div>
            <p className="text-xs text-[#392D29]/70 dark:text-[#B7A9A6] mt-0.5">
              {pendingCount} preparations still awaiting your touch.
            </p>
          </div>
        </div>

        {/* Gathering filter dropdown */}
        {events.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] whitespace-nowrap">Filter Gathering:</span>
            <select
              value={filterEventId}
              onChange={(e) => setFilterEventId(e.target.value)}
              className="text-xs p-2 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-1 focus:ring-[#777B59]"
            >
              <option value="all">All Gatherings</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FFF8EF] dark:bg-[#393438] p-4 rounded-2xl border border-[#D6BDA5] dark:border-[#5A5055] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1">
            {['All', 'Pending', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#777B59] text-[#FFF8EF]'
                    : 'text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777B59] dark:text-[#A6A98A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#F4E8D9]/70 dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-1 focus:ring-[#777B59]"
            />
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D6BDA5]/40 dark:border-[#5A5055]/40 text-xs">
          <span className="text-[#63463C] dark:text-[#D7C5C0] font-bold">Category:</span>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-[#63463C] dark:bg-[#777B59] text-[#FFF8EF] font-bold'
                    : 'bg-[#F4E8D9] dark:bg-[#29272A] text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#D6BDA5]/60 dark:hover:bg-[#454047]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const matchedEvent = events.find((e) => e.id === task.eventId);
          const isDone = task.status === 'Completed';

          return (
            <div
              key={task.id}
              className={`parchment-card rounded-2xl p-4 sm:p-5 relative flex items-start justify-between gap-4 transition-all ${
                isDone
                  ? 'bg-[#F4E8D9]/40 dark:bg-[#29272A]/40 border-[#D6BDA5]/50 dark:border-[#5A5055]/50 opacity-80'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggleTask(task.id)}
                  className="mt-1 w-5 h-5 accent-[#777B59] rounded cursor-pointer shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        task.priority === 'High'
                          ? 'bg-[#B58D99] text-[#FFF8EF]'
                          : task.priority === 'Medium'
                          ? 'bg-[#777B59] text-[#FFF8EF]'
                          : 'bg-[#D6BDA5] dark:bg-[#454047] text-[#392D29] dark:text-[#F5EDE5]'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <span className="text-[11px] font-bold text-[#777B59] dark:text-[#A6A98A]">{task.category}</span>
                    {matchedEvent && filterEventId === 'all' && (
                      <span className="text-[10px] text-[#63463C]/80 dark:text-[#D7C5C0]/80 font-medium">
                        · {matchedEvent.name}
                      </span>
                    )}
                  </div>

                  <p
                    className={`font-serif text-base sm:text-lg font-bold text-[#63463C] dark:text-[#F5EDE5] leading-snug mb-1 break-words ${
                      isDone ? 'line-through text-[#392D29]/50 dark:text-[#B7A9A6]' : ''
                    }`}
                  >
                    {task.title}
                  </p>

                  {task.notes && (
                    <p className="text-xs text-[#392D29]/75 dark:text-[#D7C5C0]/80 mb-2 leading-relaxed font-sans">{task.notes}</p>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-[#63463C]/80 dark:text-[#D7C5C0]/80 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
                    <span>Target: {task.dueDate || 'No date set'}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0 pt-1">
                <button
                  onClick={() => openEditModal(task)}
                  className="p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors cursor-pointer"
                  title="Edit task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete task "${task.title}"?`)) {
                      onDeleteTask(task.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-[#B58D99] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="parchment-card rounded-3xl p-12 text-center border-2 border-dashed border-[#D6BDA5] dark:border-[#5A5055]">
            <CheckSquare className="w-12 h-12 text-[#777B59] dark:text-[#A6A98A] mx-auto mb-3" />
            <h3 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">
              No Tasks Found
            </h3>
            <p className="text-xs text-[#392D29]/70 dark:text-[#B7A9A6] max-w-sm mx-auto mb-4">
              {searchQuery || filterStatus !== 'All'
                ? 'No preparations match your current filter selections.'
                : 'All checklist milestones for this view are complete! Relax or add a new task.'}
            </p>
            <button
              onClick={openAddModal}
              className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
            >
              Add New Task
            </button>
          </div>
        )}
      </div>

      {/* Task Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29272A]/70 backdrop-blur-xs font-sans">
          <div className="parchment-card rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl border-2 border-[#D6BDA5] dark:border-[#5A5055]">
            <div className="absolute top-4 left-4"><ScrewRivet /></div>
            <div className="absolute top-4 right-4"><ScrewRivet /></div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-10 p-1.5 rounded-lg text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-4">
              {editingTask ? 'Edit Task' : 'Add Preparation Task'}
            </h2>

            {formError && (
              <div className="mb-4 p-2.5 rounded-xl bg-[#B58D99]/20 border border-[#B58D99] text-xs text-[#63463C] dark:text-[#F5EDE5]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">
                  Task Title <span className="text-[#B58D99]">*</span>
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Calligraphy place cards with wax seals"
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Gathering</label>
                <select
                  value={taskEventId}
                  onChange={(e) => setTaskEventId(e.target.value)}
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
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Target Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#63463C] dark:text-[#F5EDE5] mb-1">Notes & Specifications</label>
                <textarea
                  rows={2}
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  placeholder="Vendor contacts, quantities, references..."
                  className="w-full p-2.5 rounded-xl bg-[#FFF8EF] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] text-xs text-[#392D29] dark:text-[#F5EDE5] focus:outline-none focus:ring-2 focus:ring-[#777B59]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6BDA5]/60 dark:border-[#5A5055]/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#63463C] dark:text-[#D7C5C0] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                >
                  {editingTask ? 'Save Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
