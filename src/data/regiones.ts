// Fuente única de verdad de las regiones del cerebro.
// El campo `id` debe coincidir con el nombre de la malla (modelo procedural)
// y con el mapeo de Z-Anatomy (ver data/mapeoZAnatomy.ts).
//
// Sistema de coordenadas (en cm aprox., cerebro centrado en el origen):
//   x = eje lateral   (+ derecha del paciente, - izquierda)
//   y = eje vertical   (+ superior / arriba, - inferior / abajo)
//   z = eje antero-posterior (+ anterior / frente, - posterior / nuca)

export type Grupo = 'lobulo' | 'subcortical' | 'tronco' | 'cerebelo'

export type Forma = 'elipsoide' | 'capsula' | 'caja'

export interface Procedural {
  forma: Forma
  /** Posición. En 'par' la x es la magnitud del desplazamiento lateral (se refleja). */
  pos: [number, number, number]
  escala: [number, number, number]
  /** Rotación en radianes (opcional). */
  rot?: [number, number, number]
  /** 'central' = una sola malla en la línea media; 'par' = dos mallas reflejadas (izq/der). */
  lateralidad: 'central' | 'par'
}

export interface Region {
  id: string
  nombre: string
  nombreCientifico: string
  grupo: Grupo
  funcion: string
  color: string
  procedural: Procedural
}

export const GRUPOS: Record<Grupo, string> = {
  lobulo: 'Lóbulos cerebrales',
  subcortical: 'Estructuras subcorticales',
  tronco: 'Tronco encefálico',
  cerebelo: 'Cerebelo',
}

