"use client";

import { useEffect, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

const initialPosition: MousePosition = {
  x: 0,
  y: 0,
  normalizedX: 0,
  normalizedY: 0,
};

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>(initialPosition);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;

      setPosition({
        x: event.clientX,
        y: event.clientY,
        normalizedX: (event.clientX / width - 0.5) * 2,
        normalizedY: (event.clientY / height - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return position;
}

export default useMousePosition;
