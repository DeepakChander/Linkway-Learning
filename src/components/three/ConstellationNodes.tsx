"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 35;
const CONNECTION_DISTANCE = 2.5;

interface NodeData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
}

function generateNodes(): NodeData[] {
  const nodes: NodeData[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.002
      ),
      scale: 0.04 + Math.random() * 0.06,
    });
  }
  return nodes;
}

export default function ConstellationNodes() {
  const nodesData = useMemo(() => generateNodes(), []);
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const linesRef = useRef<THREE.LineSegments>(null);
  const time = useRef(0);

  // Triangle geometry for nodes (matching logo motif)
  const triangleGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.5);
    shape.lineTo(-0.433, -0.25);
    shape.lineTo(0.433, -0.25);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  const nodeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#F5892A"),
        emissive: new THREE.Color("#F5892A"),
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  const dimNodeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#5A7EB0"),
        emissive: new THREE.Color("#5A7EB0"),
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.5,
      }),
    []
  );

  // Line material for connections
  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#F5892A"),
        transparent: true,
        opacity: 0.12,
      }),
    []
  );

  // Pre-allocate buffer for connection lines (max possible connections = N*(N-1)/2 * 6 floats)
  const maxConnections = (NODE_COUNT * (NODE_COUNT - 1)) / 2;
  const linePositions = useMemo(() => new Float32Array(maxConnections * 6), [maxConnections]);
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    geo.setDrawRange(0, 0);
    return geo;
  }, [linePositions]);

  useFrame((_, delta) => {
    time.current += delta;

    // Update node positions (gentle drift)
    nodesData.forEach((node, i) => {
      node.position.add(node.velocity);

      // Gentle floating oscillation
      node.position.y += Math.sin(time.current * 0.5 + i * 0.7) * 0.0008;
      node.position.x += Math.cos(time.current * 0.3 + i * 0.5) * 0.0005;

      // Boundary wrapping
      if (Math.abs(node.position.x) > 5) node.velocity.x *= -1;
      if (Math.abs(node.position.y) > 3.5) node.velocity.y *= -1;
      if (Math.abs(node.position.z) > 2.5) node.velocity.z *= -1;

      // Update mesh position
      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.copy(node.position);
        mesh.rotation.z = time.current * 0.2 + i * 0.5;
      }
    });

    // Update connection lines (reuse pre-allocated buffer)
    let vertexCount = 0;
    for (let i = 0; i < nodesData.length; i++) {
      for (let j = i + 1; j < nodesData.length; j++) {
        const dist = nodesData[i].position.distanceTo(nodesData[j].position);
        if (dist < CONNECTION_DISTANCE) {
          const idx = vertexCount * 3;
          linePositions[idx] = nodesData[i].position.x;
          linePositions[idx + 1] = nodesData[i].position.y;
          linePositions[idx + 2] = nodesData[i].position.z;
          linePositions[idx + 3] = nodesData[j].position.x;
          linePositions[idx + 4] = nodesData[j].position.y;
          linePositions[idx + 5] = nodesData[j].position.z;
          vertexCount += 2;
        }
      }
    }
    lineGeometry.setDrawRange(0, vertexCount);
    lineGeometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Triangle nodes */}
      {nodesData.map((node, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) meshRefs.current[i] = el; }}
          geometry={triangleGeometry}
          material={i % 3 === 0 ? nodeMaterial : dimNodeMaterial}
          position={node.position}
          scale={node.scale}
        />
      ))}

      {/* Connection lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry} material={lineMaterial} />
    </group>
  );
}
