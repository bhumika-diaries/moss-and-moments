import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  DollarSign,
  Users,
  Clock,
  ArrowRight,
  Flower2,
  BookOpen,
} from 'lucide-react';
import { ScrewRivet, MushroomIcon, LeafIcon, AcornIcon, FlowerIcon } from '../common/WoodlandIcons';
import { EventItem } from '../../types';
import { useCurrency } from '../../hooks/useCurrency';

interface LandingPageProps {
  onStartPlanning: () => void;
  onExploreDashboard: () => void;
  onSelectEvent: (eventId: string) => void;
  events: EventItem[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onExploreDashboard,
  onSelectEvent,
  events,
}) => {
  const { formatMoney } = useCurrency();

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6">
          <div className="parchment-card rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden text-center shadow-xl w-full">
            {/* Screws in corners */}
            <div className="absolute top-4 left-4"><ScrewRivet /></div>
            <div className="absolute top-4 right-4"><ScrewRivet /></div>
            <div className="absolute bottom-4 left-4"><ScrewRivet /></div>
            <div className="absolute bottom-4 right-4"><ScrewRivet /></div>

            {/* Subtle welcome badge */}
            <div className="inline-flex items-center gap-2 bg-[#F4E8D9] dark:bg-[#29272A] border border-[#D6BDA5] dark:border-[#5A5055] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#63463C] dark:text-[#D7C5C0] mb-5 shadow-xs">
              <MushroomIcon className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
              <span className="font-hand text-sm font-semibold tracking-wide">Woodland Event Planning Sanctuary</span>
              <MushroomIcon className="w-3.5 h-3.5 text-[#777B59] dark:text-[#A6A98A]" />
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#63463C] dark:text-[#F5EDE5] tracking-tight mb-4 leading-tight max-w-4xl mx-auto">
              Little details.{' '}
              <span className="italic font-normal text-[#777B59] dark:text-[#A6A98A]">Beautifully</span>{' '}
              planned moments.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-[#392D29]/80 dark:text-[#D7C5C0] max-w-3xl mx-auto mb-8 font-sans leading-relaxed">
              Moss & Moments combines the warmth of a vintage storybook with modern GenAI planning. Organize guests, budgets, checklists, and run-of-show timelines for gatherings that linger softly in memory.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
              <button
                onClick={onStartPlanning}
                className="bg-[#777B59] hover:bg-[#686c4e] text-[#FFF8EF] font-bold px-6 py-3 rounded-xl border-2 border-[#A6A98A] shadow-md flex items-center gap-2 text-xs sm:text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#F4E8D9]" />
                <span>Ask AI Event Planner</span>
              </button>
              <button
                onClick={onExploreDashboard}
                className="bg-[#FFF8EF] dark:bg-[#393438] hover:bg-[#F4E8D9] dark:hover:bg-[#454047] text-[#63463C] dark:text-[#F5EDE5] font-bold px-6 py-3 rounded-xl border-2 border-[#D6BDA5] dark:border-[#5A5055] shadow-sm flex items-center gap-2 text-xs sm:text-sm transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Woodland Decorative Bar */}
            <div className="flex items-center justify-center gap-6 text-[#A6A98A] dark:text-[#5A5055] pt-4 border-t border-[#D6BDA5]/50 dark:border-[#5A5055]/50 text-xs">
              <div className="flex items-center gap-1.5 text-[#63463C] dark:text-[#D7C5C0] font-medium">
                <LeafIcon className="w-4 h-4 text-[#777B59] dark:text-[#A6A98A]" />
                <span>Organic Florals</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5 text-[#63463C] dark:text-[#D7C5C0] font-medium">
                <MushroomIcon className="w-4 h-4 text-[#B58D99]" />
                <span>Cottagecore Aesthetics</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5 text-[#63463C] dark:text-[#D7C5C0] font-medium">
                <AcornIcon className="w-4 h-4 text-[#63463C] dark:text-[#D7C5C0]" />
                <span>Gentle Precision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ready-to-Explore Events */}
      {events.length > 0 && (
        <section className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <span className="text-xs uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A] block mb-1">
              Curated Gatherings
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
              Step inside our sample celebrations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {events.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt.id)}
                className="parchment-card rounded-2xl p-5 cursor-pointer hover:border-[#777B59] dark:hover:border-[#B58D99] hover:shadow-lg transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-2 right-2"><ScrewRivet /></div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-[#777B59] dark:text-[#A6A98A]">
                    <FlowerIcon className="w-3.5 h-3.5 text-[#B58D99]" />
                    <span>{evt.eventType}</span>
                    <span>·</span>
                    <span className="font-mono">{evt.eventDate || 'Date upcoming'}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#63463C] dark:text-[#F5EDE5] group-hover:text-[#777B59] dark:group-hover:text-[#A6A98A] transition-colors mb-2 line-clamp-2">
                    {evt.name}
                  </h3>
                  <p className="text-xs text-[#392D29]/75 dark:text-[#D7C5C0]/80 line-clamp-2 mb-4 leading-relaxed font-sans">
                    {evt.notes || evt.theme}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-[#D6BDA5]/40 dark:border-[#5A5055]/40 text-[#63463C] dark:text-[#D7C5C0]">
                  <span className="font-mono font-bold">{formatMoney(evt.budget)} budget</span>
                  <span className="text-[#777B59] dark:text-[#A6A98A] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6 Core Feature Pillars */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-wider text-[#777B59] dark:text-[#A6A98A] block mb-1">
            Handcrafted Features
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#63463C] dark:text-[#F5EDE5]">
            Everything needed to plan unforgettable celebrations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="parchment-card rounded-2xl p-6 relative">
            <div className="absolute top-3 right-3"><ScrewRivet /></div>
            <div className="w-10 h-10 rounded-xl bg-[#777B59]/20 dark:bg-[#777B59]/30 flex items-center justify-center text-[#777B59] dark:text-[#A6A98A] mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">
              GenAI Event Architect
            </h3>
            <p className="text-xs sm:text-sm text-[#392D29]/80 dark:text-[#D7C5C0] leading-relaxed mb-3">
              Powered by Gemini. Describe your dream gathering, guest size, and budget to receive a tailored concept, itemized expenses, checklist, and day-of timeline.
            </p>
            <span className="text-xs font-semibold text-[#777B59] dark:text-[#A6A98A]">Editable & 1-click importable</span>
          </div>

          {/* Feature 2 */}
          <div className="parchment-card rounded-2xl p-6 relative">
            <div className="absolute top-3 right-3"><ScrewRivet /></div>
            <div className="w-10 h-10 rounded-xl bg-[#63463C]/15 dark:bg-[#F5EDE5]/10 flex items-center justify-center text-[#63463C] dark:text-[#D7C5C0] mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">
              Forest Checklist & Tasks
            </h3>
            <p className="text-xs sm:text-sm text-[#392D29]/80 dark:text-[#D7C5C0] leading-relaxed mb-3">
              Prioritize milestones by days before the event. Filter by categories like Florals, Catering, Venue, and Favors to keep preparations calm and structured.
            </p>
            <span className="text-xs font-semibold text-[#63463C] dark:text-[#D7C5C0]">High / Medium / Low urgency</span>
          </div>

          {/* Feature 3 */}
          <div className="parchment-card rounded-2xl p-6 relative">
            <div className="absolute top-3 right-3"><ScrewRivet /></div>
            <div className="w-10 h-10 rounded-xl bg-[#B58D99]/25 flex items-center justify-center text-[#B58D99] mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">
              Budget & Expense Ledger
            </h3>
            <p className="text-xs sm:text-sm text-[#392D29]/80 dark:text-[#D7C5C0] leading-relaxed mb-3">
              Track planned allocation versus actual invoices in real time. Country and currency conversion support ensures accurate figures worldwide.
            </p>
            <span className="text-xs font-semibold text-[#B58D99]">Multi-currency with live rates</span>
          </div>

          {/* Feature 4 */}
          <div className="parchment-card rounded-2xl p-6 relative">
            <div className="absolute top-3 right-3"><ScrewRivet /></div>
            <div className="w-10 h-10 rounded-xl bg-[#777B59]/20 dark:bg-[#777B59]/30 flex items-center justify-center text-[#777B59] dark:text-[#A6A98A] mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">
              Guest & RSVP Management
            </h3>
            <p className="text-xs sm:text-sm text-[#392D29]/80 dark:text-[#D7C5C0] leading-relaxed mb-3">
              Manage invitations, RSVPs, dietary needs, party groupings, plus-ones, and table assignments with peaceful clarity.
            </p>
            <span className="text-xs font-semibold text-[#777B59] dark:text-[#A6A98A]">Accepted, pending & dietary alerts</span>
          </div>

          {/* Feature 5 */}
          <div className="parchment-card rounded-2xl p-6 relative">
            <div className="absolute top-3 right-3"><ScrewRivet /></div>
            <div className="w-10 h-10 rounded-xl bg-[#A6A98A]/30 flex items-center justify-center text-[#63463C] dark:text-[#D7C5C0] mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">
              Day-of Run of Show
            </h3>
            <p className="text-xs sm:text-sm text-[#392D29]/80 dark:text-[#D7C5C0] leading-relaxed mb-3">
              Minute-by-minute timeline ensuring photographers, musicians, florists, and hosts flow seamlessly from arrival to the midnight lantern send-off.
            </p>
            <span className="text-xs font-semibold text-[#63463C] dark:text-[#D7C5C0]">Printable & coordinator-friendly</span>
          </div>

          {/* Feature 6 */}
          <div className="parchment-card rounded-2xl p-6 relative">
            <div className="absolute top-3 right-3"><ScrewRivet /></div>
            <div className="w-10 h-10 rounded-xl bg-[#D6BDA5]/40 flex items-center justify-center text-[#63463C] dark:text-[#D7C5C0] mb-4">
              <Flower2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#63463C] dark:text-[#F5EDE5] mb-2">
              Inspiration & Moodboard
            </h3>
            <p className="text-xs sm:text-sm text-[#392D29]/80 dark:text-[#D7C5C0] leading-relaxed mb-3">
              Curated cottagecore color recipes, tactile floral concepts, beeswax candle inspirations, and cozy grazing table ideas.
            </p>
            <span className="text-xs font-semibold text-[#777B59] dark:text-[#A6A98A]">Custom pins & palette swatches</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6">
        <div className="parchment-card rounded-3xl p-8 sm:p-10 text-center relative border-2 border-[#D6BDA5] dark:border-[#5A5055]">
          <div className="absolute top-3 left-3"><ScrewRivet /></div>
          <div className="absolute top-3 right-3"><ScrewRivet /></div>
          <p className="font-serif italic text-base sm:text-lg text-[#63463C] dark:text-[#F5EDE5] mb-4 leading-relaxed">
            “Moss & Moments turned our overwhelming ideas into a cohesive, enchanting glasshouse wedding. The AI suggestions for beeswax taper heights, botanical menu courses, and the timing of our folk duo were so thoughtful and spot-on.”
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-sans text-[#392D29] dark:text-[#D7C5C0]">
            <span className="font-bold">Lyra & Rowan K.</span>
            <span>·</span>
            <span className="text-[#777B59] dark:text-[#A6A98A]">Fernridge Conservatory Celebration</span>
          </div>
        </div>
      </section>
    </div>
  );
};
