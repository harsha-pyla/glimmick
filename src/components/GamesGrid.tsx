"use client";

import React from "react";
import { GameCard } from "./GameCard";

/**
 * Game slots data — empty array until you build your next new game idea!
 */
const GAME_SLOTS: {
  title: string;
  description?: string;
  href?: string;
  bgClass?: string;
  textColor?: string;
  badge?: string;
  icon?: React.ReactNode;
}[] = [
  {
    title: "Open The Box",
    href: "/games/open-the-box",
    bgClass: "bg-[#d4a373] !border-4 !border-[#5c4033] !shadow-[6px_6px_0_0_#5c4033] font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]",
    textColor: "text-[#3e2723]",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
        <path d="M21 7.5L12 2.5L3 7.5V16.5L12 21.5L21 16.5V7.5Z" fill="#c18a59" stroke="#5c4033" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M12 21.5V12" stroke="#5c4033" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M3 7.5L12 12L21 7.5" stroke="#5c4033" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M7.5 5L16.5 10" stroke="#5c4033" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Perfect Straight Line",
    href: "/games/perfect-line",
    bgClass: "bg-[#e5e7eb] !border-4 !border-ink !shadow-[6px_6px_0_0_#1f2937] font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]",
    textColor: "text-ink",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
        <path d="M4 12L20 12" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="4" cy="12" r="2" fill="#1f2937"/>
        <circle cx="20" cy="12" r="2" fill="#1f2937"/>
        <path d="M8 8L16 16" stroke="#1f2937" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2" opacity="0.5"/>
      </svg>
    ),
  },
  {
    title: "DELETE ME",
    href: "/games/delete-me",
    bgClass: "bg-white !border-4 !border-slate-900 !shadow-[6px_6px_0_0_#0f172a] font-mono",
    textColor: "text-slate-900",
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
        <path d="M3 6H21" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 11V16" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 11V16" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  }
];

export function GamesGrid() {
  if (GAME_SLOTS.length === 0) {
    return null;
  }

  return (
    <section id="games-grid" className="py-8 md:py-14 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {GAME_SLOTS.map((game, index) => (
          <GameCard
            key={game.title}
            title={game.title}
            description={game.description}
            href={game.href}
            bgClass={game.bgClass}
            textColor={game.textColor}
            badge={game.badge}
            icon={game.icon}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
