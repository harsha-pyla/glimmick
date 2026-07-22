import type { Metadata } from "next";
import { PerfectLineGame } from "@/components/games/perfect-line/PerfectLineGame";

export const metadata: Metadata = {
  title: "Perfect Straight Line — GLIMMICK",
  description: "Can you draw a perfectly straight line? Test your hand stability and try to score 100%!",
  keywords: ["straight line game", "drawing game", "mouse accuracy game", "GLIMMICK", "perfect line"],
};

export default function PerfectLinePage() {
  return <PerfectLineGame />;
}
