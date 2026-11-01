import React from 'react';

export function MushroomIcon({ className = 'w-5 h-5 text-[#777B59]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Mushroom Cap */}
      <path
        d="M6 18C6 11.3726 10.4772 6 16 6C21.5228 6 26 11.3726 26 18C26 18.5523 25.5523 19 25 19H7C6.44772 19 6 18.5523 6 18Z"
        fill="currentColor"
      />
      {/* Mushroom Cap Spots */}
      <circle cx="12" cy="11" r="1.5" fill="#FFF8EF" opacity="0.85" />
      <circle cx="19" cy="10" r="1.2" fill="#FFF8EF" opacity="0.85" />
      <circle cx="16" cy="14" r="1.8" fill="#FFF8EF" opacity="0.85" />
      <circle cx="22" cy="14" r="1.2" fill="#FFF8EF" opacity="0.85" />
      <circle cx="9" cy="15" r="1.2" fill="#FFF8EF" opacity="0.85" />
      {/* Mushroom Stem */}
      <path
        d="M13 19H19V24C19 25.6569 17.6569 27 16 27C14.3431 27 13 25.6569 13 24V19Z"
        fill="#D6BDA5"
        stroke="#63463C"
        strokeWidth="1.2"
      />
      {/* Gills shadow */}
      <path d="M7 19C10 20.5 22 20.5 25 19" stroke="#63463C" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function AcornIcon({ className = 'w-5 h-5 text-[#63463C]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Acorn Cap */}
      <path
        d="M9 13C9 9.5 12 8 16 8C20 8 23 9.5 23 13C23 13.5523 22.5523 14 22 14H10C9.44772 14 9 13.5523 9 13Z"
        fill="#63463C"
      />
      {/* Stem */}
      <path d="M16 8C16 5.5 17 4 18.5 3.5" stroke="#63463C" strokeWidth="2" strokeLinecap="round" />
      {/* Cap Texture */}
      <circle cx="12" cy="11" r="0.8" fill="#D6BDA5" />
      <circle cx="16" cy="10.5" r="0.8" fill="#D6BDA5" />
      <circle cx="19.5" cy="11.5" r="0.8" fill="#D6BDA5" />
      {/* Nut Body */}
      <path
        d="M10 14C10 19 13 25 16 27.5C19 25 22 19 22 14H10Z"
        fill="#B58D99"
        opacity="0.85"
        stroke="#63463C"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function LeafIcon({ className = 'w-5 h-5 text-[#777B59]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M8 24C8 24 10 13 20 8C24 6 26 6 26 6C26 6 26 8 24 12C19 22 8 24 8 24Z"
        fill="currentColor"
        stroke="#392D29"
        strokeWidth="1.2"
      />
      {/* Veins */}
      <path d="M10 22C14 18 19 14 24 8" stroke="#FFF8EF" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 18L18 18" stroke="#FFF8EF" strokeWidth="1" strokeLinecap="round" />
      <path d="M17 15L20 14" stroke="#FFF8EF" strokeWidth="1" strokeLinecap="round" />
      {/* Stem */}
      <path d="M8 24C6 26 5 28 4 29" stroke="#392D29" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function FernIcon({ className = 'w-5 h-5 text-[#777B59]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 28C10 24 18 16 26 4" stroke="#777B59" strokeWidth="1.5" strokeLinecap="round" />
      {/* Fronds */}
      <path d="M12 21C16 20 19 21 21 23" stroke="#777B59" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 22C8 20 7 18 6 17" stroke="#777B59" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M15 17C19 16 22 17 24 19" stroke="#777B59" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14 18C11 16 10 14 9 13" stroke="#777B59" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M19 13C22 11 24 12 26 13" stroke="#777B59" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M18 13C16 11 15 9 14 8" stroke="#777B59" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function FlowerIcon({ className = 'w-5 h-5 text-[#B58D99]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="3.5" fill="#D6BDA5" stroke="#63463C" strokeWidth="1" />
      {/* Petals */}
      <ellipse cx="16" cy="9" rx="3" ry="4.5" fill="currentColor" opacity="0.9" />
      <ellipse cx="16" cy="23" rx="3" ry="4.5" fill="currentColor" opacity="0.9" />
      <ellipse cx="9" cy="16" rx="4.5" ry="3" fill="currentColor" opacity="0.9" />
      <ellipse cx="23" cy="16" rx="4.5" ry="3" fill="currentColor" opacity="0.9" />
      <ellipse cx="11" cy="11" rx="3" ry="4" transform="rotate(-45 11 11)" fill="currentColor" opacity="0.8" />
      <ellipse cx="21" cy="11" rx="3" ry="4" transform="rotate(45 21 11)" fill="currentColor" opacity="0.8" />
      <ellipse cx="11" cy="21" rx="3" ry="4" transform="rotate(45 11 21)" fill="currentColor" opacity="0.8" />
      <ellipse cx="21" cy="21" rx="3" ry="4" transform="rotate(-45 21 21)" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

export function ScrewRivet() {
  return (
    <div className="screw-rivet shrink-0" title="Woodland Rivet" />
  );
}

export function VintageCornerOrnaments() {
  return (
    <>
      <div className="absolute top-2 left-2 text-[#D6BDA5]/60 pointer-events-none text-xs font-serif select-none">
        ✦
      </div>
      <div className="absolute top-2 right-2 text-[#D6BDA5]/60 pointer-events-none text-xs font-serif select-none">
        ✦
      </div>
      <div className="absolute bottom-2 left-2 text-[#D6BDA5]/60 pointer-events-none text-xs font-serif select-none">
        ✦
      </div>
      <div className="absolute bottom-2 right-2 text-[#D6BDA5]/60 pointer-events-none text-xs font-serif select-none">
        ✦
      </div>
    </>
  );
}
