import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Moss & Moments',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Event Plan Generation API
const handleGenerateEventPlan = async (req: Request, res: Response) => {
  try {
    const {
      eventName,
      eventType = 'Celebration',
      eventDate = '',
      location = '',
      guestCount = 25,
      budget = 5000,
      theme = 'Woodland Cottagecore',
      preferences = '',
    } = req.body;

    const parsedGuests = Math.max(1, Number(guestCount) || 1);
    const parsedBudget = Math.max(100, Number(budget) || 100);

    // If Gemini API is available and initialized, call Gemini
    if (aiClient && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are the lead event planner and floral designer for "Moss & Moments", an enchanting event planning studio specializing in woodland, cottagecore, botanical, vintage storybook, and handcrafted celebrations.
Plan the following event:
Event Name: "${eventName || 'Woodland Gathering'}"
Event Type: "${eventType}"
Date: "${eventDate || 'Autumn Season'}"
Location: "${location || 'Botanical Garden & Glasshouse'}"
Guest Count: ${parsedGuests} guests
Total Budget: $${parsedBudget} USD
Aesthetic / Theme: "${theme}"
Special Preferences / Notes: "${preferences || 'Seasonal botanical details, cozy lighting, intimate atmosphere'}"

Provide a detailed, practical, inspiring plan in strict JSON.
The budget amounts in budgetBreakdown must add up to approximately $${parsedBudget}.
Provide realistic milestones for the preparation checklist, a realistic day-of run-of-show timeline, curated decor/thematic suggestions, and creative experiential ideas.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: 'A poetic yet practical summary of the event concept and atmosphere.',
                },
                themeVision: {
                  type: Type.STRING,
                  description: 'Description of colors, florals, textures, and sensory details.',
                },
                budgetBreakdown: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      amount: { type: Type.NUMBER },
                      reason: { type: Type.STRING },
                    },
                    required: ['category', 'amount', 'reason'],
                  },
                },
                checklist: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      category: { type: Type.STRING },
                      priority: { type: Type.STRING, description: 'High, Medium, or Low' },
                      daysBefore: { type: Type.NUMBER },
                    },
                    required: ['title', 'category', 'priority', 'daysBefore'],
                  },
                },
                timeline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      activity: { type: Type.STRING },
                      notes: { type: Type.STRING },
                    },
                    required: ['time', 'activity'],
                  },
                },
                ideas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                decorAndStyling: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      area: { type: Type.STRING },
                      idea: { type: Type.STRING },
                      woodlandDetail: { type: Type.STRING },
                    },
                    required: ['area', 'idea'],
                  },
                },
              },
              required: ['summary', 'budgetBreakdown', 'checklist', 'timeline', 'ideas'],
            },
          },
        });

        const textOutput = response.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput);
          return res.json({
            ...parsed,
            source: 'gemini-live',
            model: 'gemini-3.8-flash',
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to algorithmic plan:', geminiError?.message || geminiError);
        // We will fall through to our rich domain plan generator so the user always has a high-quality working result
      }
    }

    // High quality intelligent woodland fallback generator tailored to user's parameters
    const venueAmount = Math.round(parsedBudget * 0.35);
    const cateringAmount = Math.round(parsedBudget * 0.30);
    const decorAmount = Math.round(parsedBudget * 0.15);
    const photoAmount = Math.round(parsedBudget * 0.10);
    const miscAmount = parsedBudget - (venueAmount + cateringAmount + decorAmount + photoAmount);

    const fallbackPlan = {
      source: 'woodland-planner-template',
      summary: `An intimate, handcrafted ${eventType.toLowerCase()} curated for ${parsedGuests} cherished guests amidst the charm of "${theme}". Every detail balances rustic woodland warmth with effortless elegance.`,
      themeVision: `Warm parchment stationery, amber glass candlelight, dried moss runner accents, pressed autumn florals, and earthen ceramics with hand-tied linen napkins.`,
      budgetBreakdown: [
        {
          category: 'Venue & Glasshouse Space',
          amount: venueAmount,
          reason: `Rental for a rustic or sunlit garden pavilion accommodating ${parsedGuests} guests comfortably.`,
        },
        {
          category: 'Catering & Forest Feast',
          amount: cateringAmount,
          reason: `Artisanal seasonal fare, family-style grazing boards, signature herbal spritzers, and botanical desserts ($${Math.round(cateringAmount / parsedGuests)}/person).`,
        },
        {
          category: 'Botanical Decor & Florals',
          amount: decorAmount,
          reason: `Moss table runners, wildflower centerpieces, beeswax taper candles, and hand-lettered wooden signage.`,
        },
        {
          category: 'Photography & Memory Book',
          amount: photoAmount,
          reason: 'Documentary style photography capturing candid, unhurried woodland moments and golden-hour portraits.',
        },
        {
          category: 'Favors, Music & Contingency',
          amount: miscAmount,
          reason: 'Acoustic playlist or folk trio, botanical seed packet favors, and peace-of-mind buffer.',
        },
      ],
      checklist: [
        {
          title: 'Reserve garden / glasshouse venue and confirm weather backup',
          category: 'Venue',
          priority: 'High',
          daysBefore: 60,
        },
        {
          title: `Finalize guest list of ${parsedGuests} and send storybook parchment invitations`,
          category: 'Invitations',
          priority: 'High',
          daysBefore: 45,
        },
        {
          title: 'Curate farm-to-table seasonal menu and dessert tier',
          category: 'Catering',
          priority: 'Medium',
          daysBefore: 30,
        },
        {
          title: 'Order beeswax taper candles, dried moss, and vintage brass holders',
          category: 'Decor',
          priority: 'Medium',
          daysBefore: 21,
        },
        {
          title: 'Hand-letter wooden place cards and botanical seating chart',
          category: 'Decor',
          priority: 'Low',
          daysBefore: 10,
        },
        {
          title: 'Assemble favor pouches with wildflower seeds and custom dried herbal tea bags',
          category: 'Favors',
          priority: 'Low',
          daysBefore: 5,
        },
        {
          title: 'Day-before floral pickup and setup check at the venue',
          category: 'Logistics',
          priority: 'High',
          daysBefore: 1,
        },
      ],
      timeline: [
        { time: '13:00', activity: 'Venue arrival & botanical tablescape styling', notes: 'Light beeswax tapers & arrange moss runner' },
        { time: '14:30', activity: 'Photographer arrival & detail shots', notes: 'Capture paper goods, florals, and tablescape' },
        { time: '15:00', activity: 'Welcome & Welcome Drinks', notes: 'Elderflower-blackberry botanical spritzers served' },
        { time: '15:45', activity: 'Main celebration ceremony or toast', notes: 'Gather under floral arbor or hearth' },
        { time: '16:30', activity: 'Woodland Feast & artisanal dinner', notes: 'Family style dining with warm acoustic background music' },
        { time: '18:00', activity: 'Cake cutting & tea service', notes: 'Earl Grey lavender naked cake & herbal infusions' },
        { time: '19:30', activity: 'Fireside gathering & sparkler farewell', notes: 'Distribute hand-tied wildflower seed favor pouches' },
      ],
      ideas: [
        'A "Memory Branch" guestbook where attendees tie handwritten parchment tags with twine onto an illuminated birch branch.',
        'Vintage apothecary jars filled with dried botanicals, fairy lights, and river stones on each tabletop.',
        'Custom calligraphy menus printed on deckle-edged recycled parchment with pressed wild pansies.',
        'A warm cider or botanical elixir tasting station with cinnamon sticks and dehydrated orange slices.',
      ],
      decorAndStyling: [
        { area: 'Entryway', idea: 'A carved wooden welcome signboard with moss bedding and lantern clusters', woodlandDetail: 'Hand-scripted in deep cocoa ink' },
        { area: 'Dining Tables', idea: 'Woven linen runners layered with preserved forest moss, birch slabs, and brass candelabras', woodlandDetail: 'Unscented honey beeswax taper candles' },
        { area: 'Lounge / Photo Corner', idea: 'Velvet settee with knit throws and an archway of eucalyptus and dried fern fronds', woodlandDetail: 'Polaroid camera with wooden pegboard memory display' },
      ],
    };

    return res.json(fallbackPlan);
  } catch (err: any) {
    console.error('Plan generation endpoint error:', err);
    return res.status(500).json({
      error: {
        code: 'GENERATION_ERROR',
        message: err.message || 'Failed to generate event plan.',
      },
    });
  }
};

app.post('/api/generate-event-plan', handleGenerateEventPlan);
app.post('/functions/v1/generate-event-plan', handleGenerateEventPlan);

// Vite middleware for dev / static serving for prod
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🌿 Moss & Moments server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
