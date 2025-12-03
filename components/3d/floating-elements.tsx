"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text3D } from "@react-three/drei"
import type * as THREE from "three"

export function FloatingSkillIcons() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  const skills = [
    { text: "React", position: [-3, 2, 0], color: "#61DAFB" },
    { text: "Python", position: [3, 1, -1], color: "#3776AB" },
    { text: "Design", position: [-2, -1, 1], color: "#FF6B6B" },
    { text: "Blockchain", position: [2, -2, 0], color: "#F7931A" },
    { text: "AI/ML", position: [0, 3, -2], color: "#00D2FF" },
  ]

  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => (
        <Float key={skill.text} speed={1 + index * 0.2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Text3D
            font="/fonts/Geist_Bold.json"
            size={0.3}
            height={0.05}
            position={skill.position as [number, number, number]}
          >
            {skill.text}
            <meshStandardMaterial color={skill.color} />
          </Text3D>
        </Float>
      ))}
    </group>
  )
}
