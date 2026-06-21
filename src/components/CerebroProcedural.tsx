import { useMemo } from 'react'
import { REGIONES, Region } from '../data/regiones'
import { crearGeometriaRegion, Convolucion } from '../data/geometriaCerebro'
import { useStore } from '../store/useStore'
import { MallaRegion } from './Region'

function convolucionDe(region: Region): Convolucion {
  if (region.grupo === 'lobulo') return 'corteza'
  if (region.grupo === 'cerebelo') return 'cerebelo'
  return 'liso'
}

function RegionInstancias({ region }: { region: Region }) {
  const { pos, escala, rot, lateralidad } = region.procedural
  const convolucion = convolucionDe(region)
  const esCorteza = region.grupo === 'lobulo'

  // Geometría central (estructuras únicas) y, para regiones pareadas, una por
  // hemisferio con la cara medial aplanada hacia la línea media (cisura longitudinal).
  const geoCentral = useMemo(
    () => crearGeometriaRegion({ escala, convolucion }),
    [escala[0], escala[1], escala[2], convolucion],
  )
  const geoDer = useMemo(
    () => (lateralidad === 'par' ? crearGeometriaRegion({ escala, convolucion, ladoMedial: -1 }) : null),
    [escala[0], escala[1], escala[2], convolucion, lateralidad],
  )
  const geoIzq = useMemo(
    () => (lateralidad === 'par' ? crearGeometriaRegion({ escala, convolucion, ladoMedial: 1 }) : null),
    [escala[0], escala[1], escala[2], convolucion, lateralidad],
  )

  if (lateralidad === 'central') {
    return <MallaRegion region={region} geometry={geoCentral} position={pos} rotation={rot} esCorteza={esCorteza} />
  }

  const der: [number, number, number] = [pos[0], pos[1], pos[2]]
  const izq: [number, number, number] = [-pos[0], pos[1], pos[2]]
  const rotIzq: [number, number, number] | undefined = rot ? [rot[0], -rot[1], -rot[2]] : undefined
  return (
    <>
      <MallaRegion region={region} geometry={geoDer!} position={der} rotation={rot} esCorteza={esCorteza} />
      <MallaRegion region={region} geometry={geoIzq!} position={izq} rotation={rotIzq} esCorteza={esCorteza} />
    </>
  )
}

/**
 * Modelo procedural del cerebro: cada región es una malla (o par de mallas)
 * colocada según su posición neuroanatómica aproximada. La corteza y el cerebelo
 * llevan circunvoluciones (surcos y giros) generadas con ruido para un aspecto
 * realista; las estructuras profundas son lisas. No es una superficie médica
 * milimétrica (para eso, ver MODELO.md y CerebroGLTF).
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
