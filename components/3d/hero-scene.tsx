"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text as ThreeText, Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function SkillIcon({ position, color, text }: { position: [number, number, number]; color: string; text: string }) {
  const meshRef = useRef<Mesh>(null);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });
  return (
    <>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      <ThreeText
        position={[position[0], position[1] + 1.2, position[2]]}
        fontSize={0.4}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist_Bold.json"
      >
        {text}
      </ThreeText>
    </>
  );
}

function BlockchainNodes() {
  return (
    <group>
      {Array.from({ length: 8 }).map((_, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={[Math.cos((i / 8) * 2 * Math.PI) * 5, Math.sin((i / 8) * 2 * Math.PI) * 5, 0]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#0ea5e9" />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function HeroScene() {
  return (
    <div className="w-full h-screen relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#84cc16" />
          <SkillIcon position={[-4, 2, 0]} color="#15803d" text="CODE" />
          <SkillIcon position={[4, 1, -2]} color="#84cc16" text="DESIGN" />
          <SkillIcon position={[-2, -1, 2]} color="#f59e0b" text="MARKET" />
          <SkillIcon position={[3, -2, 1]} color="#dc2626" text="TEACH" />
          <SkillIcon position={[0, 3, -1]} color="#8b5cf6" text="LEARN" />
          <BlockchainNodes />
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
        </Suspense>
      </Canvas>
      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center z-10 max-w-4xl px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">KAUSHALX</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance">
            Master Skills • Earn Crypto • Build Future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
            <Button size="lg" asChild className="px-8 py-4 text-lg font-semibold shadow-lg shadow-primary/40">
              <Link href="/auth/signup" className="flex items-center gap-2">
                Start Earning Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="px-8 py-4 text-lg font-semibold border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <Link href="/library">Explore Skills</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroScene;