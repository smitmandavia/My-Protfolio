"use client";

import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

interface SectionHeadingProps {
  label: string;
  title: string;
}

export default function SectionHeading({ label, title }: SectionHeadingProps) {
  return (
    <AnimateOnScroll direction="up">
      <div className="mb-12 text-center">
        <span className="sr-only">{label}</span>
        <h2 className="text-4xl font-bold text-white md:text-5xl">{title}</h2>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
      </div>
    </AnimateOnScroll>
  );
}
