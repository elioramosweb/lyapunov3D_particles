// Scene.jsx
import React from 'react'
import ParticlesCube from './ParticlesCube'

export default function Scene() {
  return (
    <mesh position={[0, 0, 0]}>
      {/* <BoxWithShader/> */}
      <ParticlesCube/>
    </mesh>
  )
}
