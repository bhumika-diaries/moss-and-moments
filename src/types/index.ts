export type EventType =
  | 'Wedding'
  | 'Birthday'
  | 'Anniversary'
  | 'Garden Tea Party'
  | 'Baby Shower'
  | 'Dinner Soirée'
  | 'Community Festival'
  | 'Woodland Workshop'
  | 'Other';

export type EventStatus = 'Planning' | 'Confirmed' | 'Completed' | 'Archived';

export interface EventItem {
  id: string;
  ownerId: string;
  name: string;
  eventType: EventType;
  eventDate: string;
  location: string;
  guestCount: number;
  budget: number;
  theme: string;
  notes: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'Completed';

export interface TaskItem {
  id: string;
  eventId: string;
  title: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'Venue'
  | 'Catering'
  | 'Floral & Decor'
  | 'Photography'
  | 'Music & Sound'
  | 'Stationery & Favors'
  | 'Attire & Beauty'
  | 'Logistics & Other';

export interface ExpenseItem {
  id: string;
  eventId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  expenseDate: string;
  paidBy?: string;
  createdAt: string;
}

export type RSVPStatus = 'Accepted' | 'Pending' | 'Declined';

export interface GuestItem {
  id: string;
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus: RSVPStatus;
  groupType: 'Family' | 'Friends' | 'VIP' | 'Colleagues' | 'Other';
  plusOnes: number;
  dietaryRestrictions?: string;
  tableNumber?: string;
  createdAt: string;
}

export interface TimelineSlot {
  id: string;
  eventId: string;
  time: string;
  activity: string;
  location?: string;
  responsiblePerson?: string;
  notes?: string;
  completed?: boolean;
}

export interface BudgetBreakdownItem {
  category: string;
  amount: number;
  reason: string;
}

export interface ChecklistItemGen {
  title: string;
  category: string;
  priority: TaskPriority;
  daysBefore: number;
}

export interface TimelineItemGen {
  time: string;
  activity: string;
  notes?: string;
}

export interface DecorIdeaItem {
  area: string;
  idea: string;
  woodlandDetail?: string;
}

export interface AIPlanOutput {
  summary: string;
  themeVision: string;
  budgetBreakdown: BudgetBreakdownItem[];
  checklist: ChecklistItemGen[];
  timeline: TimelineItemGen[];
  ideas: string[];
  decorAndStyling?: DecorIdeaItem[];
  source?: string;
  model?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
  avatarSeed: string;
}

export interface MoodboardPin {
  id: string;
  eventId: string;
  title: string;
  category: 'Florals' | 'Tablescape' | 'Stationery' | 'Lighting' | 'Attire' | 'Catering';
  notes: string;
  palette: string[];
  iconType: 'mushroom' | 'leaf' | 'flower' | 'sparkle' | 'lantern';
}
