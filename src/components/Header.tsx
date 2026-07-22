"use client";

import React from "react";
import { Gamepad2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

/**
 * Header component for the GLIMMICK website.
 * Displays the brand name and tagline with a minimal, centered design.
 * Features a subtle entrance animation using motion/react.
 *
 * @returns {JSX.Element} The rendered header component.
 */
export function Header() {
  return (
    <motion.header
      id="site-header"
      className="bg-paper py-5 px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
        <Link href="/" className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.jpg" alt="Glimmick Logo" className="w-8 h-8 md:w-10 md:h-10 rounded shadow-sm border-2 border-ink" />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">
            GLIMMICK
          </h1>
        </Link>
        <p className="font-body text-sm text-ink-muted mt-1">
          tiny games, big fun
        </p>
      </div>
    </motion.header>
  );
}
