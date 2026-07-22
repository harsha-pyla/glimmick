import React from "react";
import { OpenTheBoxGame } from "@/components/games/open-the-box/OpenTheBoxGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open The Box - Glimmick",
  description: "A mysterious box. Can you figure out how to open it?",
  openGraph: {
    title: "Open The Box",
    description: "I opened the box. Completion: 0.8%. Can you?",
    url: "https://glimmick.vercel.app/games/open-the-box",
    siteName: "Glimmick",
    locale: "en_US",
    type: "website",
  },
};

export default function OpenTheBoxPage() {
  return <OpenTheBoxGame />;
}
