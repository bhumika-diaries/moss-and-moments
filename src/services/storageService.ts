import {
  EventItem,
  TaskItem,
  ExpenseItem,
  GuestItem,
  TimelineSlot,
  UserProfile,
  MoodboardPin,
} from '../types';

const STORAGE_KEYS = {
  USER: 'moss_moments_user',
  EVENTS: 'moss_moments_events',
  TASKS: 'moss_moments_tasks',
  EXPENSES: 'moss_moments_expenses',
  GUESTS: 'moss_moments_guests',
  TIMELINE: 'moss_moments_timeline',
  MOODBOARD: 'moss_moments_moodboard',
  ACTIVE_EVENT_ID: 'moss_moments_active_event_id',
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

  // Reset to sample data
  resetAllToDefaults(): void {
    this.setItem(STORAGE_KEYS.USER, DEFAULT_USER);
    this.setItem(STORAGE_KEYS.EVENTS, SEED_EVENTS);
    this.setItem(STORAGE_KEYS.TASKS, SEED_TASKS);
    this.setItem(STORAGE_KEYS.EXPENSES, SEED_EXPENSES);
    this.setItem(STORAGE_KEYS.GUESTS, SEED_GUESTS);
    this.setItem(STORAGE_KEYS.TIMELINE, SEED_TIMELINE);
    this.setItem(STORAGE_KEYS.MOODBOARD, SEED_MOODBOARD);
    this.setItem(STORAGE_KEYS.ACTIVE_EVENT_ID, SEED_EVENTS[0].id);
  }
}

export const storageService = new StorageService();
