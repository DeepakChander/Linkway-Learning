"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function GlassBlob() {
    const meshRef = useRef<THREE.Mesh>(null);
    const { viewport, mouse } = useThree();
    const targetPos = useRef(new THREE.Vector3());

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();

        // Gentle floating
        meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;
        meshRef.current.rotation.x = Math.cos(time * 0.3) * 0.1;
        meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;

        // Smoother mouse tracking with lerp
        const targetX = (mouse.x * viewport.width) / 2;
        const targetY = (mouse.y * viewport.height) / 2;
        targetPos.current.set(targetX, targetY, 20);

        // Lerp for smoother response
        const currentLook = meshRef.current.position.clone();
        currentLook.lerp(targetPos.current, 0.08);
        meshRef.current.lookAt(currentLook.x, currentLook.y, 20);

        // Scroll-linked color shift via uniform
        const scrollProgress = typeof window !== 'undefined'
            ? Math.min(window.scrollY / 800, 1)
            : 0;
        const material = meshRef.current.material as any;
        if (material && material.color) {
            const r = THREE.MathUtils.lerp(1, 0.96, scrollProgress);
            const g = THREE.MathUtils.lerp(1, 0.51, scrollProgress);
            const b = THREE.MathUtils.lerp(1, 0.16, scrollProgress);
            material.color.setRGB(r, g, b);
        }
    });

    return (
        <mesh ref={meshRef} scale={1.8}>
            <sphereGeometry args={[1, 128, 128]} />
            <MeshTransmissionMaterial
                backside
                samples={4}
                resolution={1024}
                transmission={1}
                roughness={0.0}
                thickness={0.5}
                ior={1.5}
                chromaticAberration={0.06}
                anisotropy={0.1}
                distortion={0.5}
                distortionScale={0.3}
                temporalDistortion={0.5}
                color="#ffffff"
                background={new THREE.Color("#0a192f")}
            />
        </mesh>
    );
}
