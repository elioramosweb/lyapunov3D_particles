// Scene.jsx
import React from 'react'
import BoxWithShader from './BoxWithShader'

export default function Scene() {
  return (
    <mesh position={[0, 0, 0]}>
      <BoxWithShader/>
    </mesh>
  )
}
