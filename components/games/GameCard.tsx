import { type ReactNode } from "react";

interface GameCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  tags: string[];
  children: ReactNode;
}

export default function GameCard({ emoji, title, subtitle, tags, children }: GameCardProps) {
  return (
    <div className="mx-auto max-w-[900px] overflow-hidden rounded-2xl border border-[#2A2A50] bg-[#13132A] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#2A2A50] bg-[#0D0D1A] px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">
            {emoji}
          </span>
          <div>
            <h3 className="font-bold text-white">{title}</h3>
            <p className="text-xs text-[#8888AA]">{subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2" aria-hidden="true">
          <div className="h-3 w-3 rounded-full bg-red-500/60" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
          <div className="h-3 w-3 rounded-full bg-green-500/60" />
        </div>
      </div>

      <div className="flex flex-col items-center p-6">{children}</div>

      <div className="flex items-center gap-2 border-t border-[#2A2A50] bg-[#0D0D1A] px-6 py-3">
        <span className="text-xs text-[#50507A]">Built with:</span>
        {tags.map((tag) => (
          <span key={tag} className="rounded-md border border-[#2A2A50] bg-[#1A1A35] px-2 py-0.5 text-xs text-[#8888AA]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
