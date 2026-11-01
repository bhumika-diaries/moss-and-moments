import { EventMoodboardTheme, EventMoodboardConfig, EventItem, PaletteColor } from '../types';

export const PREDEFINED_THEMES: EventMoodboardTheme[] = [
  // --- WEDDING THEMES ---
  {
    id: 'theme-wedding-elegant',
    name: 'Champagne & Ivory Elegance',
    description: 'Timeless luxury with crystal chandeliers, champagne silk, gold leaf accents, and lush white peonies.',
    eventType: 'Wedding',
    moodKeywords: ['Timeless', 'Lustrous', 'Romantic', 'Refined'],
    palette: [
      { id: 'c1', name: 'Champagne Gold', hex: '#D4AF37', note: 'Cutlery & stationery accents', textDark: false },
      { id: 'c2', name: 'Pearl Ivory', hex: '#FDFBF7', note: 'Table linens & gown tone', textDark: true },
      { id: 'c3', name: 'Dusty Rose', hex: '#D8A47F', note: 'Floral arrangements', textDark: true },
      { id: 'c4', name: 'Deep Truffle', hex: '#3E2723', note: 'Text & calligraphy', textDark: false },
      { id: 'c5', name: 'Eucalyptus Mist', hex: '#A3B19B', note: 'Foliage & greenery', textDark: true },
    ],
    categories: ['Florals & Bouquets', 'Tablescape & Linens', 'Stationery & Wax Seals', 'Attire & Jewelry', 'Lighting & Drapery', 'Catering & Cake'],
    suggestedIdeas: [
      { title: 'Cascading White Peonies & Silver Dollar Eucalyptus', category: 'Florals & Bouquets', description: 'Oversized bridal bouquet with flowing ivory silk ribbon and garden spray roses.' },
      { title: 'Gold Rimmed Charger Plates with Linen Napkins', category: 'Tablescape & Linens', description: 'Monogrammed hemstitch linen napkins with polished gold flatware.' },
      { title: 'Hand-torn Deckle-edge Menus with Gold Leaf Foil', category: 'Stationery & Wax Seals', description: 'Heavy cotton parchment menus with handwritten calligraphy.' },
    ],
  },
  {
    id: 'theme-wedding-woodland',
    name: 'Enchanted Woodland Cottagecore',
    description: 'Our signature botanical sanctuary with pillow moss runners, beeswax candlelight, and forest fern textures.',
    eventType: 'Wedding',
    moodKeywords: ['Earthy', 'Storybook', 'Botanical', 'Cozy'],
    palette: [
      { id: 'w1', name: 'Parchment Cream', hex: '#F4E8D9', note: 'Base paper & backdrops', textDark: true },
      { id: 'w2', name: 'Olive Green', hex: '#777B59', note: 'Primary foliage & ribbons', textDark: false },
      { id: 'w3', name: 'Muted Sage', hex: '#A6A98A', note: 'Pressed herbs & eucalyptus', textDark: true },
      { id: 'w4', name: 'Dusty Mauve', hex: '#B58D99', note: 'Wild berries & accents', textDark: false },
      { id: 'w5', name: 'Wood Brown', hex: '#63463C', note: 'Signage & timber tables', textDark: false },
    ],
    categories: ['Florals & Moss', 'Tablescape & Woods', 'Parchment Stationery', 'Beeswax Lighting', 'Forest Attire', 'Artisanal Grazing'],
    suggestedIdeas: [
      { title: 'Living Moss Table Runners with Dried Foraged Lichen', category: 'Tablescape & Woods', description: 'Preserved cushion moss, wild mushrooms, and brass candlesticks with amber glow.' },
      { title: 'Handmade Botanical Seed Paper Place Cards', category: 'Parchment Stationery', description: 'Wildflower seeds embedded in recycled cotton deckle paper with walnut ink.' },
      { title: 'Tiered Naked Sponge Cake with Blackberry Bramble', category: 'Artisanal Grazing', description: 'Rustic vanilla bean cake dusted with powdered sugar and wild berry coulis.' },
    ],
  },
  {
    id: 'theme-wedding-rustic',
    name: 'Rustic Vineyard & Terracotta',
    description: 'Warm earth tones, exposed oak barrels, terracotta planters, and sunset amber hues in a vineyard courtyard.',
    eventType: 'Wedding',
    moodKeywords: ['Sun-drenched', 'Earthy', 'Vineyard', 'Warm'],
    palette: [
      { id: 'r1', name: 'Tuscan Terracotta', hex: '#C86D51', note: 'Clay pots & runners', textDark: false },
      { id: 'r2', name: 'Warm Amber', hex: '#E0A96D', note: 'Sunset glass & lights', textDark: true },
      { id: 'r3', name: 'Olive Leaf', hex: '#6B705C', note: 'Olive branches & vines', textDark: false },
      { id: 'r4', name: 'Linen Oat', hex: '#F5EBE0', note: 'Table runners & fabric', textDark: true },
      { id: 'r5', name: 'Espresso Timber', hex: '#4A3B32', note: 'Wine barrels & chairs', textDark: false },
    ],
    categories: ['Vineyard Florals', 'Rustic Tablescape', 'Kraft Stationery', 'Bistro Lighting', 'Outdoor Lounge', 'Wine & Pairings'],
    suggestedIdeas: [
      { title: 'Terracotta Pots with Olive Branches & Rosemary', category: 'Vineyard Florals', description: 'Aromatic herb centerpieces that guests can take home as living favors.' },
      { title: 'Edison Bulb String Canopies over Farm Tables', category: 'Bistro Lighting', description: 'Warm zig-zag festival lighting crisscrossing the outdoor courtyard.' },
    ],
  },
  {
    id: 'theme-wedding-minimalist',
    name: 'Modern Minimalist Monochrome',
    description: 'Clean architectural lines, negative space, monochromatic tones, and sculpted calla lilies.',
    eventType: 'Wedding',
    moodKeywords: ['Sculptural', 'Contemporary', 'Sleek', 'Crisp'],
    palette: [
      { id: 'm1', name: 'Pure Alabaster', hex: '#FAFAFA', note: 'Clean backgrounds & silk', textDark: true },
      { id: 'm2', name: 'Soft Greige', hex: '#E0DCD3', note: 'Concrete & ceramic vessels', textDark: true },
      { id: 'm3', name: 'Warm Clay', hex: '#A39281', note: 'Subtle contrast accent', textDark: false },
      { id: 'm4', name: 'Matte Charcoal', hex: '#2B2B2B', note: 'Typography & architecture', textDark: false },
      { id: 'm5', name: 'Ghost Silver', hex: '#C7C8C4', note: 'Brushed metal hardware', textDark: true },
    ],
    categories: ['Sculptural Florals', 'Minimalist Tablescape', 'Typography Stationery', 'Architectural Lighting', 'Modern Attire', 'Plated Dining'],
    suggestedIdeas: [
      { title: 'Single-Stem Calla Lilies in Ceramic Bud Vases', category: 'Sculptural Florals', description: 'Spacing single long stems with deliberate breathing room for museum aesthetic.' },
      { title: 'Matte Black Geometric Menus on Light Stone Plates', category: 'Minimalist Tablescape', description: 'High-contrast typography-driven place settings without visual clutter.' },
    ],
  },

  // --- BIRTHDAY THEMES ---
  {
    id: 'theme-birthday-fun',
    name: 'Joyful Confetti & Sunshine',
    description: 'Playful vibrant colors, festive garland backdrops, whimsical cakes, and sparkling joy.',
    eventType: 'Birthday',
    moodKeywords: ['Playful', 'Vibrant', 'Cheerful', 'Celebratory'],
    palette: [
      { id: 'bf1', name: 'Sunshine Gold', hex: '#FFC837', note: 'Balloons & highlights', textDark: true },
      { id: 'bf2', name: 'Coral Pop', hex: '#FF6B6B', note: 'Banner flags & party hats', textDark: false },
      { id: 'bf3', name: 'Aqua Turquoise', hex: '#4ECDC4', note: 'Glassware & ribbons', textDark: true },
      { id: 'bf4', name: 'Berry Grape', hex: '#6C5CE7', note: 'Confetti & typography', textDark: false },
      { id: 'bf5', name: 'Vanilla Cream', hex: '#FFF8EF', note: 'Surface & backdrop', textDark: true },
    ],
    categories: ['Balloon Backdrops', 'Cake & Sweet Treats', 'Party Favors & Hats', 'Interactive Games', 'Cocktails & Punches', 'Festive Lighting'],
    suggestedIdeas: [
      { title: 'Organic Balloon Arch with Tassel Fringe Streamers', category: 'Balloon Backdrops', description: 'Color-blocked multi-sized balloons with holographic ribbon accents.' },
      { title: 'Sprinkle Birthday Cake with Neon Candle Toppers', category: 'Cake & Sweet Treats', description: 'Funfetti vanilla sponge coated with pastel buttercream and disco-ball picks.' },
    ],
  },
  {
    id: 'theme-birthday-luxury',
    name: 'Midnight Noir & Champagne Gold',
    description: 'Sophisticated adult milestone soirée with black velvet, gold mirror accents, and craft cocktail bars.',
    eventType: 'Birthday',
    moodKeywords: ['Glamorous', 'Sensual', 'Cocktail', 'High-End'],
    palette: [
      { id: 'bl1', name: 'Obsidian Velvet', hex: '#1A1A1A', note: 'Linens & moody backdrops', textDark: false },
      { id: 'bl2', name: 'Champagne Shimmer', hex: '#D4AF37', note: 'Mirror signs & bar trims', textDark: false },
      { id: 'bl3', name: 'Smoky Charcoal', hex: '#3A3A3C', note: 'Cards & cocktail lounge', textDark: false },
      { id: 'bl4', name: 'Emerald Gem', hex: '#004D40', note: 'Deep velvet cushions', textDark: false },
      { id: 'bl5', name: 'Alabaster Silk', hex: '#F8F9FA', note: 'Contrast floral accents', textDark: true },
    ],
    categories: ['Craft Cocktail Bar', 'Velvet Lounge Styling', 'Moody Lighting', 'Gourmet Canapés', 'Photo Backdrop', 'Live Jazz & DJ'],
    suggestedIdeas: [
      { title: 'Custom Acrylic Gold-Engraved Signature Bar Menu', category: 'Craft Cocktail Bar', description: 'Backlit smoked glass sign showcasing 3 curated birthday cocktails with dried orange garnishes.' },
      { title: 'Champagne Coupe Tower with Dry Ice Fog Effect', category: 'Party Favors & Hats', description: '4-tier vintage crystal coupe glasses filled for midnight toast.' },
    ],
  },
  {
    id: 'theme-birthday-retro',
    name: 'Retro 70s Disco Fever',
    description: 'Groovy typography, roller-disco vibes, mirror balls, sunset warm gradients, and vinyl records.',
    eventType: 'Birthday',
    moodKeywords: ['Groovy', 'Nostalgic', 'Disco', 'Warm'],
    palette: [
      { id: 'br1', name: 'Tangerine Dream', hex: '#E76F51', note: 'Sunset warm orange', textDark: false },
      { id: 'br2', name: 'Mustard Velvet', hex: '#E9C46A', note: '70s gold corduroy tone', textDark: true },
      { id: 'br3', name: 'Avocado Moss', hex: '#2A9D8F', note: 'Retro green contrast', textDark: false },
      { id: 'br4', name: 'Burnt Sienna', hex: '#F4A261', note: 'Warm peach-terracotta', textDark: true },
      { id: 'br5', name: 'Deep Espresso', hex: '#264653', note: 'Rich retro navy-cocoa', textDark: false },
    ],
    categories: ['Disco Mirror Decor', 'Vinyl & Music Station', 'Retro Lounge Seating', 'Groovy Cake Design', 'Roller & Photo Booth', 'Vintage Punch Bowl'],
    suggestedIdeas: [
      { title: 'Hanging Cluster of Multi-Size Mirror Disco Balls', category: 'Disco Mirror Decor', description: 'Reflects kaleidoscope light beams over dancefloor and dessert table.' },
      { title: 'Vintage Vinyl Record Sleeves as Table Numbers', category: 'Vinyl & Music Station', description: 'Framed classic 70s rock and funk records with personalized stories.' },
    ],
  },

  // --- CORPORATE THEMES ---
  {
    id: 'theme-corporate-professional',
    name: 'Executive Slate & Modern Cyan',
    description: 'Confidence-inspiring conference aesthetic with clean deep navy, brushed silver, and tech-forward teal.',
    eventType: 'Corporate',
    moodKeywords: ['Executive', 'Innovative', 'Polished', 'Structured'],
    palette: [
      { id: 'cp1', name: 'Deep Corporate Navy', hex: '#0B2545', note: 'Primary branding & banners', textDark: false },
      { id: 'cp2', name: 'Tech Cyan', hex: '#134074', note: 'Accent buttons & LED lines', textDark: false },
      { id: 'cp3', name: 'Slate Blue', hex: '#8DA9C4', note: 'Secondary cards & tags', textDark: true },
      { id: 'cp4', name: 'Arctic White', hex: '#EEF4F8', note: 'High readability background', textDark: true },
      { id: 'cp5', name: 'Graphite Black', hex: '#1B1B1E', note: 'High-contrast typography', textDark: false },
    ],
    categories: ['Stage & AV Backdrop', 'Signage & Badges', 'Networking Lounge', 'Executive Swag', 'Coffee & Catering', 'Tech Demo Pods'],
    suggestedIdeas: [
      { title: 'Matte Fabric Tension Stage Backdrop with LED Uplights', category: 'Stage & AV Backdrop', description: 'Seamless glare-free presenter stage with acoustic sound baffling.' },
      { title: 'Recycled Bamboo QR Badge Lanyards', category: 'Signage & Badges', description: 'Sustainable digital contact exchange tags with minimalist company branding.' },
    ],
  },
  {
    id: 'theme-corporate-eco',
    name: 'Eco-Innovation & Sustainable Canvas',
    description: 'Natural kraft textures, living plant dividers, recycled linen, and forest green for ESG summits.',
    eventType: 'Corporate',
    moodKeywords: ['Sustainable', 'Organic', 'Forward-thinking', 'Pure'],
    palette: [
      { id: 'ce1', name: 'Forest Spruce', hex: '#1B4332', note: 'Primary environmental tone', textDark: false },
      { id: 'ce2', name: 'Leaf Sprout', hex: '#52B788', note: 'Accent green & highlights', textDark: true },
      { id: 'ce3', name: 'Natural Kraft', hex: '#DDB892', note: 'Recycled paper & wood', textDark: true },
      { id: 'ce4', name: 'Warm Canvas', hex: '#FAF3E0', note: 'Base linen surfaces', textDark: true },
      { id: 'ce5', name: 'Rich Soil', hex: '#5E503F', note: 'Text & structural framing', textDark: false },
    ],
    categories: ['Living Green Walls', 'Recycled Kraft Signage', 'Compostable Catering', 'Zero-Waste Swag', 'Daylight Breakouts', 'Botanical Stage'],
    suggestedIdeas: [
      { title: 'Modular Living Herb & Fern Wall Room Dividers', category: 'Living Green Walls', description: 'Creates natural acoustic privacy between breakout tracks with fresh herbal scent.' },
      { title: 'Zero-Waste Farm-to-Table Bento Box Lunches', category: 'Compostable Catering', description: 'Locally grown produce in woven palm leaf containers with biodegradable cutlery.' },
    ],
  },

  // --- BABY SHOWER THEMES ---
  {
    id: 'theme-babyshower-pastel',
    name: 'Enchanted Meadow & Soft Pastels',
    description: 'Gentle dreamy pastels, delicate clouds, pressed baby’s breath, and heirloom storybook innocence.',
    eventType: 'Baby Shower',
    moodKeywords: ['Gentle', 'Dreamy', 'Tender', 'Sweet'],
    palette: [
      { id: 'bs1', name: 'Soft Buttercup', hex: '#FDE2B8', note: 'Warm golden sunlight', textDark: true },
      { id: 'bs2', name: 'Blush Peach', hex: '#FAD2E1', note: 'Rose petal sweetness', textDark: true },
      { id: 'bs3', name: 'Powder Sage', hex: '#BEE1E6', note: 'Calm eucalyptus sky', textDark: true },
      { id: 'bs4', name: 'Cloud Cream', hex: '#FFFBF5', note: 'Plush blanket surface', textDark: true },
      { id: 'bs5', name: 'Warm Taupe', hex: '#8E7D6F', note: 'Gentle storybook text', textDark: false },
    ],
    categories: ['Floral & Cloud Arches', 'Wishes & Guestbook', 'Baby Treats & Cupcakes', 'Gift Showcase Display', 'Favors & Seedlings', 'Nursery Vignettes'],
    suggestedIdeas: [
      { title: 'Tulle Cloud Canopy with Floating Dried Baby’s Breath', category: 'Floral & Cloud Arches', description: 'Ethereal floating floral clouds over the expectant mother’s seating vignette.' },
      { title: 'Wooden Baby Block Wishes Keepsake Box', category: 'Wishes & Guestbook', description: 'Guests write childhood blessings on natural beechwood building blocks.' },
    ],
  },

  // --- COLLEGE FEST THEMES ---
  {
    id: 'theme-college-neon',
    name: 'Cyberpunk Neon Beats',
    description: 'High-voltage electric cyan, hot magenta, laser grids, and pulsating festival stage production.',
    eventType: 'College Fest',
    moodKeywords: ['High-Energy', 'Electrifying', 'Futuristic', 'Edgy'],
    palette: [
      { id: 'cf1', name: 'Electric Cyan', hex: '#00F0FF', note: 'Laser glow & neon lines', textDark: true },
      { id: 'cf2', name: 'Laser Magenta', hex: '#FF007F', note: 'Stage banners & lighting', textDark: false },
      { id: 'cf3', name: 'Volt Lime', hex: '#39FF14', note: 'High-vis stickers & merch', textDark: true },
      { id: 'cf4', name: 'Deep Space', hex: '#0D0221', note: 'Night backdrop & darkness', textDark: false },
      { id: 'cf5', name: 'Pure White Light', hex: '#FFFFFF', note: 'Strobe contrast & flares', textDark: true },
    ],
    categories: ['Main Stage Visuals', 'Glow & Neon Signage', 'Interactive Gaming Booths', 'Street Food Stalls', 'Festival Merch & Swag', 'Night Lighting & Lasers'],
    suggestedIdeas: [
      { title: 'Double-Layered Fluorescent LED Tube Tunnel Entrance', category: 'Glow & Neon Signage', description: 'Walk-through vortex corridor with synchronized audio cues and UV body paint station.' },
      { title: 'Oversized Graffiti Murals on Industrial Containers', category: 'Main Stage Visuals', description: 'Student street artists live-painting dynamic murals during festival hours.' },
    ],
  },
  {
    id: 'theme-college-retro',
    name: 'Y2K Retro Street Carnival',
    description: 'Nostalgic 2000s iridescent foils, chrome bubble lettering, skater park culture, and street music.',
    eventType: 'College Fest',
    moodKeywords: ['Nostalgic', 'Playful', 'Streetwear', 'Raw'],
    palette: [
      { id: 'yr1', name: 'Cyber Purple', hex: '#7952DE', note: 'Bubble logo fills', textDark: false },
      { id: 'yr2', name: 'Bubblegum Pink', hex: '#FF6EA7', note: 'Cotton candy flags', textDark: true },
      { id: 'yr3', name: 'Electric Sky', hex: '#38D9A9', note: 'Skater ramp trims', textDark: true },
      { id: 'yr4', name: 'Solar Orange', hex: '#FFA94D', note: 'Food truck accents', textDark: true },
      { id: 'yr5', name: 'Chrome Silver', hex: '#E9ECEF', note: 'Metallic foil banners', textDark: true },
    ],
    categories: ['Skate & Stage Zone', 'Merch Printing Bar', 'Photo Arcade Booth', 'Food Truck Lane', 'Graffiti Canvas', 'Wristbands & Badges'],
    suggestedIdeas: [
      { title: 'Live Screen-Printing Station for Fest T-Shirts', category: 'Merch Printing Bar', description: 'Attendees customize blank organic cotton tees with commemorative festival stamps.' },
    ],
  },

  // --- FESTIVAL & CULTURAL THEMES ---
  {
    id: 'theme-festival-bohemian',
    name: 'Bohemian Sunset Bazaar',
    description: 'Moroccan woven rugs, macrame hangings, brass lanterns, pampas grass, and warm spices.',
    eventType: 'Festival',
    moodKeywords: ['Soulful', 'Eclectic', 'Artisanal', 'Sun-Kissed'],
    palette: [
      { id: 'fb1', name: 'Saffron Spice', hex: '#E76F51', note: 'Cushions & textiles', textDark: false },
      { id: 'fb2', name: 'Marigold Yellow', hex: '#F4A261', note: 'Draped cotton runners', textDark: true },
      { id: 'fb3', name: 'Desert Sand', hex: '#E9C46A', note: 'Pampas plumes & canvas', textDark: true },
      { id: 'fb4', name: 'Oasis Teal', hex: '#2A9D8F', note: 'Ceramic tiles & jewelry', textDark: false },
      { id: 'fb5', name: 'Earthen Clay', hex: '#264653', note: 'Terracotta & woodwork', textDark: false },
    ],
    categories: ['Carpet & Cushion Lounges', 'Macrame & Feathers', 'Acoustic Sound Circle', 'Artisanal Bazaar Stalls', 'Spiced Teas & Bites', 'Lantern Path Lighting'],
    suggestedIdeas: [
      { title: 'Low-Seating Floor Lounge with Layered Kilim Rugs', category: 'Carpet & Cushion Lounges', description: 'Embroidered velvet poufs, low carved tea tables, and brass incense censers.' },
      { title: 'Archway with Pampas Grass and Dried Palms', category: 'Macrame & Feathers', description: 'Natural textural entrance arch inviting guests into the celebration ground.' },
    ],
  },
  {
    id: 'theme-festival-royal',
    name: 'Royal Heritage & Crimson Marigold',
    description: 'Opulent traditional splendor with marigold garlands, brass urns, raw crimson silks, and sandalwood incense.',
    eventType: 'Festival',
    moodKeywords: ['Majestic', 'Heritage', 'Celebratory', 'Vibrant'],
    palette: [
      { id: 'fr1', name: 'Royal Crimson', hex: '#9B111E', note: 'Silken drapes & flowers', textDark: false },
      { id: 'fr2', name: 'Fresh Marigold', hex: '#F77F00', note: 'Floral ropes & torans', textDark: false },
      { id: 'fr3', name: 'Antique Brass', hex: '#D4AF37', note: 'Urns, bells & lamps', textDark: false },
      { id: 'fr4', name: 'Peacock Emerald', hex: '#006D77', note: 'Contrast silk border', textDark: false },
      { id: 'fr5', name: 'Raw Ivory Silk', hex: '#FFF8EF', note: 'Canopy fabric backdrop', textDark: true },
    ],
    categories: ['Floral Torans & Urns', 'Canopy & Silk Drapes', 'Brass Diya Lighting', 'Traditional Feast Table', 'Cultural Performances', 'Aromatic Welcome Bar'],
    suggestedIdeas: [
      { title: 'Floating Brass Urli with Marigold Petals & Floating Tea Lights', category: 'Floral Torans & Urns', description: 'Grand heritage welcome centerpiece emitting fragrant jasmine and rose essence.' },
      { title: 'Suspended Ceiling of Thousand Marigold Strings', category: 'Canopy & Silk Drapes', description: 'Golden floral canopy that transforms the event pavilion into an amber sunset.' },
    ],
  },
];

