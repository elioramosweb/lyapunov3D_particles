import React, { useMemo,useRef,useEffect} from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { GUI } from 'dat.gui'

export default function ParticlesCube() {

  const shaderRef = useRef()

  useEffect(() => {
 
    const gui = new GUI()

    const updateGUI = () => {
      if (shaderRef.current) {

        const folder = gui.addFolder('Shader Uniforms')

        const params = { count: 100 };

        folder.add(params, 'count', 100, 100000, 100).name('count').onChange((value) => {
          count = value; // aunque esto no regenerará las partículas
        });
        

        folder.add(shaderRef.current.uniforms.uZoom, 'value', 0, 5, 0.001).name('uZoom')
          .onChange((value) => {
            shaderRef.current.uniforms.uZoom.value = value
        })

        folder.add(shaderRef.current.uniforms.uDisplaceX, 'value', -10, 10, 0.001).name('uDisplaceX')
          .onChange((value) => {
            shaderRef.current.uniforms.uDisplaceX.value = value
        })

        folder.add(shaderRef.current.uniforms.uDisplaceY, 'value', -10, 10, 0.001).name('uDisplaceY')
          .onChange((value) => {
            shaderRef.current.uniforms.uDisplaceY.value = value
        })

        folder.add(shaderRef.current.uniforms.uDisplaceZ, 'value', -10, 10, 0.001).name('uDisplaceZ')
          .onChange((value) => {
            shaderRef.current.uniforms.uDisplaceZ.value = value
        })

      folder.open()
      } else {
        setTimeout(updateGUI, 100)
      }
    }

    updateGUI()

    // Limpieza: destruimos el objeto GUI cuando el componente se desmonte
    return () => {
      gui.destroy()
    }
  }, [])


  const particlePositions = useMemo(() => {
    //const count = uCount
    const positions = new Float32Array(params.count * 3)
    for (let i = 0; i < params.count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return positions
  }, [])


  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uColor: { value: new THREE.Color('skyblue') },
      uSize: { value: 5.0 },
      uDisplaceX:{value: 0.0},
      uDisplaceY:{value: 0.0},
      uDisplaceZ:{value: 0.0},
      uZoom:{value:1.0}

    },
    vertexShader: `

      uniform float uTime;
      uniform float uSize;
      uniform float uZoom;
      uniform float uDisplaceX;
      uniform float uDisplaceY;
      uniform float uDisplaceZ;
      
      varying vec3 vObjectPos;
      varying vec3 vPosition;
      
      void main() {
        vObjectPos = position;       
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize / -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader:
    `
      #define NMAX 100

      uniform vec3 uColor;
      uniform float uTime;
      uniform float uSize;
      uniform float uZoom;
      uniform float uDisplaceX;
      uniform float uDisplaceY;
      uniform float uDisplaceZ;

      varying vec3 vObjectPos;
      varying vec3 vPosition;

      float lyapunov(vec3 coord) {
      float x = 0.5;
      float sum = 0.0;
      for (int i = 0; i < NMAX; i++) {
        int pos = int(mod(float(i), 6.0));
        float r = 0.0;
        if (pos == 0 || pos == 1) {
          r = coord.x;
        } else if (pos == 2 || pos == 3) {
          r = coord.y;
        } else {
          r = coord.z;
        }
        x = r * x * (1.0 - x);
        sum += log(abs(r - 2.0 * r * x));
      }
      return sum / float(NMAX);
    }

    vec3 palette(float t) {
      float r = smoothstep(0.0, 0.5, t);
      float g = smoothstep(0.25, 0.75, t);
      float b = smoothstep(0.5, 1.0, t);
      //float intensity = mix(0.0, 1.0, t);
      float intensity = 0.5;
      return vec3(r * intensity, g * intensity, b * intensity);
    }

      void main() {
        vec3 coord = (vObjectPos + vec3(uDisplaceX, uDisplaceY,uDisplaceZ)) * uZoom;

        float val = smoothstep(-1.0, 1.0,lyapunov(coord));
        vec3 baseColor = palette(val);

        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        gl_FragColor = vec4(baseColor, 1.0);
      }
    `,
    transparent: true,
    depthWrite: false
  }), [])

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

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
      <primitive object={shaderMaterial} ref={shaderRef} />
    </points>
  )
}
