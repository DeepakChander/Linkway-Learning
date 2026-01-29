"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

// Location dots representing major tech/education hubs
const locations = [
  { lat: 28.6139, lon: 77.209, name: "Delhi", size: 1.4 },
  { lat: 19.076, lon: 72.8777, name: "Mumbai", size: 1.2 },
  { lat: 12.9716, lon: 77.5946, name: "Bangalore", size: 1.4 },
  { lat: 17.385, lon: 78.4867, name: "Hyderabad", size: 1.1 },
  { lat: 13.0827, lon: 80.2707, name: "Chennai", size: 1.0 },
  { lat: 37.7749, lon: -122.4194, name: "San Francisco", size: 1.0 },
  { lat: 51.5074, lon: -0.1278, name: "London", size: 1.0 },
  { lat: 35.6762, lon: 139.6503, name: "Tokyo", size: 0.9 },
  { lat: 1.3521, lon: 103.8198, name: "Singapore", size: 0.9 },
  { lat: -33.8688, lon: 151.2093, name: "Sydney", size: 0.8 },
  { lat: 22.3193, lon: 114.1694, name: "Hong Kong", size: 0.9 },
  { lat: 25.2048, lon: 55.2708, name: "Dubai", size: 0.9 },
  { lat: 40.7128, lon: -74.006, name: "New York", size: 1.0 },
  { lat: 48.8566, lon: 2.3522, name: "Paris", size: 0.8 },
];

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function createArc(start: THREE.Vector3, end: THREE.Vector3, segments: number = 64): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = new THREE.Vector3().lerpVectors(start, end, t);
    const lift = Math.sin(t * Math.PI) * 0.2;
    point.normalize().multiplyScalar(1 + lift);
    points.push(point);
  }
  return points;
}

// ── Simplified continent outline coordinates (lat, lon pairs) ──
// These trace the rough coastline shapes so continents are visible as outlines

