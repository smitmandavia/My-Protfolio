"use client";

import { motion } from "framer-motion";
import { type MouseEventHandler } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface GlowButtonProps {
  label: string;
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
  download?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

const baseClass =
  "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]";

const variantClass = {
  primary:
    "bg-[var(--gradient-hero)] text-[var(--text-primary)] shadow-[0_0_30px_var(--accent-glow)] hover:shadow-[0_0_44px_var(--accent-glow)]",
  ghost:
    "border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-elevated)]",
};

export default function GlowButton({
  label,
  href,
  variant = "primary",
  className,
  download,
  type = "button",
  disabled,
  onClick,
  ariaLabel,
  target,
  rel,
}: GlowButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion
    ? {}
    : {
        whileHover: { y: -2, scale: 1.01 },
        whileTap: { scale: 0.98 },
      };

  if (href) {
    return (
      <motion.a
        href={href}
        download={download}
        target={target}
        rel={rel}
        aria-label={ariaLabel ?? label}
        className={cn(baseClass, variantClass[variant], className)}
        {...motionProps}
      >
        {label}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className={cn(baseClass, variantClass[variant], className)}
      {...motionProps}
    >
      {label}
    </motion.button>
  );
}
