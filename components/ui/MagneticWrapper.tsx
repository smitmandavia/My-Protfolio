"use client";

import { motion } from "framer-motion";
import { type ReactNode, useRef, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";

interface MagneticWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function MagneticWrapper({ children, className }: MagneticWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !wrapperRef.current) {
      return;
    }

    const rect = wrapperRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.12;

    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={wrapperRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={prefersReducedMotion ? { x: 0, y: 0 } : { x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