const continentOutlines: number[][][] = [
  // North America
  [
    [60,-140],[65,-168],[72,-157],[71,-135],[60,-140],[55,-130],[48,-125],[40,-124],
    [33,-118],[28,-115],[25,-110],[20,-105],[18,-97],[20,-90],[25,-90],[30,-85],
    [25,-80],[27,-77],[30,-81],[32,-80],[35,-75],[38,-75],[40,-74],[42,-70],
    [44,-67],[47,-60],[47,-53],[52,-56],[55,-60],[60,-65],[60,-80],[58,-93],
    [55,-95],[50,-95],[50,-90],[48,-88],[46,-84],[43,-82],[42,-83],[45,-75],
    [48,-70],[50,-65],[52,-57],[55,-60],[60,-65],[63,-70],[67,-65],[70,-60],
    [72,-80],[70,-100],[70,-120],[65,-140],[60,-140],
  ],
  // South America
  [
    [12,-72],[10,-75],[8,-77],[5,-77],[2,-79],[-2,-80],[-5,-81],[-6,-77],
    [-4,-70],[-1,-67],[3,-60],[7,-60],[10,-65],[12,-72],
    [-6,-77],[-10,-78],[-15,-75],[-18,-70],[-20,-63],[-22,-58],
    [-25,-55],[-28,-49],[-33,-51],[-38,-56],[-42,-63],[-46,-66],
    [-50,-68],[-54,-68],[-55,-65],[-52,-70],[-48,-74],[-42,-73],
    [-38,-73],[-33,-72],[-28,-70],[-22,-70],[-18,-70],[-15,-75],
  ],
  // Europe
  [
    [36,-9],[37,-6],[38,-2],[40,0],[42,3],[43,5],[44,8],[45,12],[41,14],
    [39,16],[38,20],[40,22],[41,26],[42,28],[41,29],[44,28],[46,30],
    [48,28],[50,25],[52,21],[54,18],[55,14],[56,10],[54,8],[53,5],
    [51,4],[50,1],[49,-3],[48,-5],[46,-1],[44,-1],[43,0],[40,-4],
    [37,-6],[36,-9],
  ],
  // Scandinavia
  [
    [56,12],[58,11],[59,10],[60,5],[62,5],[64,10],[66,14],[68,15],
    [70,20],[71,26],[70,28],[68,28],[65,25],[62,18],[60,15],[58,14],[56,12],
  ],
  // Africa
  [
    [37,10],[35,0],[33,-8],[30,-10],[25,-15],[20,-17],[15,-17],[10,-15],
    [5,-5],[4,1],[5,10],[2,10],[0,10],[-2,12],[-5,12],[-8,14],
    [-12,15],[-15,17],[-18,22],[-22,25],[-26,28],[-30,30],[-34,26],
    [-35,20],[-33,18],[-30,17],[-25,15],[-20,12],[-15,12],[-10,14],
    [-6,40],[-2,42],[3,42],[5,45],[10,45],[12,50],[15,50],[18,48],
    [20,45],[22,40],[25,37],[28,34],[30,32],[32,32],[34,28],[36,20],
    [37,15],[37,10],
  ],
  // Asia (mainland)
  [
    [42,30],[45,35],[42,40],[40,44],[38,48],[30,48],[25,50],[22,55],
    [25,58],[26,56],[28,60],[30,65],[35,62],[40,55],[42,50],[45,50],
    [48,55],[50,58],[52,60],[55,65],[58,70],[60,68],[62,70],[65,75],
    [68,80],[70,90],[72,100],[72,120],[70,135],[68,140],[65,143],
    [60,140],[55,135],[50,130],[45,135],[42,132],[38,128],[35,130],
    [32,132],[30,122],[28,118],[25,120],[22,115],[18,110],[15,108],
    [10,105],[8,100],[5,103],[1,104],
  ],
  // India (detailed)
  [
    [34,74],[32,76],[30,78],[28,77],[26,80],[24,83],[22,87],[20,88],
    [18,84],[16,81],[14,80],[12,80],[10,79],[8,77],[10,76],[12,75],
    [14,74],[16,73],[18,73],[20,72],[22,70],[24,69],[26,70],[28,73],
    [30,74],[32,74],[34,74],
  ],
  // Australia
  [
    [-12,130],[-13,136],[-15,141],[-18,146],[-22,150],[-25,153],
    [-28,153],[-30,153],[-33,152],[-35,150],[-37,147],[-38,145],
    [-38,140],[-35,137],[-33,134],[-32,132],[-30,130],[-28,128],
    [-25,125],[-22,120],[-20,118],[-18,116],[-16,120],[-14,125],
    [-12,130],
  ],
  // Japan
  [
    [31,130],[33,130],[35,133],[36,136],[37,138],[38,139],[40,140],
    [42,141],[43,144],[45,142],[44,140],[42,140],[40,139],[38,138],
    [36,136],[34,132],[31,130],
  ],
  // UK/Ireland
  [
    [50,-5],[51,-3],[52,0],[53,0],[54,-1],[55,-2],[56,-3],[57,-5],
    [58,-3],[57,-2],[56,0],[54,1],[52,2],[51,1],[50,-1],[50,-5],
  ],
];

// Generate outline points as connected dots
function ContinentOutlines() {
  const outlinePoints = useMemo(() => {
    const allPoints: THREE.Vector3[] = [];
    const radius = 1.003;

    continentOutlines.forEach((outline) => {
      for (let i = 0; i < outline.length; i++) {
        const [lat1, lon1] = outline[i];
        const [lat2, lon2] = outline[(i + 1) % outline.length];

        // Interpolate between consecutive outline points
        const steps = Math.max(3, Math.floor(
          Math.sqrt((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2) / 1.5
        ));
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const lat = lat1 + (lat2 - lat1) * t;
          const lon = lon1 + (lon2 - lon1) * t;
          allPoints.push(latLonToVector3(lat, lon, radius));
        }
      }
    });

    return allPoints;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints(outlinePoints);
    return geo;
  }, [outlinePoints]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#7DD3E8"
        size={0.008}
        transparent
        opacity={0.95}
        sizeAttenuation
      />
    </points>
  );
}

