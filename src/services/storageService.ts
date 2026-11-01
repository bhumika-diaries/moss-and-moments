import {
  EventItem,
  TaskItem,
  ExpenseItem,
  GuestItem,
  TimelineSlot,
  UserProfile,
  MoodboardPin,
  EventMoodboardConfig,
  Collaborator,
  EventInvitation,
  EventRole,
  EventSection,
} from '../types';
import { createDefaultConfig } from './eventThemes';

export const ALL_EVENT_SECTIONS: { id: EventSection; label: string; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard & Overview', description: 'Metrics, quick stats & recent logs' },
  { id: 'events', label: 'Events & Calendar', description: 'Schedule dates, list & event switching' },
  { id: 'planner', label: 'AI Planner', description: 'GenAI plans, themes & concept suggestions' },
  { id: 'tasks', label: 'Checklist', description: 'Task items, assignments & deadlines' },
  { id: 'budget', label: 'Budget Tracker', description: 'Expenses, allocations & cost totals' },
  { id: 'guests', label: 'Guests & RSVPs', description: 'Attendee registry, seating & meal notes' },
  { id: 'timeline', label: 'Timeline & Schedule', description: 'Day-of hour-by-hour itinerary' },
  { id: 'moodboard', label: 'Inspo Sanctuary', description: 'Visual pins, swatches & color palettes' },
];

const STORAGE_KEYS = {
  USER: 'moss_moments_user',
  EVENTS: 'moss_moments_events',
  TASKS: 'moss_moments_tasks',
  EXPENSES: 'moss_moments_expenses',
  GUESTS: 'moss_moments_guests',
  TIMELINE: 'moss_moments_timeline',
  MOODBOARD: 'moss_moments_moodboard',
  MOODBOARD_CONFIGS: 'moss_moments_moodboard_configs',
  ACTIVE_EVENT_ID: 'moss_moments_active_event_id',
  COLLABORATORS: 'moss_moments_collaborators',
  INVITATIONS: 'moss_moments_invitations',
};

// Default seed user
export const DEFAULT_USER: UserProfile = {
  id: 'usr-forest-lead-1',
  email: 'bhumikadevnath@gmail.com',
  displayName: 'Bhumika Devnath',
  role: 'Lead Floral & Event Stylist',
  avatarSeed: 'woodland-owl',
};

// Initial Seed Events
const SEED_EVENTS: EventItem[] = [
  {
    id: 'evt-woodland-wedding',
    ownerId: DEFAULT_USER.id,
    name: 'Rowan & Lyra’s Botanical Glasshouse Wedding',
    eventType: 'Wedding',
    eventDate: '2026-11-28',
    location: 'Fernridge Conservatory & Herbarium',
    guestCount: 65,
    budget: 18500,
    theme: 'Misty Ferns, Beeswax Candlelight & Wild Berries',
    notes: 'An enchanted evening celebration under vintage glass arches, featuring forest moss runners and acoustic folk strings.',
    status: 'Planning',
    createdAt: '2026-10-15T10:00:00Z',
    updatedAt: '2026-10-28T14:30:00Z',
  },
  {
    id: 'evt-tea-party',
    ownerId: DEFAULT_USER.id,
    name: 'Midsummer Woodland Garden Tea Party',
    eventType: 'Garden Tea Party',
    eventDate: '2026-12-14',
    location: 'Willowbark Cottage Orchard',
    guestCount: 30,
    budget: 4200,
    theme: 'Vintage Bone China, Chamomile & Honeycomb',
    notes: 'Afternoon high tea with artisanal lavender scones, elderflower cordial, and hand-embroidered linen napkins.',
    status: 'Confirmed',
    createdAt: '2026-10-20T08:15:00Z',
    updatedAt: '2026-10-29T11:00:00Z',
  },
  {
    id: 'evt-autumn-dinner',
    ownerId: DEFAULT_USER.id,
    name: 'Harvest Moon Porcini & Cider Soirée',
    eventType: 'Dinner Soirée',
    eventDate: '2027-01-08',
    location: 'Oakwood Barn Estate',
    guestCount: 24,
    budget: 3600,
    theme: 'Foraged Truffles, Amber Glass & Wool Blankets',
    notes: 'Long-table candlelit communal feast with seasonal orchard ciders and fireside storytelling.',
    status: 'Planning',
    createdAt: '2026-10-25T16:45:00Z',
    updatedAt: '2026-10-30T09:20:00Z',
  },
];

