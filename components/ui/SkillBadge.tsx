import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  label: string;
  className?: string;
}

export default function SkillBadge({ label, className }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        "cursor-default rounded-lg border border-[#2A2A50] bg-[#1A1A35] px-3 py-1.5 font-mono text-sm text-[#C8C8E8] backdrop-blur-sm transition-all duration-200 hover:border-blue-500/60 hover:bg-[#1E1E40] hover:text-blue-300",
        className
      )}
    >
      {label}
    </span>
  );
}
