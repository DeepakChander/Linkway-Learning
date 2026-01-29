"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

interface FluidSphereProps {
    interactionIntensity?: number;
}

export default function FluidSphere({ interactionIntensity = 1 }: FluidSphereProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const { mouse } = useThree();

    useFrame((state) => {
        if (!meshRef.current) return;

        // Smoother mouse-tracking rotation with configurable intensity
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
            meshRef.current.rotation.x,
            mouse.y * 0.3 * interactionIntensity,
            0.04
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
            meshRef.current.rotation.y,
            mouse.x * 0.3 * interactionIntensity,
            0.04
        );

        // Dynamic distortion based on mouse distance
        const dist = Math.sqrt(mouse.x ** 2 + mouse.y ** 2);
        const material = meshRef.current.material as any;
        if (material && material.distort !== undefined) {
            const targetDistort = 0.3 + dist * 0.5 * interactionIntensity;
            material.distort = THREE.MathUtils.lerp(material.distort, targetDistort, 0.04);
        }

        // Subtle scale breathing
        const time = state.clock.getElapsedTime();
        const breathe = 1 + Math.sin(time * 0.8) * 0.02;
        meshRef.current.scale.setScalar(2 * breathe);
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh ref={meshRef} scale={2}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial
                    color="#F5892A"
                    envMapIntensity={1.2}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    metalness={0.15}
                    roughness={0.15}
                    distort={0.4}
                    speed={2}
                />
            </mesh>
            {/* Cinematic rim light halos */}
            <pointLight position={[3, 0, -2]} intensity={0.6} color="#F5892A" distance={6} />
            <pointLight position={[-3, 0, -2]} intensity={0.4} color="#1B3A5C" distance={6} />
        </Float>
    );
}
