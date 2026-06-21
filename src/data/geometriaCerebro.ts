import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createNoise3D } from 'simplex-noise'

// PRNG determinista (mulberry32) para que las circunvoluciones sean siempre iguales.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const noise3D = createNoise3D(mulberry32(20260621))

/** Ruido fractal (varias octavas) en [-1, 1] aprox. */
function fbm(x: number, y: number, z: number, octavas = 4, lacunaridad = 2.1, ganancia = 0.5) {
  let amp = 1
  let freq = 1
  let suma = 0
  let norm = 0
  for (let i = 0; i < octavas; i++) {
    suma += amp * noise3D(x * freq, y * freq, z * freq)
    norm += amp
    amp *= ganancia
    freq *= lacunaridad
  }
  return suma / norm
}

export type Convolucion = 'corteza' | 'cerebelo' | 'liso'

interface Opciones {
  escala: [number, number, number]
  convolucion: Convolucion
  /** Aplana la cara medial (hacia la línea media) para formar la cisura. lado: +1 derecha, -1 izquierda. */
  ladoMedial?: 1 | -1
}

/**
 * Construye la geometría de una región. Para la corteza y el cerebelo desplaza
 * los vértices de una icosfera (reparto uniforme) creando surcos y giros; las
 * estructuras lisas devuelven un elipsoide suave.
 */
export function crearGeometriaRegion({ escala, convolucion, ladoMedial }: Opciones): THREE.BufferGeometry {
  const detalle = convolucion === 'liso' ? 4 : convolucion === 'cerebelo' ? 5 : 6
  // IcosahedronGeometry es NO indexada → normales planas. La indexamos (mergeVertices)
  // para que, tras desplazar y recalcular normales, el sombreado sea suave (giros lisos).
  const geo = mergeVertices(new THREE.IcosahedronGeometry(1, detalle))
  const pos = geo.attributes.position as THREE.BufferAttribute
  const v = new THREE.Vector3()

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i) // dirección unitaria sobre la esfera
    let r = 1

    if (convolucion === 'corteza') {
      // Giros y surcos: muchos pliegues finos (frecuencia media-alta, varias octavas).
      const f = 4.2
      const pliegues = fbm(v.x * f, v.y * f, v.z * f, 5)
      const detalleFino = fbm(v.x * f * 2.3, v.y * f * 2.3, v.z * f * 2.3, 2) * 0.3
      r = 1 + (pliegues + detalleFino) * 0.1
    } else if (convolucion === 'cerebelo') {
      // Folia: surcos finos y casi horizontales (alta frecuencia en Y).
      const base = fbm(v.x * 2.0, v.y * 2.0, v.z * 2.0, 3) * 0.04
      const folia = Math.sin(v.y * 26 + fbm(v.x * 3, v.y * 3, v.z * 3, 2) * 3)
      r = 1 + base + folia * 0.05
    }

    v.multiplyScalar(r)
    // Cisura longitudinal: aplanar la cara medial (la que mira a la línea media).
    if (ladoMedial && Math.sign(v.x) === ladoMedial) {
      v.x *= 0.78
    }
    pos.setXYZ(i, v.x, v.y, v.z)
  }

  geo.scale(escala[0], escala[1], escala[2])
  geo.computeVertexNormals()
  return geo
}
