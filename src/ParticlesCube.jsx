import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticlesCube() {
  // Genera posiciones aleatorias dentro del cubo.
  const particlePositions = useMemo(() => {
    const count = 1000  // Número de partículas (puedes ajustar este valor)
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Distribución en el rango [-1, 1] en cada eje
      positions[i * 3] = (Math.random() - 0.5) * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2
    }
    return positions
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlePositions.length / 3}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        color="white"
        size={0.05}
        sizeAttenuation
      />
    </points>
  )
}