export const REGIONES: Region[] = [
  // ---------------------------------------------------------------- LÓBULOS
  {
    id: 'lobulo_frontal',
    nombre: 'Lóbulo frontal',
    nombreCientifico: 'Lobus frontalis',
    grupo: 'lobulo',
    funcion:
      'Sede de las funciones ejecutivas: planificación, toma de decisiones, control de impulsos, memoria de trabajo y personalidad. Contiene la corteza prefrontal y el área de Broca (producción del lenguaje), además de la corteza motora primaria.',
    color: '#4f8ff7',
    procedural: { forma: 'elipsoide', pos: [3, 1.6, 3.6], escala: [3.0, 3.4, 3.6], lateralidad: 'par' },
  },
  {
    id: 'lobulo_parietal',
    nombre: 'Lóbulo parietal',
    nombreCientifico: 'Lobus parietalis',
    grupo: 'lobulo',
    funcion:
      'Integra la información sensorial del cuerpo (tacto, temperatura, dolor, propiocepción) en la corteza somatosensorial. Procesa la orientación espacial, la atención y la coordinación viso-motora.',
    color: '#37c2a8',
    procedural: { forma: 'elipsoide', pos: [3, 3.2, -1.4], escala: [3.0, 3.0, 3.2], lateralidad: 'par' },
  },
  {
    id: 'lobulo_temporal',
    nombre: 'Lóbulo temporal',
    nombreCientifico: 'Lobus temporalis',
    grupo: 'lobulo',
    funcion:
      'Procesa la audición y el reconocimiento de sonidos y caras. Aloja el área de Wernicke (comprensión del lenguaje) y, en su cara medial, el hipocampo y la amígdala, claves en memoria y emoción.',
    color: '#f5a742',
    procedural: { forma: 'elipsoide', pos: [4.2, -1.6, 1.2], escala: [2.4, 2.0, 3.6], lateralidad: 'par' },
  },
  {
    id: 'lobulo_occipital',
    nombre: 'Lóbulo occipital',
    nombreCientifico: 'Lobus occipitalis',
    grupo: 'lobulo',
    funcion:
      'Centro principal del procesamiento visual. La corteza visual primaria (V1) interpreta forma, color, movimiento y profundidad de los estímulos que llegan desde los ojos.',
    color: '#c97bdb',
    procedural: { forma: 'elipsoide', pos: [2.4, 1.6, -4.8], escala: [2.6, 2.8, 2.6], lateralidad: 'par' },
  },
  {
    id: 'insula',
    nombre: 'Ínsula',
    nombreCientifico: 'Insula / Lobus insularis',
    grupo: 'lobulo',
    funcion:
      'Lóbulo oculto en la profundidad del surco lateral. Procesa la interocepción (conciencia del estado corporal), el gusto, la empatía, el asco y la regulación emocional.',
    color: '#e0607a',
    procedural: { forma: 'elipsoide', pos: [3.6, 0.2, 0.8], escala: [0.7, 1.6, 1.8], lateralidad: 'par' },
  },

  // -------------------------------------------------------- SUBCORTICALES
  {
    id: 'talamo',
    nombre: 'Tálamo',
    nombreCientifico: 'Thalamus',
    grupo: 'subcortical',
    funcion:
      'Gran estación de relevo: filtra y redirige hacia la corteza casi toda la información sensorial (excepto el olfato) y motora. Participa en la regulación de la conciencia, el sueño y el estado de alerta.',
    color: '#f7d04f',
    procedural: { forma: 'elipsoide', pos: [1.0, 0.6, 0.2], escala: [1.0, 1.1, 1.6], lateralidad: 'par' },
  },
  {
    id: 'hipotalamo',
    nombre: 'Hipotálamo',
    nombreCientifico: 'Hypothalamus',
    grupo: 'subcortical',
    funcion:
      'Regula la homeostasis: hambre, sed, temperatura, sueño y ritmos circadianos. Controla el sistema endocrino a través de la hipófisis y modula respuestas emocionales y sexuales.',
    color: '#f78f4f',
    procedural: { forma: 'elipsoide', pos: [0, -1.0, 0.9], escala: [1.0, 0.7, 1.0], lateralidad: 'central' },
  },
  {
    id: 'hipocampo',
    nombre: 'Hipocampo',
    nombreCientifico: 'Hippocampus',
    grupo: 'subcortical',
    funcion:
      'Esencial para formar nuevos recuerdos (memoria declarativa) y consolidarlos a largo plazo. Interviene en la navegación espacial. Es de las primeras estructuras dañadas en el alzhéimer.',
    color: '#5fd16a',
    procedural: { forma: 'capsula', pos: [2.6, -1.4, -1.2], escala: [0.6, 0.6, 2.4], rot: [0.4, 0, 0], lateralidad: 'par' },
  },
  {
    id: 'amigdala',
    nombre: 'Amígdala',
    nombreCientifico: 'Corpus amygdaloideum',
    grupo: 'subcortical',
    funcion:
      'Núcleo central del procesamiento emocional, sobre todo del miedo y la respuesta de lucha o huida. Asigna valor emocional a los estímulos y modula la memoria emocional junto al hipocampo.',
    color: '#e05151',
    procedural: { forma: 'elipsoide', pos: [2.8, -1.2, 0.6], escala: [0.7, 0.7, 0.8], lateralidad: 'par' },
  },
  {
    id: 'nucleo_caudado',
    nombre: 'Núcleo caudado',
    nombreCientifico: 'Nucleus caudatus',
    grupo: 'subcortical',
    funcion:
      'Parte de los ganglios basales. Interviene en el aprendizaje, la memoria de procedimientos, el control del movimiento voluntario y los circuitos de motivación y recompensa.',
    color: '#8f9bf0',
    procedural: { forma: 'capsula', pos: [1.4, 1.2, 0.6], escala: [0.6, 0.6, 2.2], rot: [0.3, 0, 0], lateralidad: 'par' },
  },
  {
    id: 'putamen',
    nombre: 'Putamen',
    nombreCientifico: 'Putamen',
    grupo: 'subcortical',
    funcion:
      'Ganglio basal implicado en la regulación de los movimientos y en el aprendizaje de hábitos y secuencias motoras automáticas. Forma, con el globo pálido, el núcleo lentiforme.',
    color: '#6fb0e0',
    procedural: { forma: 'elipsoide', pos: [2.4, 0.4, 0.4], escala: [0.7, 1.2, 1.4], lateralidad: 'par' },
  },
  {
    id: 'globo_palido',
    nombre: 'Globo pálido',
    nombreCientifico: 'Globus pallidus',
    grupo: 'subcortical',
    funcion:
      'Ganglio basal que regula los movimientos voluntarios a un nivel inconsciente, frenando y ajustando la actividad motora. Su disfunción se asocia a trastornos del movimiento como el párkinson.',
    color: '#b0b8c4',
    procedural: { forma: 'elipsoide', pos: [1.8, 0.3, 0.4], escala: [0.5, 1.0, 1.1], lateralidad: 'par' },
  },
  {
    id: 'cuerpo_calloso',
    nombre: 'Cuerpo calloso',
    nombreCientifico: 'Corpus callosum',
    grupo: 'subcortical',
    funcion:
      'El mayor haz de fibras del cerebro: conecta ambos hemisferios y permite que intercambien información, coordinando el procesamiento entre el lado izquierdo y el derecho.',
    color: '#dcd6c8',
    procedural: { forma: 'elipsoide', pos: [0, 1.3, 0], escala: [0.6, 0.9, 4.0], lateralidad: 'central' },
  },

  // ------------------------------------------------------------- TRONCO
  {
    id: 'mesencefalo',
    nombre: 'Mesencéfalo',
    nombreCientifico: 'Mesencephalon',
    grupo: 'tronco',
    funcion:
      'Parte superior del tronco encefálico. Coordina reflejos visuales y auditivos, controla el movimiento ocular y contiene la sustancia negra, clave en el control motor y la dopamina.',
    color: '#c0a060',
    procedural: { forma: 'elipsoide', pos: [0, -2.2, -0.4], escala: [1.0, 1.0, 1.1], lateralidad: 'central' },
  },
  {
    id: 'protuberancia',
    nombre: 'Protuberancia (puente)',
    nombreCientifico: 'Pons',
    grupo: 'tronco',
    funcion:
      'Puente que conecta el cerebro con el cerebelo y la médula. Regula la respiración, el sueño, la deglución y transmite señales entre la corteza y el cerebelo.',
    color: '#caa86a',
    procedural: { forma: 'elipsoide', pos: [0, -3.4, -0.5], escala: [1.1, 1.0, 1.2], lateralidad: 'central' },
  },
  {
    id: 'bulbo_raquideo',
    nombre: 'Bulbo raquídeo',
    nombreCientifico: 'Medulla oblongata',
    grupo: 'tronco',
    funcion:
      'Une el encéfalo con la médula espinal. Controla funciones vitales involuntarias: ritmo cardíaco, presión arterial, respiración, tos, estornudo, vómito y deglución.',
    color: '#d4b878',
    procedural: { forma: 'capsula', pos: [0, -4.7, -0.7], escala: [0.7, 0.7, 1.6], rot: [0.3, 0, 0], lateralidad: 'central' },
  },

  // ----------------------------------------------------------- CEREBELO
  {
    id: 'cerebelo',
    nombre: 'Cerebelo',
    nombreCientifico: 'Cerebellum',
    grupo: 'cerebelo',
    funcion:
      'Coordina el movimiento, el equilibrio, la postura y el tono muscular, afinando la precisión y el tiempo de las acciones. También participa en el aprendizaje motor y en funciones cognitivas y atencionales.',
    color: '#9ad17a',
    procedural: { forma: 'elipsoide', pos: [0, -2.8, -4.6], escala: [3.4, 2.0, 2.4], lateralidad: 'central' },
  },
]

export const REGIONES_POR_ID: Record<string, Region> = Object.fromEntries(
  REGIONES.map((r) => [r.id, r]),
)