// Initial Seed Collaborators
const SEED_COLLABORATORS: Collaborator[] = [
  // Rowan & Lyra's botanical wedding
  {
    id: 'collab-owner-wedding',
    eventId: 'evt-woodland-wedding',
    userId: DEFAULT_USER.id,
    email: DEFAULT_USER.email,
    name: DEFAULT_USER.displayName,
    role: 'owner',
    permissions: ['dashboard', 'events', 'planner', 'tasks', 'budget', 'guests', 'timeline', 'moodboard'],
    status: 'accepted',
    invitedAt: '2026-10-15T10:00:00Z',
    acceptedAt: '2026-10-15T10:00:00Z',
    lastActive: 'Just now',
    avatarSeed: 'woodland-owl',
  },
  {
    id: 'collab-1',
    eventId: 'evt-woodland-wedding',
    userId: 'usr-rowan-vance',
    email: 'rowan.vance@fernridge.org',
    name: 'Rowan Vance',
    role: 'co_organizer',
    permissions: ['dashboard', 'events', 'planner', 'tasks', 'budget', 'guests', 'timeline', 'moodboard'],
    status: 'accepted',
    invitedAt: '2026-10-16T11:00:00Z',
    acceptedAt: '2026-10-16T14:30:00Z',
    lastActive: '2 hours ago',
    avatarSeed: 'rowan-v',
  },
  {
    id: 'collab-2',
    eventId: 'evt-woodland-wedding',
    userId: 'usr-lyra-sterling',
    email: 'lyra.sterling@botanical.me',
    name: 'Lyra Sterling',
    role: 'co_organizer',
    permissions: ['dashboard', 'events', 'planner', 'tasks', 'budget', 'guests', 'timeline', 'moodboard'],
    status: 'accepted',
    invitedAt: '2026-10-16T11:00:00Z',
    acceptedAt: '2026-10-17T09:15:00Z',
    lastActive: 'Yesterday',
    avatarSeed: 'lyra-s',
  },
  {
    id: 'collab-3',
    eventId: 'evt-woodland-wedding',
    userId: 'usr-oliver-bramble',
    email: 'oliver.bramble@florist.com',
    name: 'Oliver Bramble',
    role: 'editor',
    permissions: ['dashboard', 'tasks', 'budget', 'moodboard'],
    status: 'accepted',
    invitedAt: '2026-10-18T15:00:00Z',
    acceptedAt: '2026-10-19T10:00:00Z',
    lastActive: '3 days ago',
    avatarSeed: 'oliver-b',
  },
  {
    id: 'collab-4',
    eventId: 'evt-woodland-wedding',
    email: 'clara.finch@guestlist.io',
    name: 'Clara Finch',
    role: 'viewer',
    permissions: ['dashboard', 'guests', 'timeline'],
    status: 'pending',
    invitedAt: '2026-10-24T10:00:00Z',
    inviteToken: 'mm-inv-clara-finch-782',
    avatarSeed: 'clara-f',
  },
  // Garden Tea Party
  {
    id: 'collab-tp-owner',
    eventId: 'evt-tea-party',
    userId: DEFAULT_USER.id,
    email: DEFAULT_USER.email,
    name: DEFAULT_USER.displayName,
    role: 'owner',
    permissions: ['dashboard', 'events', 'planner', 'tasks', 'budget', 'guests', 'timeline', 'moodboard'],
    status: 'accepted',
    invitedAt: '2026-10-20T08:15:00Z',
    acceptedAt: '2026-10-20T08:15:00Z',
    lastActive: 'Just now',
    avatarSeed: 'woodland-owl',
  },
  {
    id: 'collab-tp-1',
    eventId: 'evt-tea-party',
    userId: 'usr-eleanor-h',
    email: 'eleanor@willowbark.com',
    name: 'Eleanor Honeywood',
    role: 'co_organizer',
    permissions: ['dashboard', 'events', 'planner', 'tasks', 'budget', 'guests', 'timeline', 'moodboard'],
    status: 'accepted',
    invitedAt: '2026-10-21T09:00:00Z',
    acceptedAt: '2026-10-21T11:20:00Z',
    lastActive: '4 hours ago',
    avatarSeed: 'eleanor-h',
  },
  {
    id: 'collab-tp-2',
    eventId: 'evt-tea-party',
    userId: 'usr-liam-m',
    email: 'liam.moss@teacraft.org',
    name: 'Liam Moss',
    role: 'editor',
    permissions: ['dashboard', 'tasks', 'guests', 'timeline'],
    status: 'accepted',
    invitedAt: '2026-10-22T14:00:00Z',
    acceptedAt: '2026-10-23T08:45:00Z',
    lastActive: 'Yesterday',
    avatarSeed: 'liam-m',
  },
  // Dinner Soirée
  {
    id: 'collab-ds-owner',
    eventId: 'evt-autumn-dinner',
    userId: DEFAULT_USER.id,
    email: DEFAULT_USER.email,
    name: DEFAULT_USER.displayName,
    role: 'owner',
    permissions: ['dashboard', 'events', 'planner', 'tasks', 'budget', 'guests', 'timeline', 'moodboard'],
    status: 'accepted',
    invitedAt: '2026-10-25T16:45:00Z',
    acceptedAt: '2026-10-25T16:45:00Z',
    lastActive: 'Just now',
    avatarSeed: 'woodland-owl',
  },
  {
    id: 'collab-ds-1',
    eventId: 'evt-autumn-dinner',
    userId: 'usr-cedric-f',
    email: 'cedric@oakwoodcider.com',
    name: 'Cedric Forest',
    role: 'editor',
    permissions: ['dashboard', 'budget', 'timeline', 'moodboard'],
    status: 'accepted',
    invitedAt: '2026-10-26T12:00:00Z',
    acceptedAt: '2026-10-26T15:30:00Z',
    lastActive: '2 days ago',
    avatarSeed: 'cedric-f',
  },
];

// Initial Seed Invitations
const SEED_INVITATIONS: EventInvitation[] = [
  {
    id: 'inv-1',
    eventId: 'evt-woodland-wedding',
    eventName: 'Rowan & Lyra’s Botanical Glasshouse Wedding',
    invitedEmail: 'clara.finch@guestlist.io',
    invitedName: 'Clara Finch',
    role: 'viewer',
    permissions: ['dashboard', 'guests', 'timeline'],
    token: 'mm-inv-clara-finch-782',
    status: 'pending',
    invitedByUserId: DEFAULT_USER.id,
    invitedByName: DEFAULT_USER.displayName,
    createdAt: '2026-10-24T10:00:00Z',
    expiresAt: '2026-11-24T10:00:00Z',
  },
  {
    id: 'inv-2',
    eventId: 'evt-woodland-wedding',
    eventName: 'Rowan & Lyra’s Botanical Glasshouse Wedding',
    invitedEmail: 'marigold.vale@acousticfolk.com',
    invitedName: 'Marigold Vale',
    role: 'editor',
    permissions: ['dashboard', 'tasks', 'timeline'],
    token: 'mm-inv-marigold-music-991',
    status: 'pending',
    invitedByUserId: DEFAULT_USER.id,
    invitedByName: DEFAULT_USER.displayName,
    createdAt: '2026-10-28T16:00:00Z',
    expiresAt: '2026-11-28T16:00:00Z',
  },
];

