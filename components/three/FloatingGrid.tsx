"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import useMousePosition from "@/hooks/useMousePosition";
import useReducedMotion from "@/hooks/useReducedMotion";

function GridScene() {
  const gridRef = useRef<THREE.GridHelper>(null);
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();
  const mouse = useMousePosition();

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    if (!reducedMotion) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.6 + mouse.normalizedY * 0.08, 0.02);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, mouse.normalizedX * 0.05, 0.02);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouse.normalizedX * 0.4, 0.02);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, Math.sin(state.clock.elapsedTime * 0.4) * 0.15, 0.02);
      groupRef.current.rotation.y += delta * 0.015;
    }
  });

  useEffect(() => {
    const grid = gridRef.current;

    return () => {
      if (!grid) {
        return;
      }

      grid.geometry.dispose();
      const material = grid.material;
      if (Array.isArray(material)) {
        material.forEach((mat) => mat.dispose());
      } else {
        material.dispose();
      }
    };
  }, []);

  return (
    <group ref={groupRef} position={[0, -1.7, -2]} rotation={[-0.6, 0, 0]}>
      <gridHelper ref={gridRef} args={[28, 40, "#4F8EF7", "#1E1E3A"]} />
    </group>
  );
}

export default function FloatingGrid() {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 1.5]}
      camera={{ position: [0, 3, 8], fov: 45 }}
      className="absolute inset-0 h-full w-full opacity-50"
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.3} />
      <Suspense fallback={null}>
        <GridScene />
      </Suspense>
    </Canvas>
  );
}