export function getThemesForEventType(eventType?: string): EventMoodboardTheme[] {
  if (!eventType) return PREDEFINED_THEMES;
  const normalized = eventType.toLowerCase();

  // Match event type
  if (normalized.includes('wedding')) {
    return PREDEFINED_THEMES.filter((t) => t.eventType === 'Wedding' || t.id === 'theme-wedding-woodland');
  }
  if (normalized.includes('birthday')) {
    return PREDEFINED_THEMES.filter((t) => t.eventType === 'Birthday');
  }
  if (normalized.includes('corporate') || normalized.includes('conference') || normalized.includes('summit')) {
    return PREDEFINED_THEMES.filter((t) => t.eventType === 'Corporate');
  }
  if (normalized.includes('baby') || normalized.includes('shower')) {
    return PREDEFINED_THEMES.filter((t) => t.eventType === 'Baby Shower');
  }
  if (normalized.includes('college') || normalized.includes('fest') || normalized.includes('campus')) {
    return PREDEFINED_THEMES.filter((t) => t.eventType === 'College Fest');
  }
  if (normalized.includes('festival') || normalized.includes('community') || normalized.includes('soiree') || normalized.includes('soirée')) {
    return PREDEFINED_THEMES.filter((t) => t.eventType === 'Festival' || t.eventType === 'Wedding');
  }

  // Return all if no specific match
  return PREDEFINED_THEMES;
}