// Initial Seed Tasks
const SEED_TASKS: TaskItem[] = [
  {
    id: 'tsk-1',
    eventId: 'evt-woodland-wedding',
    title: 'Confirm delivery of dried moss and wild fern runners',
    dueDate: '2026-11-12',
    priority: 'High',
    status: 'Completed',
    category: 'Floral & Decor',
    notes: 'Sourced sustainably from local nursery',
    createdAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'tsk-2',
    eventId: 'evt-woodland-wedding',
    title: 'Finalize botanical menu tasting with farm-to-table caterer',
    dueDate: '2026-11-15',
    priority: 'High',
    status: 'Pending',
    category: 'Catering',
    notes: 'Include vegan mushroom risotto option',
    createdAt: '2026-10-18T10:05:00Z',
  },
  {
    id: 'tsk-3',
    eventId: 'evt-woodland-wedding',
    title: 'Hand-script calligraphed parchment place cards with wax seals',
    dueDate: '2026-11-20',
    priority: 'Medium',
    status: 'Pending',
    category: 'Stationery',
    notes: 'Using walnut ink on handmade cotton rag paper',
    createdAt: '2026-10-19T11:20:00Z',
  },
  {
    id: 'tsk-4',
    eventId: 'evt-woodland-wedding',
    title: 'Book acoustic cello & guitar duo for ceremony processional',
    dueDate: '2026-11-05',
    priority: 'High',
    status: 'Completed',
    category: 'Music & Sound',
    notes: 'Song requests: Scarborough Fair & gentle waltzes',
    createdAt: '2026-10-16T14:00:00Z',
  },
  {
    id: 'tsk-5',
    eventId: 'evt-woodland-wedding',
    title: 'Order hand-poured beeswax taper candles & brass holders',
    dueDate: '2026-11-10',
    priority: 'Medium',
    status: 'Completed',
    category: 'Floral & Decor',
    notes: '40 tapers in warm honey amber color',
    createdAt: '2026-10-17T09:30:00Z',
  },
  {
    id: 'tsk-6',
    eventId: 'evt-woodland-wedding',
    title: 'Assemble wildflower seed favor packets in mini burlap pouches',
    dueDate: '2026-11-24',
    priority: 'Low',
    status: 'Pending',
    category: 'Favors',
    notes: 'Pollinator mix with poppies, lavender, and forget-me-nots',
    createdAt: '2026-10-22T13:00:00Z',
  },
  {
    id: 'tsk-7',
    eventId: 'evt-tea-party',
    title: 'Curate vintage mismatched teacup sets and tiered stands',
    dueDate: '2026-12-01',
    priority: 'High',
    status: 'Completed',
    category: 'Floral & Decor',
    notes: 'Found 35 vintage floral porcelain cups',
    createdAt: '2026-10-21T10:00:00Z',
  },
  {
    id: 'tsk-8',
    eventId: 'evt-tea-party',
    title: 'Order loose-leaf botanical teas from local apothecary',
    dueDate: '2026-12-05',
    priority: 'Medium',
    status: 'Pending',
    category: 'Catering',
    notes: 'Earl Grey Lavender, Chamomile Blossom, and Spiced Apple',
    createdAt: '2026-10-22T15:00:00Z',
  },
];

// Initial Seed Expenses
const SEED_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    eventId: 'evt-woodland-wedding',
    category: 'Venue',
    description: 'Fernridge Conservatory Glasshouse rental deposit',
    amount: 5500,
    expenseDate: '2026-10-15',
    paidBy: 'Bhumika Devnath',
    createdAt: '2026-10-15T12:00:00Z',
  },
  {
    id: 'exp-2',
    eventId: 'evt-woodland-wedding',
    category: 'Catering',
    description: 'Farm-to-Table catering deposit (65 guests)',
    amount: 4800,
    expenseDate: '2026-10-20',
    paidBy: 'Bhumika Devnath',
    createdAt: '2026-10-20T14:30:00Z',
  },
  {
    id: 'exp-3',
    eventId: 'evt-woodland-wedding',
    category: 'Floral & Decor',
    description: 'Moss table runners, ferns, and hanging greenery installation',
    amount: 1850,
    expenseDate: '2026-10-22',
    paidBy: 'Client',
    createdAt: '2026-10-22T16:00:00Z',
  },
  {
    id: 'exp-4',
    eventId: 'evt-woodland-wedding',
    category: 'Photography',
    description: 'Woodland documentary photographer retainer',
    amount: 1900,
    expenseDate: '2026-10-24',
    paidBy: 'Client',
    createdAt: '2026-10-24T11:00:00Z',
  },
  {
    id: 'exp-5',
    eventId: 'evt-woodland-wedding',
    category: 'Music & Sound',
    description: 'Acoustic folk acoustic duo fee',
    amount: 850,
    expenseDate: '2026-10-25',
    paidBy: 'Bhumika Devnath',
    createdAt: '2026-10-25T15:15:00Z',
  },
  {
    id: 'exp-6',
    eventId: 'evt-tea-party',
    category: 'Catering',
    description: 'Artisanal scones, honey pastries & clotted cream',
    amount: 620,
    expenseDate: '2026-10-26',
    paidBy: 'Bhumika Devnath',
    createdAt: '2026-10-26T10:00:00Z',
  },
  {
    id: 'exp-7',
    eventId: 'evt-tea-party',
    category: 'Floral & Decor',
    description: 'Vintage teacups rental & garden wildflower bundles',
    amount: 450,
    expenseDate: '2026-10-28',
    paidBy: 'Bhumika Devnath',
    createdAt: '2026-10-28T13:40:00Z',
  },
];

// Initial Seed Guests
const SEED_GUESTS: GuestItem[] = [
  {
    id: 'gst-1',
    eventId: 'evt-woodland-wedding',
    name: 'Clara & Julian Thorne',
    email: 'clara.thorne@foresthaven.org',
    phone: '+1 (555) 234-8901',
    rsvpStatus: 'Accepted',
    groupType: 'Family',
    plusOnes: 1,
    dietaryRestrictions: 'Vegetarian',
    tableNumber: 'Table 1 — The Oak Canopy',
    createdAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'gst-2',
    eventId: 'evt-woodland-wedding',
    name: 'Oliver Greenwood',
    email: 'oliver.g@botanicalpress.co',
    phone: '+1 (555) 456-7890',
    rsvpStatus: 'Accepted',
    groupType: 'VIP',
    plusOnes: 0,
    dietaryRestrictions: 'Gluten-free',
    tableNumber: 'Table 2 — Fern Glen',
    createdAt: '2026-10-18T10:05:00Z',
  },
  {
    id: 'gst-3',
    eventId: 'evt-woodland-wedding',
    name: 'Maeve Hazelwood',
    email: 'maeve@willowcraft.com',
    phone: '+1 (555) 678-1234',
    rsvpStatus: 'Pending',
    groupType: 'Friends',
    plusOnes: 1,
    dietaryRestrictions: 'No dairy',
    tableNumber: 'Table 2 — Fern Glen',
    createdAt: '2026-10-18T10:10:00Z',
  },
  {
    id: 'gst-4',
    eventId: 'evt-woodland-wedding',
    name: 'Dr. Arthur Pendelton',
    email: 'a.pendelton@oxfordherbs.ac.uk',
    phone: '+1 (555) 890-5678',
    rsvpStatus: 'Accepted',
    groupType: 'Colleagues',
    plusOnes: 0,
    dietaryRestrictions: 'None',
    tableNumber: 'Table 3 — Moss Arbor',
    createdAt: '2026-10-18T10:15:00Z',
  },
  {
    id: 'gst-5',
    eventId: 'evt-woodland-wedding',
    name: 'Sylvia & August Vance',
    email: 'sylvia.vance@studiobloom.com',
    rsvpStatus: 'Declined',
    groupType: 'Friends',
    plusOnes: 1,
    dietaryRestrictions: 'Nut allergy',
    createdAt: '2026-10-18T10:20:00Z',
  },
  {
    id: 'gst-6',
    eventId: 'evt-tea-party',
    name: 'Beatrice Meadowsweet',
    email: 'beatrice@teacottage.net',
    rsvpStatus: 'Accepted',
    groupType: 'Friends',
    plusOnes: 1,
    dietaryRestrictions: 'Vegan scones requested',
    tableNumber: 'Porch Table A',
    createdAt: '2026-10-21T09:00:00Z',
  },
];

