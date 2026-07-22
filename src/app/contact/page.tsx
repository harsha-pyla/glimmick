import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact GLIMMICK - Say Hello",
  description:
    "Have a funny game idea? Found a bug? Just want to say hi? Contact the creator of GLIMMICK.",
  keywords: [
    "contact GLIMMICK",
    "game support",
    "feedback",
    "indie developer contact",
  ],
};

export default function ContactPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
      <h1 className="font-display text-4xl md:text-5xl text-ink font-bold mb-6 font-['Comic_Sans_MS',_'Chalkboard_SE',_'Comic_Neue',_sans-serif]">
        Contact Us
      </h1>

      <div className="font-body text-ink/80 space-y-6 text-lg leading-relaxed max-w-xl mx-auto">
        <p>
          Got a brilliant idea for a weird new game? Found a bug that literally broke your browser? Or maybe you just want to brag about beating <em>Open The Box</em> in under 20 seconds?
        </p>
        <p>
          Whatever it is, we&apos;d love to hear from you!
        </p>
        
        <div className="bg-ink/5 p-8 rounded-2xl border-2 border-ink/10 my-8">
          <p className="text-sm font-bold text-ink/60 uppercase tracking-widest mb-2">Drop an email to</p>
          <a 
            href="mailto:harsha1029p@gmail.com" 
            className="text-2xl font-bold text-ink hover:text-marigold transition-colors"
          >
            harsha1029p@gmail.com
          </a>
        </div>

        <p className="text-sm text-ink/60">
          Since it&apos;s just a small indie project, replies might not be instant, but we read every single message. Thanks for playing!
        </p>
      </div>
    </section>
  );
}