// Fill continents with dots inside the outlines
function ContinentFill() {
  const fillDots = useMemo(() => {
    const dots: THREE.Vector3[] = [];
    const radius = 1.002;

    const addRegion = (latMin: number, latMax: number, lonMin: number, lonMax: number, density: number, fillRate: number = 0.5) => {
      for (let lat = latMin; lat <= latMax; lat += density) {
        for (let lon = lonMin; lon <= lonMax; lon += density) {
          const jLat = lat + (Math.random() - 0.5) * density * 0.7;
          const jLon = lon + (Math.random() - 0.5) * density * 0.7;
          if (Math.random() < fillRate) {
            dots.push(latLonToVector3(jLat, jLon, radius));
          }
        }
      }
    };

    // Fill regions with lighter dots
    addRegion(25, 70, -170, -50, 3, 0.4);   // North America
    addRegion(-55, 12, -82, -34, 3, 0.4);   // South America
    addRegion(35, 72, -10, 60, 2.5, 0.45);  // Europe
    addRegion(-35, 37, -18, 52, 3, 0.4);    // Africa
    addRegion(5, 72, 60, 180, 3, 0.35);     // Asia
    addRegion(-45, -10, 110, 155, 3, 0.4);  // Australia
    addRegion(8, 35, 68, 97, 1.5, 0.6);     // India (denser)

    return dots;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints(fillDots);
    return geo;
  }, [fillDots]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#3A7A90"
        size={0.009}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// India highlighted with warm accent
function IndiaHighlight() {
  const dots = useMemo(() => {
    const result: THREE.Vector3[] = [];
    const radius = 1.005;
    for (let lat = 8; lat <= 35; lat += 0.7) {
      for (let lon = 68; lon <= 97; lon += 0.7) {
        const jLat = lat + (Math.random() - 0.5) * 0.4;
        const jLon = lon + (Math.random() - 0.5) * 0.4;
        if (Math.random() < 0.45) {
          result.push(latLonToVector3(jLat, jLon, radius));
        }
      }
    }
    return result;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints(dots);
    return geo;
  }, [dots]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#F5892A"
        size={0.008}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// Grid lines
function EarthGrid() {
  const gridPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const radius = 1.001;

    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (90 - lat) * (Math.PI / 180);
      for (let lon = 0; lon <= 360; lon += 5) {
        const theta = lon * (Math.PI / 180);
        points.push(
          new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
          )
        );
      }
    }

    for (let lon = 0; lon < 360; lon += 30) {
      const theta = lon * (Math.PI / 180);
      for (let lat = -90; lat <= 90; lat += 5) {
        const phi = (90 - lat) * (Math.PI / 180);
        points.push(
          new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
          )
        );
      }
    }

    return points;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints(gridPoints);
    return geo;
  }, [gridPoints]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#1A2530"
        size={0.004}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// Atmosphere
function Atmosphere() {
  return (
    <>
      <Sphere args={[1.015, 64, 64]}>
        <meshBasicMaterial color="#3A6A7A" transparent opacity={0.06} side={THREE.BackSide} />
      </Sphere>
      <Sphere args={[1.04, 64, 64]}>
        <meshBasicMaterial color="#4A8A9A" transparent opacity={0.08} side={THREE.BackSide} />
      </Sphere>
      <Sphere args={[1.08, 64, 64]}>
        <meshBasicMaterial color="#3A6A7A" transparent opacity={0.05} side={THREE.BackSide} />
      </Sphere>
      <Sphere args={[1.15, 48, 48]}>
        <meshBasicMaterial color="#2A4A5A" transparent opacity={0.03} side={THREE.BackSide} />
      </Sphere>
    </>
  );
}

// Location marker
function LocationDot({ position, size, delay }: { position: THREE.Vector3; size: number; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !ringRef.current || !outerRingRef.current) return;
    const time = state.clock.getElapsedTime();

    const pulse = Math.sin((time + delay) * 2.5) * 0.4 + 1;
    meshRef.current.scale.setScalar(size * 0.018 * pulse);

    const ringPhase = ((time + delay) % 2) / 2;
    ringRef.current.scale.setScalar(size * 0.04 * (1 + ringPhase * 2.5));
    (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - ringPhase);

    const outerPhase = ((time + delay + 1) % 3) / 3;
    outerRingRef.current.scale.setScalar(size * 0.05 * (1 + outerPhase * 3));
    (outerRingRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 * (1 - outerPhase);
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size * 0.025, 16, 16]} />
        <meshBasicMaterial color="#F5892A" transparent opacity={0.15} />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#F5892A" />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial color="#F5892A" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial color="#F5892A" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Connection arc with travelling pulse
function ConnectionArc({ start, end, delay }: { start: THREE.Vector3; end: THREE.Vector3; delay: number }) {
  const lineRef = useRef<THREE.Line>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const points = useMemo(() => createArc(start, end), [start, end]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useFrame((state) => {
    if (!lineRef.current) return;
    const time = state.clock.getElapsedTime();
    const material = lineRef.current.material as THREE.LineBasicMaterial;
    material.opacity = (Math.sin((time + delay) * 1.5) * 0.3 + 0.5) * 0.7;

    if (pulseRef.current) {
      const t = ((time * 0.3 + delay) % 1);
      const idx = Math.floor(t * (points.length - 1));
      const pt = points[Math.min(idx, points.length - 1)];
      pulseRef.current.position.copy(pt);
      pulseRef.current.scale.setScalar(0.008 + Math.sin(time * 4) * 0.003);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - Math.abs(t - 0.5) * 2);
    }
  });

  return (
    <group>
      {/* @ts-expect-error - R3F line element conflicts with SVG line type */}
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial color="#F5892A" transparent opacity={0.5} linewidth={1} />
      </line>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#FF9F43" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export default function EarthGlobe({
  scrollProgress = 0,
}: {
  scrollProgress?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const locationPositions = useMemo(() => {
    return locations.map((loc) => ({
      ...loc,
      position: latLonToVector3(loc.lat, loc.lon, 1.01),
    }));
  }, []);

  const connections = useMemo(() => {
    const arcs: { start: THREE.Vector3; end: THREE.Vector3; delay: number }[] = [];
    arcs.push({ start: locationPositions[0].position, end: locationPositions[1].position, delay: 0 });
    arcs.push({ start: locationPositions[0].position, end: locationPositions[2].position, delay: 0.5 });
    arcs.push({ start: locationPositions[2].position, end: locationPositions[8].position, delay: 1 });
    arcs.push({ start: locationPositions[0].position, end: locationPositions[11].position, delay: 1.5 });
    arcs.push({ start: locationPositions[6].position, end: locationPositions[5].position, delay: 2 });
    arcs.push({ start: locationPositions[3].position, end: locationPositions[4].position, delay: 2.5 });
    arcs.push({ start: locationPositions[12].position, end: locationPositions[6].position, delay: 3 });
    arcs.push({ start: locationPositions[8].position, end: locationPositions[7].position, delay: 3.5 });
    return arcs;
  }, [locationPositions]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    groupRef.current.rotation.y = time * 0.06;
    groupRef.current.rotation.x = 0.15 + Math.sin(time * 0.2) * 0.02;

    const baseScale = 2.0;
    const maxScale = 5.0;
    const scale = baseScale + (maxScale - baseScale) * Math.pow(scrollProgress, 0.8);
    groupRef.current.scale.setScalar(scale);

    groupRef.current.position.y = -scrollProgress * 1.5;
    groupRef.current.position.z = scrollProgress * 1;
  });

  return (
    <group ref={groupRef}>
      {/* Core sphere - dark ocean */}
      <Sphere args={[0.995, 64, 64]}>
        <meshStandardMaterial color="#030508" roughness={0.95} metalness={0.05} />
      </Sphere>

      <EarthGrid />
      <ContinentOutlines />
      <ContinentFill />
      <IndiaHighlight />
      <Atmosphere />

      {locationPositions.map((loc, i) => (
        <LocationDot
          key={loc.name}
          position={loc.position}
          size={loc.size}
          delay={i * 0.3}
        />
      ))}

      {connections.map((conn, i) => (
        <ConnectionArc
          key={i}
          start={conn.start}
          end={conn.end}
          delay={conn.delay}
        />
      ))}
    </group>
  );
}
