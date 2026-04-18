'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Imperative particle system to avoid JSX type issues with R3F + React 19
function Particles({ count = 300 }: { count?: number }) {
  const { scene } = useThree();
  const meshRef = useRef<THREE.Points | null>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      const t = Math.random();
      col[i * 3] = 1;
      col[i * 3 + 1] = 0.3 + t * 0.4;
      col[i * 3 + 2] = t * 0.15;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    meshRef.current = points;
    scene.add(points);
    return () => {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, positions, colors]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return null;
}

function ArcReactorCore() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.15;
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <Sphere ref={ref} args={[1.8, 64, 64]}>
        <MeshDistortMaterial
          color="#ff4d4d"
          emissive="#ff2222"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.9}
          distort={0.25}
          speed={2}
          transparent
          opacity={0.85}
        />
      </Sphere>
      {/* Inner glow */}
      <Sphere args={[1.3, 32, 32]}>
        <meshBasicMaterial color="#f5a623" transparent opacity={0.15} />
      </Sphere>
    </Float>
  );
}

function FoodOrbit({ radius, speed, offset, emoji }: { radius: number; speed: number; offset: number; emoji: string }) {
  const ref = useRef<THREE.Group>(null);
  const spriteRef = useRef<THREE.Sprite>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = Math.sin(t * 2) * 0.5;
  });

  const colorMap: Record<string, string> = {
    '🍎': '#ff3333', '🍔': '#d4a017', '🥬': '#4caf50',
    '🧬': '#ff4d4d', '🍕': '#f5a623', '🥩': '#cc1f1f'
  };

  return (
    <group ref={ref}>
      <Float speed={3} floatIntensity={0.3}>
        <Sphere args={[0.2, 16, 16]} ref={spriteRef as unknown as React.RefObject<THREE.Mesh>}>
          <meshStandardMaterial
            color={colorMap[emoji] || '#ff4d4d'}
            emissive={colorMap[emoji] || '#ff4d4d'}
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.5}
          />
        </Sphere>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ff4d4d" />
        <pointLight position={[-5, -3, 3]} intensity={0.6} color="#f5a623" />
        <pointLight position={[0, 0, 4]} intensity={0.4} color="#ff6b35" />

        <ArcReactorCore />

        {/* Food items orbiting */}
        <FoodOrbit radius={3.2} speed={0.4} offset={0} emoji="🍎" />
        <FoodOrbit radius={3.5} speed={0.3} offset={2} emoji="🍔" />
        <FoodOrbit radius={3.8} speed={0.35} offset={4} emoji="🥬" />
        <FoodOrbit radius={2.8} speed={0.45} offset={1} emoji="🧬" />
        <FoodOrbit radius={4.0} speed={0.25} offset={3} emoji="🍕" />
        <FoodOrbit radius={3.0} speed={0.38} offset={5} emoji="🥩" />

        <Particles count={400} />
      </Canvas>
    </div>
  );
}
