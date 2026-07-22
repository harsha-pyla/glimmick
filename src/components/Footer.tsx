"use client";

import React from "react";
import Link from "next/link";

/**
 * Footer component for the GLIMMICK website.
 * Contains brand information, social links, and legal/navigation links.
 * Features a responsive grid layout.
 *
 * Social icons are custom SVGs since lucide-react no longer includes brand icons.
 */

/* ── Custom Social Icon SVGs ────────────────────────────────── */

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  );
}



/* ── Social links data ──────────────────────────────────────── */
const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/glimmickgames/",
    icon: InstagramIcon,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UCPpv72vtOahOG5IFflfrz5g",
    icon: YoutubeIcon,
  },
];

/* ── Legal/info links data ──────────────────────────────────── */
const LEGAL_LINKS = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
];

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="bg-paper-dark py-10 px-6 font-body text-ink"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ── Column 1: Brand Info ──────────────────────────── */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <h2 className="font-display text-2xl font-bold text-ink">GLIMMICK</h2>
          <p className="text-sm text-ink-muted">tiny games, big fun</p>
          <p className="text-sm text-ink-muted mt-4">
            &copy; {new Date().getFullYear()} GLIMMICK
          </p>
        </div>

        {/* ── Column 2: Social Links ───────────────────────── */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <h3 className="font-display text-lg font-bold text-ink">Socials</h3>
          <ul className="flex flex-col items-center md:items-start gap-3">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-ink-muted hover:text-marigold transition-colors"
                  aria-label={`Follow us on ${link.name}`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Column 3: Legal Links ────────────────────────── */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <h3 className="font-display text-lg font-bold text-ink">Legal</h3>
          <ul className="flex flex-col items-center md:items-start gap-3">
            {LEGAL_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-ink-muted hover:text-marigold transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