// Initial Seed Timeline Slots
const SEED_TIMELINE: TimelineSlot[] = [
  {
    id: 'tml-1',
    eventId: 'evt-woodland-wedding',
    time: '12:00 PM',
    activity: 'Stylist & Floral Team Access to Glasshouse',
    location: 'Fernridge Conservatory',
    responsiblePerson: 'Bhumika (Lead Stylist)',
    notes: 'Unpack preserved moss runners, brass candlesticks, and deckle-edged menus.',
    completed: true,
  },
  {
    id: 'tml-2',
    eventId: 'evt-woodland-wedding',
    time: '02:00 PM',
    activity: 'Catering & Artisanal Bakery Setup',
    location: 'Conservatory Pantry',
    responsiblePerson: 'Chef Marcus',
    notes: 'Chilled berry spritzers and lavender honey cake staging.',
    completed: true,
  },
  {
    id: 'tml-3',
    eventId: 'evt-woodland-wedding',
    time: '03:30 PM',
    activity: 'Guest Arrival & Welcome Herb Cordials',
    location: 'Orchard Arbor Path',
    responsiblePerson: 'Hostess Elspeth',
    notes: 'Live acoustic cello plays quiet forest melodies as guests find seats.',
    completed: false,
  },
  {
    id: 'tml-4',
    eventId: 'evt-woodland-wedding',
    time: '04:15 PM',
    activity: 'Ceremony of Vows under Fern Chandelier',
    location: 'Center Glass Rotunda',
    responsiblePerson: 'Officiant & Couple',
    notes: 'Ring exchange in hand-carved walnut nest.',
    completed: false,
  },
  {
    id: 'tml-5',
    eventId: 'evt-woodland-wedding',
    time: '05:30 PM',
    activity: 'Candlelit Forest Feast & Toasts',
    location: 'Great Oak Dining Hall',
    responsiblePerson: 'Bhumika & Catering',
    notes: 'Family-style serving of mushroom tartlets, roasted heritage carrots, and blackberry tart.',
    completed: false,
  },
  {
    id: 'tml-6',
    eventId: 'evt-woodland-wedding',
    time: '08:30 PM',
    activity: 'Sparklers & Wildflower Seed Farewell',
    location: 'Conservatory Lantern Path',
    responsiblePerson: 'Lead Coordinator',
    notes: 'Hand guests favor bags with stamped botanical tags.',
    completed: false,
  },
];

// Initial Seed Moodboard Pins
const SEED_MOODBOARD: MoodboardPin[] = [
  {
    id: 'mb-1',
    eventId: 'evt-woodland-wedding',
    title: 'Lichen & Preserved Moss Table Runners',
    category: 'Tablescape',
    notes: 'Layer real pillow moss, dried mushrooms, lichen bark, and brass bud vases holding Queen Anne’s Lace.',
    palette: ['#777B59', '#A6A98A', '#F4E8D9', '#63463C'],
    iconType: 'mushroom',
  },
  {
    id: 'mb-2',
    eventId: 'evt-woodland-wedding',
    title: 'Deckle-Edged Cotton Paper Stationery',
    category: 'Stationery',
    notes: 'Torn edge handmade parchment paper, walnut ink script, pressed ferns, sealed with dusty mauve wax.',
    palette: ['#F4E8D9', '#392D29', '#B58D99', '#D6BDA5'],
    iconType: 'leaf',
  },
  {
    id: 'mb-3',
    eventId: 'evt-woodland-wedding',
    title: 'Raw Honeycomb & Blackberry Grazing Board',
    category: 'Catering',
    notes: 'Rustic olive-wood boards with artisanal goat cheeses, thyme honeycombs, sourdough crumpets, and dark forest berries.',
    palette: ['#63463C', '#FFF8EF', '#B58D99', '#777B59'],
    iconType: 'flower',
  },
  {
    id: 'mb-4',
    eventId: 'evt-woodland-wedding',
    title: 'Beeswax Tapers in Antique Brass Candlesticks',
    category: 'Lighting',
    notes: 'Unscented warm honey-hued taper candles of varying heights creating amber woodland glow as dusk falls.',
    palette: ['#D6BDA5', '#63463C', '#FFF8EF', '#A6A98A'],
    iconType: 'lantern',
  },
];

