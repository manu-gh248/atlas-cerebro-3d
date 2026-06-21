import { useMemo } from 'react'
import * as THREE from 'three'
import { REGIONES, Region } from '../data/regiones'
import { useStore } from '../store/useStore'
import { MallaRegion } from './Region'

/** Geometría base: esfera unidad reutilizada, escalada por región (elipsoide). */
function useGeometria(escala: [number, number, number]) {
  return useMemo(() => {
    const g = new THREE.SphereGeometry(1, 48, 32)
    g.scale(escala[0], escala[1], escala[2])
    g.computeVertexNormals()
    return g
  }, [escala[0], escala[1], escala[2]])
}

function RegionInstancias({ region }: { region: Region }) {
  const { pos, escala, rot, lateralidad } = region.procedural
  const geometry = useGeometria(escala)
  const esCorteza = region.grupo === 'lobulo'

  if (lateralidad === 'central') {
    return <MallaRegion region={region} geometry={geometry} position={pos} rotation={rot} esCorteza={esCorteza} />
  }

  // 'par': dos mallas reflejadas (hemisferio derecho +x, izquierdo -x).
  const der: [number, number, number] = [pos[0], pos[1], pos[2]]
  const izq: [number, number, number] = [-pos[0], pos[1], pos[2]]
  const rotIzq: [number, number, number] | undefined = rot ? [rot[0], -rot[1], -rot[2]] : undefined
  return (
    <>
      <MallaRegion region={region} geometry={geometry} position={der} rotation={rot} esCorteza={esCorteza} />
      <MallaRegion region={region} geometry={geometry} position={izq} rotation={rotIzq} esCorteza={esCorteza} />
    </>
  )
}

/**
 * Modelo procedural del cerebro: cada región es una malla (o par de mallas)
 * colocada según su posición neuroanatómica aproximada. Es un modelo
 * esquemático fiel a la disposición de las estructuras, no una superficie
 * médica milimétrica (para eso, ver MODELO.md y CerebroGLTF).
 */
export function CerebroProcedural() {
  const cortezaVisible = useStore((s) => s.cortezaVisible)

  return (
    <group>
      {REGIONES.map((region) => {
        if (region.grupo === 'lobulo' && !cortezaVisible) return null
        return <RegionInstancias key={region.id} region={region} />
      })}
    </group>
  )
}
