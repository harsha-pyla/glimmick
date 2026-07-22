import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About GLIMMICK - Funny & Creative Browser Games",
  description:
    "GLIMMICK is a playground for small, original, and wonderfully weird browser games. No sign-ups, no downloads, just instant fun.",
  keywords: [
    "creative web games",
    "funny browser games",
    "no signup games",
    "GLIMMICK",
    "indie web games",
    "free casual games",
  ],
};

export default function AboutPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl text-ink font-bold mb-8 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">
        About GLIMMICK
      </h1>

      <div className="font-body text-ink/80 space-y-6 text-lg leading-relaxed">
        <p>
          Welcome to <strong>GLIMMICK</strong>—a weird and wonderful corner of the internet dedicated entirely to small, creative, and funny browser games.
        </p>
        <p>
          We believe that the best games don&apos;t need massive downloads, complicated tutorials, or a million microtransactions. Sometimes, the most fun you can have is just trying to open a stubborn digital box, clicking a button way too many times, or solving quirky little puzzles.
        </p>
        <p>
          <strong>No sign-ups. No accounts. No paywalls.</strong> 
        </p>
        <p>
          We build these games just to make you smile (and maybe frustrate you a little bit). Jump in, play for a few minutes, share your absurdly specific completion percentages with your friends, and have a good time!
        </p>
      </div>
    </section>
  );
}
