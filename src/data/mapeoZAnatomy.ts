// Mapeo entre los nombres de malla del modelo Z-Anatomy (Terminologia Anatomica,
// en latín) y los `id` de nuestras regiones (ver data/regiones.ts).
//
// Z-Anatomy nombra las mallas con términos como "Frontal_lobe", "Thalamus",
// "Hippocampus", a menudo con sufijos de lateralidad ("_l", "_r", ".L", ".R")
// o numéricos tras duplicar/instanciar. La función `idDesdeNombreMalla`
// normaliza el nombre y busca la primera clave que encaje.
//
// Cuando integres el GLB real (ver MODELO.md), revisa por consola los nombres
// de malla que imprime CerebroGLTF y completa/ajusta este diccionario.

const MAPA: Record<string, string> = {
  // Lóbulos
  frontal_lobe: 'lobulo_frontal',
  lobus_frontalis: 'lobulo_frontal',
  parietal_lobe: 'lobulo_parietal',
  lobus_parietalis: 'lobulo_parietal',
  temporal_lobe: 'lobulo_temporal',
  lobus_temporalis: 'lobulo_temporal',
  occipital_lobe: 'lobulo_occipital',
  lobus_occipitalis: 'lobulo_occipital',
  insula: 'insula',
  insular_lobe: 'insula',

  // Subcorticales
  thalamus: 'talamo',
  hypothalamus: 'hipotalamo',
  hippocampus: 'hipocampo',
  amygdala: 'amigdala',
  amygdaloid_body: 'amigdala',
  caudate_nucleus: 'nucleo_caudado',
  nucleus_caudatus: 'nucleo_caudado',
  putamen: 'putamen',
  globus_pallidus: 'globo_palido',
  pallidum: 'globo_palido',
  corpus_callosum: 'cuerpo_calloso',

  // Tronco
  midbrain: 'mesencefalo',
  mesencephalon: 'mesencefalo',
  pons: 'protuberancia',
  medulla_oblongata: 'bulbo_raquideo',
  myelencephalon: 'bulbo_raquideo',

  // Cerebelo
  cerebellum: 'cerebelo',
}

/** Normaliza un nombre de malla: minúsculas, sin acentos, separadores a "_". */
function normalizar(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s.\-]+/g, '_')
    // quita sufijos de lateralidad e índices: _l, _r, _left, _right, _001...
    .replace(/_(l|r|left|right|lh|rh|\d+)$/g, '')
    .replace(/^_+|_+$/g, '')
}

/** Devuelve el id de región para un nombre de malla de Z-Anatomy, o null. */
export function idDesdeNombreMalla(nombre: string): string | null {
  const n = normalizar(nombre)
  if (MAPA[n]) return MAPA[n]
  // coincidencia parcial: alguna clave contenida en el nombre
  for (const clave of Object.keys(MAPA)) {
    if (n.includes(clave)) return MAPA[clave]
  }
  return null
}
