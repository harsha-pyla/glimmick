"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

export interface GameCardProps {
  /** The title of the card */
  title: string;
  /** Short subtitle or tagline */
  description?: string;
  /** Destination route link */
  href?: string;
  /** Custom background classes or gradient (Neal.fun style) */
  bgClass?: string;
  /** Custom text color */
  textColor?: string;
  /** Optional icon / graphic element */
  icon?: React.ReactNode;
  /** Optional badge tag e.g. "NEW", "HOT" */
  badge?: string;
  /** Index for stagger animation delay */
  index?: number;
}

/**
 * GameCard Component — Neal.fun Clean Banner Grid Style
 *
 * Wide rectangular layout with bold typography, distinct color themes,
 * clean rounded borders, and subtle hover animations.
 */
export function GameCard({
  title,
  description,
  href,
  bgClass = "bg-paper-dark",
  textColor = "text-ink",
  icon,
  index = 0,
}: GameCardProps) {
  const cardContent = (
    <div
      className={`relative w-full h-36 md:h-40 ${bgClass} ${textColor} border border-clay rounded-2xl shadow-sm hover:border-ink transition-colors overflow-hidden flex flex-col justify-center items-center text-center p-5 group cursor-pointer select-none`}
    >
      {/* Main Graphic / Icon */}
      {icon && <div className="mb-2">{icon}</div>}

      {/* Title */}
      <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight leading-none">
        {title}
      </h3>

      {/* Subtitle */}
      {description && (
        <p className="font-body text-xs md:text-sm font-normal text-ink-muted mt-2 max-w-[90%] truncate">
          {description}
        </p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className="w-full"
    >
      {href ? (
        <Link href={href} className="block w-full">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </motion.div>
  );
}
