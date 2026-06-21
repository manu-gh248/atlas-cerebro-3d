import { useMemo, useRef } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import { Region } from '../data/regiones'

/** Eventos de puntero comunes a cualquier malla asociada a una región. */
export function useEventosRegion(id: string) {
  const setHovered = useStore((s) => s.setHovered)
  const select = useStore((s) => s.select)
  return useMemo(
    () => ({
      onPointerOver: (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setHovered(id)
        document.body.style.cursor = 'pointer'
      },
      onPointerOut: (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setHovered(null)
        document.body.style.cursor = 'auto'
      },
      onClick: (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        select(id)
      },
    }),
    [id, setHovered, select],
  )
}

interface Props {
  region: Region
  geometry: THREE.BufferGeometry
  position: [number, number, number]
  rotation?: [number, number, number]
  /** Es corteza (lóbulo): se ve afectada por los toggles de visibilidad/transparencia. */
  esCorteza: boolean
}

/** Una malla concreta de una región, con resaltado reactivo al hover/selección. */
export function MallaRegion({ region, geometry, position, rotation, esCorteza }: Props) {
  const eventos = useEventosRegion(region.id)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  const hovered = useStore((s) => s.hoveredId === region.id)
  const selected = useStore((s) => s.selectedId === region.id)
  const cortezaTransparente = useStore((s) => s.cortezaTransparente)

  const color = useMemo(() => new THREE.Color(region.color), [region.color])

  // Opacidad base: la corteza puede ser semitransparente para ver el interior.
  const opacidadBase = esCorteza && cortezaTransparente ? 0.32 : 1

  // Animación suave de resaltado (emisivo + leve escala al seleccionar).
  useFrame((_, dt) => {
    const m = matRef.current
    if (m) {
      const objetivoEmisivo = selected ? 0.9 : hovered ? 0.55 : 0
      m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, objetivoEmisivo, 8, dt)
      const objetivoOpacidad = hovered || selected ? Math.max(opacidadBase, 0.85) : opacidadBase
      m.opacity = THREE.MathUtils.damp(m.opacity, objetivoOpacidad, 8, dt)
    }
    const mesh = meshRef.current
    if (mesh) {
      const objetivoEscala = selected ? 1.06 : 1
      const s = THREE.MathUtils.damp(mesh.scale.x, objetivoEscala, 10, dt)
      mesh.scale.setScalar(s)
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position}
      rotation={rotation}
      userData={{ regionId: region.id }}
      {...eventos}
    >
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={color}
        emissiveIntensity={0}
        roughness={0.55}
        metalness={0.05}
        transparent
        opacity={opacidadBase}
        depthWrite={!(esCorteza && cortezaTransparente)}
      />
    </mesh>
  )
}