class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn(`Error reading from localStorage key "${key}":`, e);
    }
    return defaultValue;
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving to localStorage key "${key}":`, e);
    }
  }

  // User session
  getUser(): UserProfile {
    const user = this.getItem<UserProfile>(STORAGE_KEYS.USER, DEFAULT_USER);
    return user;
  }

  setUser(user: UserProfile): void {
    this.setItem(STORAGE_KEYS.USER, user);
  }

  // Active Event Context
  getActiveEventId(): string {
    const active = this.getItem<string>(STORAGE_KEYS.ACTIVE_EVENT_ID, '');
    const events = this.getEvents();
    if (active && events.some((e) => e.id === active)) {
      return active;
    }
    return events[0]?.id || '';
  }

  setActiveEventId(id: string): void {
    this.setItem(STORAGE_KEYS.ACTIVE_EVENT_ID, id);
  }

  // Events CRUD
  getEvents(): EventItem[] {
    const events = this.getItem<EventItem[]>(STORAGE_KEYS.EVENTS, SEED_EVENTS);
    if (!events || events.length === 0) {
      this.setItem(STORAGE_KEYS.EVENTS, SEED_EVENTS);
      return SEED_EVENTS;
    }
    return events;
  }

  getEventById(id: string): EventItem | undefined {
    return this.getEvents().find((e) => e.id === id);
  }

  saveEvent(eventData: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'> & { id?: string }): EventItem {
    const events = this.getEvents();
    const user = this.getUser();
    const now = new Date().toISOString();

    if (eventData.id) {
      const index = events.findIndex((e) => e.id === eventData.id);
      if (index !== -1) {
        const updated: EventItem = {
          ...events[index],
          ...eventData,
          id: eventData.id,
          updatedAt: now,
        };
        events[index] = updated;
        this.setItem(STORAGE_KEYS.EVENTS, events);
        return updated;
      }
    }

    const newEvent: EventItem = {
      ...eventData,
      id: `evt-${Date.now()}`,
      ownerId: user.id,
      createdAt: now,
      updatedAt: now,
    };
    events.unshift(newEvent);
    this.setItem(STORAGE_KEYS.EVENTS, events);
    this.setActiveEventId(newEvent.id);
    return newEvent;
  }

  deleteEvent(id: string): boolean {
    const events = this.getEvents().filter((e) => e.id !== id);
    this.setItem(STORAGE_KEYS.EVENTS, events);

    // Clean up related items
    this.setItem(STORAGE_KEYS.TASKS, this.getTasks().filter((t) => t.eventId !== id));
    this.setItem(STORAGE_KEYS.EXPENSES, this.getExpenses().filter((ex) => ex.eventId !== id));
    this.setItem(STORAGE_KEYS.GUESTS, this.getGuests().filter((g) => g.eventId !== id));
    this.setItem(STORAGE_KEYS.TIMELINE, this.getTimeline().filter((tm) => tm.eventId !== id));
    this.setItem(STORAGE_KEYS.MOODBOARD, this.getMoodboard().filter((mb) => mb.eventId !== id));

    if (this.getActiveEventId() === id) {
      this.setActiveEventId(events[0]?.id || '');
    }
    return true;
  }

  // Tasks CRUD
  getTasks(eventId?: string): TaskItem[] {
    const tasks = this.getItem<TaskItem[]>(STORAGE_KEYS.TASKS, SEED_TASKS);
    if (!tasks || tasks.length === 0) {
      this.setItem(STORAGE_KEYS.TASKS, SEED_TASKS);
      return eventId ? SEED_TASKS.filter((t) => t.eventId === eventId) : SEED_TASKS;
    }
    return eventId ? tasks.filter((t) => t.eventId === eventId) : tasks;
  }

  saveTask(taskData: Omit<TaskItem, 'id' | 'createdAt'> & { id?: string }): TaskItem {
    const tasks = this.getTasks();
    const now = new Date().toISOString();

    if (taskData.id) {
      const idx = tasks.findIndex((t) => t.id === taskData.id);
      if (idx !== -1) {
        const updated: TaskItem = {
          ...tasks[idx],
          ...taskData,
          id: taskData.id,
        };
        tasks[idx] = updated;
        this.setItem(STORAGE_KEYS.TASKS, tasks);
        return updated;
      }
    }

    const newTask: TaskItem = {
      ...taskData,
      id: `tsk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
    };
    tasks.unshift(newTask);
    this.setItem(STORAGE_KEYS.TASKS, tasks);
    return newTask;
  }

  toggleTaskStatus(id: string): TaskItem | null {
    const tasks = this.getTasks();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      tasks[idx].status = tasks[idx].status === 'Completed' ? 'Pending' : 'Completed';
      this.setItem(STORAGE_KEYS.TASKS, tasks);
      return tasks[idx];
    }
    return null;
  }

  deleteTask(id: string): boolean {
    const tasks = this.getTasks().filter((t) => t.id !== id);
    this.setItem(STORAGE_KEYS.TASKS, tasks);
    return true;
  }

  // Expenses CRUD
  getExpenses(eventId?: string): ExpenseItem[] {
    const expenses = this.getItem<ExpenseItem[]>(STORAGE_KEYS.EXPENSES, SEED_EXPENSES);
    if (!expenses || expenses.length === 0) {
      this.setItem(STORAGE_KEYS.EXPENSES, SEED_EXPENSES);
      return eventId ? SEED_EXPENSES.filter((e) => e.eventId === eventId) : SEED_EXPENSES;
    }
    return eventId ? expenses.filter((e) => e.eventId === eventId) : expenses;
  }

  saveExpense(expenseData: Omit<ExpenseItem, 'id' | 'createdAt'> & { id?: string }): ExpenseItem {
    const expenses = this.getExpenses();
    const now = new Date().toISOString();

    if (expenseData.id) {
      const idx = expenses.findIndex((e) => e.id === expenseData.id);
      if (idx !== -1) {
        const updated: ExpenseItem = {
          ...expenses[idx],
          ...expenseData,
          id: expenseData.id,
        };
        expenses[idx] = updated;
        this.setItem(STORAGE_KEYS.EXPENSES, expenses);
        return updated;
      }
    }

    const newExpense: ExpenseItem = {
      ...expenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
    };
    expenses.unshift(newExpense);
    this.setItem(STORAGE_KEYS.EXPENSES, expenses);
    return newExpense;
  }

  deleteExpense(id: string): boolean {
    const expenses = this.getExpenses().filter((e) => e.id !== id);
    this.setItem(STORAGE_KEYS.EXPENSES, expenses);
    return true;
  }

  // Guests CRUD
  getGuests(eventId?: string): GuestItem[] {
    const guests = this.getItem<GuestItem[]>(STORAGE_KEYS.GUESTS, SEED_GUESTS);
    if (!guests || guests.length === 0) {
      this.setItem(STORAGE_KEYS.GUESTS, SEED_GUESTS);
      return eventId ? SEED_GUESTS.filter((g) => g.eventId === eventId) : SEED_GUESTS;
    }
    return eventId ? guests.filter((g) => g.eventId === eventId) : guests;
  }

  saveGuest(guestData: Omit<GuestItem, 'id' | 'createdAt'> & { id?: string }): GuestItem {
    const guests = this.getGuests();
    const now = new Date().toISOString();

    if (guestData.id) {
      const idx = guests.findIndex((g) => g.id === guestData.id);
      if (idx !== -1) {
        const updated: GuestItem = {
          ...guests[idx],
          ...guestData,
          id: guestData.id,
        };
        guests[idx] = updated;
        this.setItem(STORAGE_KEYS.GUESTS, guests);
        return updated;
      }
    }

    const newGuest: GuestItem = {
      ...guestData,
      id: `gst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
    };
    guests.unshift(newGuest);
    this.setItem(STORAGE_KEYS.GUESTS, guests);
    return newGuest;
  }

  updateGuestRSVP(id: string, rsvpStatus: 'Accepted' | 'Pending' | 'Declined'): GuestItem | null {
    const guests = this.getGuests();
    const idx = guests.findIndex((g) => g.id === id);
    if (idx !== -1) {
      guests[idx].rsvpStatus = rsvpStatus;
      this.setItem(STORAGE_KEYS.GUESTS, guests);
      return guests[idx];
    }
    return null;
  }

  deleteGuest(id: string): boolean {
    const guests = this.getGuests().filter((g) => g.id !== id);
    this.setItem(STORAGE_KEYS.GUESTS, guests);
    return true;
  }

  // Timeline CRUD
  getTimeline(eventId?: string): TimelineSlot[] {
    const timeline = this.getItem<TimelineSlot[]>(STORAGE_KEYS.TIMELINE, SEED_TIMELINE);
    if (!timeline || timeline.length === 0) {
      this.setItem(STORAGE_KEYS.TIMELINE, SEED_TIMELINE);
      return eventId ? SEED_TIMELINE.filter((t) => t.eventId === eventId) : SEED_TIMELINE;
    }
    return eventId ? timeline.filter((t) => t.eventId === eventId) : timeline;
  }

  saveTimelineSlot(slotData: Omit<TimelineSlot, 'id'> & { id?: string }): TimelineSlot {
    const timeline = this.getTimeline();

    if (slotData.id) {
      const idx = timeline.findIndex((t) => t.id === slotData.id);
      if (idx !== -1) {
        const updated: TimelineSlot = {
          ...timeline[idx],
          ...slotData,
          id: slotData.id,
        };
        timeline[idx] = updated;
        this.setItem(STORAGE_KEYS.TIMELINE, timeline);
        return updated;
      }
    }

    const newSlot: TimelineSlot = {
      ...slotData,
      id: `tml-${Date.now()}`,
    };
    timeline.push(newSlot);
    timeline.sort((a, b) => a.time.localeCompare(b.time));
    this.setItem(STORAGE_KEYS.TIMELINE, timeline);
    return newSlot;
  }

  deleteTimelineSlot(id: string): boolean {
    const timeline = this.getTimeline().filter((t) => t.id !== id);
    this.setItem(STORAGE_KEYS.TIMELINE, timeline);
    return true;
  }

  // Moodboard Pins CRUD
  getMoodboard(eventId?: string): MoodboardPin[] {
    const mb = this.getItem<MoodboardPin[]>(STORAGE_KEYS.MOODBOARD, SEED_MOODBOARD);
    if (!mb || mb.length === 0) {
      this.setItem(STORAGE_KEYS.MOODBOARD, SEED_MOODBOARD);
      return eventId ? SEED_MOODBOARD.filter((m) => m.eventId === eventId) : SEED_MOODBOARD;
    }
    return eventId ? mb.filter((m) => m.eventId === eventId) : mb;
  }

  saveMoodboardPin(pinData: Omit<MoodboardPin, 'id'> & { id?: string }): MoodboardPin {
    const pins = this.getMoodboard();
    if (pinData.id) {
      const idx = pins.findIndex((p) => p.id === pinData.id);
      if (idx !== -1) {
        const updated: MoodboardPin = {
          ...pins[idx],
          ...pinData,
          id: pinData.id,
        };
        pins[idx] = updated;
        this.setItem(STORAGE_KEYS.MOODBOARD, pins);
        return updated;
      }
    }

    const newPin: MoodboardPin = {
      ...pinData,
      id: `mb-${Date.now()}`,
    };
    pins.unshift(newPin);
    this.setItem(STORAGE_KEYS.MOODBOARD, pins);
    return newPin;
  }

  deleteMoodboardPin(id: string): boolean {
    const pins = this.getMoodboard().filter((p) => p.id !== id);
    this.setItem(STORAGE_KEYS.MOODBOARD, pins);
    return true;
  }

  // Event-specific Moodboard Config & Theme CRUD
  getEventMoodboardConfig(event?: EventItem): EventMoodboardConfig | null {
    if (!event) return null;
    const configs = this.getItem<Record<string, EventMoodboardConfig>>(STORAGE_KEYS.MOODBOARD_CONFIGS, {});
    if (configs[event.id]) {
      return configs[event.id];
    }

    // Generate initial event-specific theme config based on event type
    const initialConfig = createDefaultConfig(event);
    configs[event.id] = initialConfig;
    this.setItem(STORAGE_KEYS.MOODBOARD_CONFIGS, configs);
    return initialConfig;
  }

  saveEventMoodboardConfig(config: EventMoodboardConfig): EventMoodboardConfig {
    const configs = this.getItem<Record<string, EventMoodboardConfig>>(STORAGE_KEYS.MOODBOARD_CONFIGS, {});
    const updated: EventMoodboardConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
    };
    configs[config.eventId] = updated;
    this.setItem(STORAGE_KEYS.MOODBOARD_CONFIGS, configs);

    // Also sync the event's theme name in event record if present
    const events = this.getEvents();
    const eventIdx = events.findIndex((e) => e.id === config.eventId);
    if (eventIdx !== -1) {
      events[eventIdx].theme = config.themeName;
      this.setItem(STORAGE_KEYS.EVENTS, events);
    }

    return updated;
  }

  // ==========================================
  // MULTI-USER COLLABORATION & INVITATIONS
  // ==========================================

  getCollaborators(eventId?: string): Collaborator[] {
    const list = this.getItem<Collaborator[]>(STORAGE_KEYS.COLLABORATORS, SEED_COLLABORATORS);
    if (!list || list.length === 0) {
      this.setItem(STORAGE_KEYS.COLLABORATORS, SEED_COLLABORATORS);
      return eventId ? SEED_COLLABORATORS.filter((c) => c.eventId === eventId) : SEED_COLLABORATORS;
    }
    return eventId ? list.filter((c) => c.eventId === eventId) : list;
  }

  getCollaborator(id: string): Collaborator | undefined {
    return this.getCollaborators().find((c) => c.id === id);
  }

  saveCollaborator(collabData: Omit<Collaborator, 'id'> & { id?: string }): Collaborator {
    const collabs = this.getCollaborators();
    if (collabData.id) {
      const idx = collabs.findIndex((c) => c.id === collabData.id);
      if (idx !== -1) {
        const updated: Collaborator = {
          ...collabs[idx],
          ...collabData,
          id: collabData.id,
        };
        collabs[idx] = updated;
        this.setItem(STORAGE_KEYS.COLLABORATORS, collabs);
        return updated;
      }
    }

    const newCollab: Collaborator = {
      ...collabData,
      id: `collab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    collabs.push(newCollab);
    this.setItem(STORAGE_KEYS.COLLABORATORS, collabs);
    return newCollab;
  }

  removeCollaborator(id: string): boolean {
    const collabs = this.getCollaborators().filter((c) => c.id !== id);
    this.setItem(STORAGE_KEYS.COLLABORATORS, collabs);
    return true;
  }

  updateCollaboratorRole(id: string, role: EventRole, permissions: EventSection[]): Collaborator | null {
    const collabs = this.getCollaborators();
    const idx = collabs.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    collabs[idx] = {
      ...collabs[idx],
      role,
      permissions,
    };
    this.setItem(STORAGE_KEYS.COLLABORATORS, collabs);
    return collabs[idx];
  }

  getInvitations(eventId?: string): EventInvitation[] {
    const list = this.getItem<EventInvitation[]>(STORAGE_KEYS.INVITATIONS, SEED_INVITATIONS);
    if (!list || list.length === 0) {
      this.setItem(STORAGE_KEYS.INVITATIONS, SEED_INVITATIONS);
      return eventId ? SEED_INVITATIONS.filter((i) => i.eventId === eventId) : SEED_INVITATIONS;
    }
    return eventId ? list.filter((i) => i.eventId === eventId) : list;
  }

  createInvitation(data: {
    eventId: string;
    email: string;
    name?: string;
    role: EventRole;
    permissions: EventSection[];
    invitedBy: UserProfile;
  }): { invitation: EventInvitation; collaborator: Collaborator } {
    const events = this.getEvents();
    const event = events.find((e) => e.id === data.eventId);
    const eventName = event ? event.name : 'Woodland Gathering';

    const token = `mm-inv-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
    const nowIso = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const invitation: EventInvitation = {
      id: `inv-${Date.now()}`,
      eventId: data.eventId,
      eventName,
      invitedEmail: data.email.trim().toLowerCase(),
      invitedName: data.name?.trim() || data.email.split('@')[0],
      role: data.role,
      permissions: data.permissions,
      token,
      status: 'pending',
      invitedByUserId: data.invitedBy.id,
      invitedByName: data.invitedBy.displayName,
      createdAt: nowIso,
      expiresAt,
    };

    const invitations = this.getInvitations();
    invitations.unshift(invitation);
    this.setItem(STORAGE_KEYS.INVITATIONS, invitations);

    // Also add to event collaborators in pending state
    const collaborator: Collaborator = {
      id: `collab-${Date.now()}`,
      eventId: data.eventId,
      email: data.email.trim().toLowerCase(),
      name: data.name?.trim() || data.email.split('@')[0],
      role: data.role,
      permissions: data.permissions,
      status: 'pending',
      invitedAt: nowIso,
      inviteToken: token,
      avatarSeed: data.email.split('@')[0],
    };

    const collabs = this.getCollaborators();
    // If collaborator already exists for this email and event, update it
    const existingIdx = collabs.findIndex(
      (c) => c.eventId === data.eventId && c.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (existingIdx !== -1) {
      collabs[existingIdx] = {
        ...collabs[existingIdx],
        role: data.role,
        permissions: data.permissions,
        status: 'pending',
        inviteToken: token,
      };
      this.setItem(STORAGE_KEYS.COLLABORATORS, collabs);
    } else {
      collabs.push(collaborator);
      this.setItem(STORAGE_KEYS.COLLABORATORS, collabs);
    }

    return { invitation, collaborator };
  }

  resendInvitation(invitationId: string): EventInvitation | null {
    const list = this.getInvitations();
    const idx = list.findIndex((i) => i.id === invitationId);
    if (idx === -1) return null;

    const refreshedToken = `mm-inv-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
    const updated: EventInvitation = {
      ...list[idx],
      token: refreshedToken,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    list[idx] = updated;
    this.setItem(STORAGE_KEYS.INVITATIONS, list);

    // Also sync the collaborator's inviteToken
    const collabs = this.getCollaborators();
    const cIdx = collabs.findIndex(
      (c) => c.eventId === updated.eventId && c.email.toLowerCase() === updated.invitedEmail.toLowerCase()
    );
    if (cIdx !== -1) {
      collabs[cIdx].inviteToken = refreshedToken;
      collabs[cIdx].status = 'pending';
      this.setItem(STORAGE_KEYS.COLLABORATORS, collabs);
    }

    return updated;
  }

  cancelInvitation(invitationId: string): boolean {
    const list = this.getInvitations();
    const inv = list.find((i) => i.id === invitationId);
    if (!inv) return false;

    // Remove or revoke from invitations
    const updatedList = list.filter((i) => i.id !== invitationId);
    this.setItem(STORAGE_KEYS.INVITATIONS, updatedList);

    // Remove pending collaborator if not yet accepted
    const collabs = this.getCollaborators();
    const updatedCollabs = collabs.filter(
      (c) => !(c.eventId === inv.eventId && c.email.toLowerCase() === inv.invitedEmail.toLowerCase() && c.status === 'pending')
    );
    this.setItem(STORAGE_KEYS.COLLABORATORS, updatedCollabs);
    return true;
  }

  acceptInvitation(token: string, user: UserProfile): { success: boolean; message: string; eventId?: string } {
    const list = this.getInvitations();
    const invIdx = list.findIndex((i) => i.token.trim() === token.trim());
    if (invIdx === -1) {
      return { success: false, message: 'Invalid or expired invitation token.' };
    }

    const invitation = list[invIdx];
    if (invitation.status === 'accepted') {
      return { success: true, message: `You are already a collaborator on "${invitation.eventName}".`, eventId: invitation.eventId };
    }

    // Mark invitation accepted
    list[invIdx].status = 'accepted';
    this.setItem(STORAGE_KEYS.INVITATIONS, list);

    // Update or add collaborator
    const collabs = this.getCollaborators();
    const cIdx = collabs.findIndex(
      (c) => c.eventId === invitation.eventId && (c.email.toLowerCase() === invitation.invitedEmail.toLowerCase() || c.inviteToken === token)
    );

    const nowIso = new Date().toISOString();
    if (cIdx !== -1) {
      collabs[cIdx] = {
        ...collabs[cIdx],
        userId: user.id,
        name: user.displayName || collabs[cIdx].name,
        email: user.email || collabs[cIdx].email,
        status: 'accepted',
        acceptedAt: nowIso,
        lastActive: 'Just now',
      };
    } else {
      collabs.push({
        id: `collab-${Date.now()}`,
        eventId: invitation.eventId,
        userId: user.id,
        email: user.email || invitation.invitedEmail,
        name: user.displayName || invitation.invitedName || user.email.split('@')[0],
        role: invitation.role,
        permissions: invitation.permissions,
        status: 'accepted',
        invitedAt: invitation.createdAt,
        acceptedAt: nowIso,
        lastActive: 'Just now',
        avatarSeed: user.avatarSeed || user.email.split('@')[0],
      });
    }
    this.setItem(STORAGE_KEYS.COLLABORATORS, collabs);

    return {
      success: true,
      message: `Welcome aboard! You have joined "${invitation.eventName}" as ${invitation.role.replace('_', ' ').toUpperCase()}.`,
      eventId: invitation.eventId,
    };
  }

  transferEventOwnership(eventId: string, newOwnerEmail: string, currentOwner: UserProfile): { success: boolean; message: string } {
    const events = this.getEvents();
    const evtIdx = events.findIndex((e) => e.id === eventId);
    if (evtIdx === -1) return { success: false, message: 'Event not found.' };

    const collabs = this.getCollaborators(eventId);
    const targetCollabIdx = collabs.findIndex(
      (c) => c.email.toLowerCase() === newOwnerEmail.trim().toLowerCase()
    );

    if (targetCollabIdx === -1) {
      return { success: false, message: 'Target user must already be an accepted collaborator to receive ownership.' };
    }

    const allCollabs = this.getCollaborators();
    const allSections: EventSection[] = ['dashboard', 'events', 'planner', 'tasks', 'budget', 'guests', 'timeline', 'moodboard'];

    // Update target collaborator to owner
    const targetIdx = allCollabs.findIndex(
      (c) => c.eventId === eventId && c.email.toLowerCase() === newOwnerEmail.trim().toLowerCase()
    );
    if (targetIdx !== -1) {
      allCollabs[targetIdx].role = 'owner';
      allCollabs[targetIdx].permissions = allSections;
    }

    // Demote current owner to co_organizer
    const prevOwnerIdx = allCollabs.findIndex(
      (c) => c.eventId === eventId && (c.userId === currentOwner.id || c.email.toLowerCase() === currentOwner.email.toLowerCase())
    );
    if (prevOwnerIdx !== -1) {
      allCollabs[prevOwnerIdx].role = 'co_organizer';
    }

    // Update event ownerId
    events[evtIdx].ownerId = allCollabs[targetIdx].userId || allCollabs[targetIdx].id;
    this.setItem(STORAGE_KEYS.EVENTS, events);
    this.setItem(STORAGE_KEYS.COLLABORATORS, allCollabs);

    return { success: true, message: `Ownership of "${events[evtIdx].name}" successfully transferred to ${newOwnerEmail}.` };
  }

  getUserEventRole(userId: string, userEmail: string, event?: EventItem): EventRole {
    if (!event) return 'viewer';
    if (event.ownerId === userId) return 'owner';
    if (userEmail && event.ownerId === 'usr-forest-lead-1' && userEmail.toLowerCase() === DEFAULT_USER.email.toLowerCase()) {
      return 'owner';
    }

    const collabs = this.getCollaborators(event.id);
    const member = collabs.find(
      (c) =>
        (c.userId && c.userId === userId) ||
        (userEmail && c.email.toLowerCase() === userEmail.toLowerCase())
    );

    if (member && member.status === 'accepted') {
      return member.role;
    }

    // Fallback if not accepted or not a member: viewer
    return 'viewer';
  }

  getUserEventPermissions(userId: string, userEmail: string, event?: EventItem): EventSection[] {
    const allSections: EventSection[] = [
      'dashboard',
      'events',
      'planner',
      'tasks',
      'budget',
      'guests',
      'timeline',
      'moodboard',
    ];

    if (!event) return allSections;
    const role = this.getUserEventRole(userId, userEmail, event);
    if (role === 'owner') return allSections;

    const collabs = this.getCollaborators(event.id);
    const member = collabs.find(
      (c) =>
        (c.userId && c.userId === userId) ||
        (userEmail && c.email.toLowerCase() === userEmail.toLowerCase())
    );

    if (member && member.permissions && member.permissions.length > 0) {
      return member.permissions;
    }

    // Default permissions by role
    if (role === 'co_organizer') return allSections;
    return ['dashboard', 'events', 'tasks', 'budget', 'guests', 'timeline', 'moodboard'];
  }

  canUserAccessSection(userId: string, userEmail: string, event?: EventItem, section?: EventSection): boolean {
    if (!section || !event) return true;
    const role = this.getUserEventRole(userId, userEmail, event);
    if (role === 'owner') return true;

    const permissions = this.getUserEventPermissions(userId, userEmail, event);
    return permissions.includes(section);
  }

  canUserEditSection(userId: string, userEmail: string, event?: EventItem, section?: EventSection): boolean {
    if (!section || !event) return true;
    const role = this.getUserEventRole(userId, userEmail, event);
    if (role === 'owner') return true;
    if (role === 'viewer') return false; // Viewer has read-only access to permitted sections

    // Co-organizer or Editor: must have permission for this section
    const permissions = this.getUserEventPermissions(userId, userEmail, event);
    return permissions.includes(section);
  }

  canUserManageCollaborators(userId: string, userEmail: string, event?: EventItem): boolean {
    if (!event) return false;
    const role = this.getUserEventRole(userId, userEmail, event);
    return role === 'owner' || role === 'co_organizer';
  }

  // Reset to sample data
  resetAllToDefaults(): void {
    this.setItem(STORAGE_KEYS.USER, DEFAULT_USER);
    this.setItem(STORAGE_KEYS.EVENTS, SEED_EVENTS);
    this.setItem(STORAGE_KEYS.TASKS, SEED_TASKS);
    this.setItem(STORAGE_KEYS.EXPENSES, SEED_EXPENSES);
    this.setItem(STORAGE_KEYS.GUESTS, SEED_GUESTS);
    this.setItem(STORAGE_KEYS.TIMELINE, SEED_TIMELINE);
    this.setItem(STORAGE_KEYS.MOODBOARD, SEED_MOODBOARD);
    this.setItem(STORAGE_KEYS.MOODBOARD_CONFIGS, {});
    this.setItem(STORAGE_KEYS.ACTIVE_EVENT_ID, SEED_EVENTS[0].id);
    this.setItem(STORAGE_KEYS.COLLABORATORS, SEED_COLLABORATORS);
    this.setItem(STORAGE_KEYS.INVITATIONS, SEED_INVITATIONS);
  }
}

export const storageService = new StorageService();

