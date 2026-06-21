import { lazy, Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import { CerebroProcedural } from './CerebroProcedural'

// El módulo GLTF se carga solo si hay modelo, para no incluirlo en el bundle si no se usa.
const CerebroGLTFLazy = lazy(() =>
  import('./CerebroGLTF').then((m) => ({ default: m.CerebroGLTF })),
)

interface Props {
  usarGLTF: boolean
}

/** Anima el target de OrbitControls y la cámara para enfocar la región seleccionada. */
function ControladorCamara() {
  const focusReq = useStore((s) => s.focusReq)
  const { scene, camera, controls } = useThree() as any
  const destinoTarget = useRef(new THREE.Vector3())
  const destinoCamara = useRef(new THREE.Vector3())
  const animando = useRef(false)

  useEffect(() => {
    if (!focusReq) return
    // Centro combinado de todas las mallas de la región (sirve para procedural y GLTF).
    const box = new THREE.Box3()
    let encontrado = false
    scene.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh && obj.userData.regionId === focusReq.id && obj.visible) {
        box.expandByObject(obj)
        encontrado = true
      }
    })
    if (!encontrado) return
    const centro = new THREE.Vector3()
    const tam = new THREE.Vector3()
    box.getCenter(centro)
    box.getSize(tam)

    destinoTarget.current.copy(centro)
    // Mantener la dirección de visión actual, situando la cámara a una distancia cómoda.
    const dir = new THREE.Vector3().subVectors(camera.position, controls?.target ?? centro).normalize()
    const dist = Math.max(tam.length() * 2.2, 9)
    destinoCamara.current.copy(centro).addScaledVector(dir, dist)
    animando.current = true
  }, [focusReq, scene, camera, controls])

  useFrame((_, dt) => {
    if (!animando.current || !controls) return
    const k = 1 - Math.pow(0.001, dt) // suavizado independiente de FPS
    controls.target.lerp(destinoTarget.current, k)
    camera.position.lerp(destinoCamara.current, k)
    controls.update()
    if (
      camera.position.distanceTo(destinoCamara.current) < 0.05 &&
      controls.target.distanceTo(destinoTarget.current) < 0.05
    ) {
      animando.current = false
    }
  })

  return null
}

function Cerebro({ usarGLTF }: Props) {
  if (!usarGLTF) return <CerebroProcedural />
  return <CerebroGLTFLazy />
}

export function Escena({ usarGLTF }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 3, 28], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <color attach="background" args={['#0d1117']} />

      {/* Iluminación de estudio: clave cálida, relleno hemisférico, contraluz frío y relleno inferior. */}
      <hemisphereLight args={['#fff3ee', '#161922', 0.55]} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[9, 13, 9]} intensity={1.35} color="#fff4ec" />
      <directionalLight position={[-11, 3, -7]} intensity={0.55} color="#9fb4ff" />
      <directionalLight position={[0, -7, 5]} intensity={0.25} />

      <Suspense fallback={null}>
        <Cerebro usarGLTF={usarGLTF} />
        <ContactShadows position={[0, -7.6, 0]} opacity={0.45} scale={42} blur={2.6} far={22} color="#000000" />
      </Suspense>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={60}
        enablePan
      />
      <ControladorCamara />
    </Canvas>
  )
}
