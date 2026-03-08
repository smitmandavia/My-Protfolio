import type { Metadata } from "next";
import GamesLayout from "@/components/games/GamesLayout";

export const metadata: Metadata = {
  title: "Games | Smit Mandavia",
  description: "Two interactive browser games built with React & Canvas",
};

export default function GamesPage() {
  return <GamesLayout />;
}
