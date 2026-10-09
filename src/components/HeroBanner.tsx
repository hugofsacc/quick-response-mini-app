import React from 'react';
import { Shield, Sparkles, Bookmark, HeartPulse } from 'lucide-react';
import { BANNER_IMAGES } from '../data/images';

interface HeroBannerProps {
  onOpenSomaticReset: () => void;
  onOpenBuilder: () => void;
  onOpenKit: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenSomaticReset,
  onOpenBuilder,
  onOpenKit,
}) => {
  return (
    <section className="pt-6 pb-2 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Cinematic Photographic Hero Card with bright, luminous photographic background */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-300/80 min-h-[340px] sm:min-h-[390px] flex flex-col justify-between p-6 sm:p-10 text-white">
        {/* Full-bleed Photo Background - brightened and contrasted */}
        <img
          src={BANNER_IMAGES.hero}
          alt="Warm illuminated desk workspace"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-110 contrast-105 saturate-105"
        />

        {/* Lighter, subtle scrim to reveal maximum brightness while maintaining text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges & Quick Action Pills */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-white shadow-md">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Conversation Assistant</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSomaticReset}
              className="px-4 py-1.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 min-h-[36px]"
            >
              <HeartPulse className="w-3.5 h-3.5 text-slate-950" />
              <span>2-Min Reset</span>
            </button>

            <button
              onClick={onOpenBuilder}
              className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/25 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md min-h-[36px] backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Create Script</span>
            </button>

            <button
              onClick={onOpenKit}
              className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/25 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md min-h-[36px] backdrop-blur-md"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kit</span>
            </button>
          </div>
        </div>

        {/* Main Hero Typography with subtle dark text shadows for 100% legibility */}
        <div className="relative z-10 my-auto py-6 space-y-3 max-w-2xl">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
            style={{ textShadow: '0 3px 12px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.95)' }}
          >
            Quick Response
          </h1>

          <p
            className="text-xs sm:text-sm font-bold tracking-widest uppercase text-emerald-300"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95)' }}
          >
            The right words, right when you need them
          </p>

          <p
            className="text-sm sm:text-base text-white/95 leading-relaxed font-medium max-w-xl"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)' }}
          >
            Calm before speaking, clarity during the conversation, and peace of mind after. A practical assistant designed to help you communicate clearly and respectfully in tense moments.
          </p>
        </div>

        {/* Bottom subtle kicker */}
        <div
          className="relative z-10 pt-2 text-[11px] text-white/90 font-medium flex items-center gap-3"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
        >
          <span>Respectful &amp; Grounded</span>
          <span aria-hidden="true">·</span>
          <span>Zero Aggression</span>
          <span aria-hidden="true">·</span>
          <span>Practical &amp; Ready to Use</span>
        </div>
      </div>
    </section>
  );
};
