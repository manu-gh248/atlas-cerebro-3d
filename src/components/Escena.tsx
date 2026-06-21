import { lazy, Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
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
    <Canvas camera={{ position: [0, 3, 28], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#0d1117']} />
      <hemisphereLight args={['#ffffff', '#202830', 0.8]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[10, 12, 8]} intensity={1.1} castShadow={false} />
      <directionalLight position={[-8, -4, -10]} intensity={0.4} />

      <Suspense fallback={null}>
        <Cerebro usarGLTF={usarGLTF} />
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
