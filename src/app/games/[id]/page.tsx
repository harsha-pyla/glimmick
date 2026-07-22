"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const gameId = resolvedParams.id;

  return (
    <div className="w-full min-h-screen bg-paper text-ink flex flex-col items-center justify-between p-4 sm:p-6">
      {/* Minimal Top Bar with single back arrow to return to Home */}
      <div className="w-full max-w-4xl flex items-center justify-start py-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors px-3 py-1.5 rounded-lg border border-clay hover:border-ink"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Game</span>
        </Link>
      </div>

      {/* Pure Distraction-Free Game Area */}
      <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center my-4">
        <div className="w-full aspect-video max-h-[70vh] bg-paper-dark border border-clay rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-sm">
          <p className="font-display text-xl sm:text-2xl font-bold text-ink mb-2">
            Game Canvas: {gameId}
          </p>
          <p className="font-body text-xs sm:text-sm text-ink-muted">
            Distraction-free playing experience. No ads, headers, footers, or sidebars.
          </p>
        </div>
      </div>

      {/* Empty bottom space to maintain layout cleanliness without footer */}
      <div className="py-1" />
    </div>
  );
}