export function getDefaultThemeForEvent(event?: EventItem): EventMoodboardTheme {
  if (!event) return PREDEFINED_THEMES[1]; // Woodland Cottagecore default

  const type = event.eventType.toLowerCase();
  if (type.includes('wedding')) return PREDEFINED_THEMES[0]; // Champagne & Ivory
  if (type.includes('tea')) return PREDEFINED_THEMES[1]; // Woodland Cottagecore
  if (type.includes('birthday')) return PREDEFINED_THEMES[4]; // Joyful Confetti
  if (type.includes('dinner')) return PREDEFINED_THEMES[2]; // Rustic Vineyard
  if (type.includes('baby')) return PREDEFINED_THEMES[9]; // Baby Shower
  if (type.includes('festival') || type.includes('community')) return PREDEFINED_THEMES[12]; // Bohemian Sunset
  if (type.includes('woodland')) return PREDEFINED_THEMES[1];

  return PREDEFINED_THEMES[1];
}

export function createDefaultConfig(event: EventItem): EventMoodboardConfig {
  const matchedTheme = getDefaultThemeForEvent(event);
  return {
    eventId: event.id,
    themeId: matchedTheme.id,
    themeName: matchedTheme.name,
    themeDescription: matchedTheme.description,
    palette: [...matchedTheme.palette],
    categories: [...matchedTheme.categories],
    isCustomTheme: false,
    updatedAt: new Date().toISOString(),
  };
}
