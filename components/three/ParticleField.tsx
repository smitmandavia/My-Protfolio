"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import useMousePosition from "@/hooks/useMousePosition";
import useReducedMotion from "@/hooks/useReducedMotion";

interface ParticleCloudProps {
  count: number;
  reducedMotion: boolean;
}

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function ParticleCloud({ count, reducedMotion }: ParticleCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useMousePosition();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const t = i / count;
      const mixed = new THREE.Color().lerpColors(new THREE.Color("#4F8EF7"), new THREE.Color("#7C3AED"), t);
      const randX = pseudoRandom(i + 11);
      const randY = pseudoRandom(i + 37);
      const randZ = pseudoRandom(i + 73);

      pos[i3] = (randX - 0.5) * 20;
      pos[i3 + 1] = (randY - 0.5) * 10;
      pos[i3 + 2] = (randZ - 0.5) * 12;

      colorArray[i3] = mixed.r;
      colorArray[i3 + 1] = mixed.g;
      colorArray[i3 + 2] = mixed.b;
    }

    return { positions: pos, colors: colorArray };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) {
      return;
    }

    const speed = reducedMotion ? 0.15 : 1;
    pointsRef.current.rotation.y += delta * 0.04 * speed;
    pointsRef.current.rotation.x += delta * 0.02 * speed;
    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, mouse.normalizedX * 0.25, 0.03);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, -mouse.normalizedY * 0.18, 0.03);

    if (!reducedMotion) {
      const pulse = 0.75 + Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
      const material = pointsRef.current.material;
      if (material instanceof THREE.PointsMaterial) {
        material.opacity = pulse;
      }
    }
  });

  useEffect(() => {
    const points = pointsRef.current;

    return () => {
      if (!points) {
        return;
      }

      points.geometry.dispose();
      const material = points.material;
      if (Array.isArray(material)) {
        material.forEach((mat) => mat.dispose());
      } else {
        material.dispose();
      }
    };
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleField() {
  const [count, setCount] = useState(2000);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onResize = () => {
      setCount(window.innerWidth < 768 ? 800 : 2000);
    };

    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 60 }}
      className="absolute inset-0 z-0 h-full w-full"
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <ParticleCloud count={count} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
