"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, Preload, Stars } from "@react-three/drei";
import * as THREE from "three";
import EarthGlobe from "./EarthGlobe";

// Animated floating particles with drift
function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 400; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 2.5 + Math.random() * 5;
      temp.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        )
      );
    }
    return temp;
  }, []);

  const sizes = useMemo(() => {
    return new Float32Array(particles.map(() => 0.015 + Math.random() * 0.025));
  }, [particles]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints(particles);
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [particles, sizes]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.08) * 0.05;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#3A7A9A"
        size={0.025}
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Secondary particles for depth
function BlueParticles() {
  const ref = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 150; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 3 + Math.random() * 6;
      temp.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        )
      );
    }
    return temp;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints(particles);
    return geo;
  }, [particles]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = -state.clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#3A7A9A"
        size={0.015}
        transparent
        opacity={0.2}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="absolute inset-0 z-0" role="img" aria-label="Interactive 3D globe visualization with floating particles">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <AdaptiveDpr pixelated />

        {/* Ambient - slightly stronger */}
        <ambientLight intensity={0.4} />

        {/* Key light */}
        <directionalLight position={[5, 3, 5]} intensity={1.8} color="#ffffff" />

        {/* Fill light - blue tint */}
        <directionalLight position={[-5, -2, 3]} intensity={0.4} color="#2A5A78" />

        {/* Orange accent from top */}
        <pointLight position={[2, 5, -3]} intensity={1.2} color="#F5892A" distance={15} />

        {/* Blue rim light */}
        <pointLight position={[-3, -4, 4]} intensity={0.4} color="#2A5A78" distance={12} />

        {/* Warm highlight from below */}
        <pointLight position={[0, -6, 2]} intensity={0.3} color="#F5892A" distance={10} />

        <Suspense fallback={null}>
          <EarthGlobe scrollProgress={scrollProgress} />
          <FloatingParticles />
          <BlueParticles />

          <Stars
            radius={80}
            depth={60}
            count={3000}
            factor={3}
            saturation={0}
            fade
            speed={0.2}
          />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
}
