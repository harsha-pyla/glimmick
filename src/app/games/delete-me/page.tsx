import { DeleteMeGame } from "@/components/games/delete-me/DeleteMeGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Me | GLIMMICK",
  description: "Find the one mistake and delete it.",
};

export default function DeleteMePage() {
  return <DeleteMeGame />;
}
