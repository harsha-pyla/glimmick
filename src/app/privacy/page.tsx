import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - GLIMMICK",
  description:
    "We don't collect your data. GLIMMICK is completely free of accounts, logins, and creepy tracking. Just play and have fun.",
  keywords: [
    "privacy policy",
    "no tracking",
    "safe web games",
    "GLIMMICK privacy",
  ],
};

export default function PrivacyPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl text-ink font-bold mb-8 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">
        Privacy Policy
      </h1>

      <div className="font-body text-ink/80 space-y-6 text-lg leading-relaxed">
        <p><strong>Short version: We don&apos;t want your data.</strong></p>
        
        <p>
          GLIMMICK was built to be a fun, creative, and safe place to play tiny browser games. We hate it when websites force you to create an account or aggressively track you across the web just to click a few buttons.
        </p>

        <h2 className="text-2xl font-bold text-ink mt-8 mb-4 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">
          No Accounts, No Authentication
        </h2>
        <p>
          You do not need to sign up, log in, or give us your email address to play our games. There are no accounts, which means there are no passwords for us to store or lose.
        </p>

        <h2 className="text-2xl font-bold text-ink mt-8 mb-4 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">
          What we DO collect
        </h2>
        <p>
          We might use standard, privacy-friendly analytics (like Vercel Web Analytics) just to see how many people are playing our games and which countries they&apos;re from. This data is completely anonymous and cannot be tied back to you personally.
        </p>

        <h2 className="text-2xl font-bold text-ink mt-8 mb-4 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">
          Contacting Us
        </h2>
        <p>
          If you choose to email us at <strong>harsha1029p@gmail.com</strong>, we will obviously see your email address and whatever you write in the message. We only use this to reply to your feedback or support questions, and we will never sell your email to anyone.
        </p>

        <p className="text-sm text-ink/60 mt-12 pt-8 border-t border-ink/10">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </section>
  );
}
