import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { idDesdeNombreMalla } from '../data/mapeoZAnatomy'
import { REGIONES_POR_ID } from '../data/regiones'
import { useStore } from '../store/useStore'

const RUTA_MODELO = `${import.meta.env.BASE_URL}models/cerebro.glb`

interface MallaMapeada {
  mesh: THREE.Mesh
  regionId: string
  esCorteza: boolean
}

/**
 * Carga la malla anatómica real (Z-Anatomy, CC-BY-SA 4.0) desde public/models/cerebro.glb.
 * Recorre las mallas, las asocia a nuestras regiones por nombre (data/mapeoZAnatomy.ts)
 * y reutiliza el mismo estado de interacción que el modelo procedural.
 */
export function CerebroGLTF() {
  const { scene } = useGLTF(RUTA_MODELO)
  const setHovered = useStore((s) => s.setHovered)
  const select = useStore((s) => s.select)

  const { raiz, mallas } = useMemo(() => {
    const raiz = scene.clone(true)
    const mallas: MallaMapeada[] = []
    const sinMapear: string[] = []

    raiz.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      const regionId = idDesdeNombreMalla(obj.name)
      if (!regionId || !REGIONES_POR_ID[regionId]) {
        sinMapear.push(obj.name)
        obj.visible = false
        return
      }
      const region = REGIONES_POR_ID[regionId]
      obj.userData.regionId = regionId
      obj.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(region.color),
        emissive: new THREE.Color(region.color),
        emissiveIntensity: 0,
        roughness: 0.55,
        metalness: 0.05,
        transparent: true,
        opacity: 1,
      })
      mallas.push({ mesh: obj, regionId, esCorteza: region.grupo === 'lobulo' })
    })

    if (sinMapear.length) {
      // Útil al integrar el GLB real: revisa estos nombres y amplía mapeoZAnatomy.ts.
      console.warn('[CerebroGLTF] Mallas sin mapear (ocultas):', sinMapear)
    }

    // Centrar y escalar el modelo a un tamaño comparable al procedural (~16 cm).
    const box = new THREE.Box3().setFromObject(raiz)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    raiz.position.sub(center)
    const escala = 16 / Math.max(size.x, size.y, size.z)
    raiz.scale.setScalar(escala)

    return { raiz, mallas }
  }, [scene])

  const cortezaVisible = useStore((s) => s.cortezaVisible)
  const cortezaTransparente = useStore((s) => s.cortezaTransparente)

  useEffect(() => {
    for (const { mesh, esCorteza } of mallas) {
      if (!esCorteza) continue
      mesh.visible = cortezaVisible
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.opacity = cortezaTransparente ? 0.32 : 1
      mat.depthWrite = !cortezaTransparente
    }
  }, [mallas, cortezaVisible, cortezaTransparente])

  useFrame((_, dt) => {
    const { hoveredId, selectedId } = useStore.getState()
    for (const { mesh, regionId, esCorteza } of mallas) {
      const mat = mesh.material as THREE.MeshStandardMaterial
      const objetivo = selectedId === regionId ? 0.9 : hoveredId === regionId ? 0.55 : 0
      mat.emissiveIntensity = THREE.MathUtils.damp(mat.emissiveIntensity, objetivo, 8, dt)
      if (esCorteza && cortezaTransparente) {
        const op = hoveredId === regionId || selectedId === regionId ? 0.85 : 0.32
        mat.opacity = THREE.MathUtils.damp(mat.opacity, op, 8, dt)
      }
    }
  })

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const id = e.object.userData.regionId as string | undefined
    setHovered(id ?? null)
    document.body.style.cursor = id ? 'pointer' : 'auto'
  }
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(null)
    document.body.style.cursor = 'auto'
  }
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const id = e.object.userData.regionId as string | undefined
    if (id) select(id)
  }

  return <primitive object={raiz} onPointerMove={onMove} onPointerOut={onOut} onClick={onClick} />
}
