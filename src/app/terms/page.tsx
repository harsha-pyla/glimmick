import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - GLIMMICK",
  description:
    "The rules of playing on GLIMMICK. Play fair, have fun, and don't try to break the games.",
  keywords: [
    "terms of service",
    "GLIMMICK rules",
    "terms and conditions",
  ],
};

export default function TermsPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl text-ink font-bold mb-8 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">
        Terms & Conditions
      </h1>

      <div className="font-body text-ink/80 space-y-6 text-lg leading-relaxed">
        <p>
          Welcome to GLIMMICK! By playing our games, you agree to these very simple and informal terms of service. 
        </p>

        <h2 className="text-2xl font-bold text-ink mt-8 mb-4 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">
          1. Rule Number One: Have Fun
        </h2>
        <p>
          Our games are built to be small, creative, and sometimes a little bit ridiculous. You agree to approach them with a sense of humor. If a game makes you rage-quit, take a deep breath and come back later.
        </p>

        <h2 className="text-2xl font-bold text-ink mt-8 mb-4 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">
          2. No Accounts, No Shenanigans
        </h2>
        <p>
          Since we don&apos;t use authentication or user accounts, you don&apos;t have to worry about passwords. But this also means any progress you make is typically stored locally in your browser. If you clear your cache, your progress might disappear. We are not responsible for lost bragging rights.
        </p>

        <h2 className="text-2xl font-bold text-ink mt-8 mb-4 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">
          3. Don&apos;t Break Things On Purpose
        </h2>
        <p>
          Please don&apos;t try to maliciously hack, DDoS, or otherwise destroy the website. We&apos;re just trying to make fun games here.
        </p>

        <h2 className="text-2xl font-bold text-ink mt-8 mb-4 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">
          4. &quot;As Is&quot; Basis
        </h2>
        <p>
          We provide these games &quot;as is&quot; without any warranties. Sometimes bugs happen. Sometimes the physics engine decides to launch a box into orbit. If you find a bug, feel free to report it by emailing us at <a href="mailto:harsha1029p@gmail.com" className="text-ink font-bold hover:text-marigold underline">harsha1029p@gmail.com</a>.
        </p>

        <p className="text-sm text-ink/60 mt-12 pt-8 border-t border-ink/10">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </section>
  );
}
