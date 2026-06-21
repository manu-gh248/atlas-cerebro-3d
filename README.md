# 🧠 Atlas del Cerebro 3D

Aplicación web interactiva para estudiar las principales regiones del cerebro,
pensada para estudiantes de psicología.

- **Rota, gira y haz zoom** sobre un cerebro en 3D.
- **Señala con el ratón** cualquier parte y descubre **qué región es** y para
  qué sirve.
- A la inversa: usa la **lista de etiquetas** y, al pinchar una, la región se
  **ilumina y se enfoca** en el modelo 3D.
- **Buscador** de regiones y posibilidad de **ocultar la corteza** para estudiar
  las estructuras profundas (tálamo, hipocampo, amígdala, ganglios basales…).

Incluye ~17 estructuras: lóbulos (frontal, parietal, temporal, occipital,
ínsula), cerebelo, tronco encefálico (mesencéfalo, protuberancia, bulbo) y
subcorticales clave (tálamo, hipotálamo, hipocampo, amígdala, núcleo caudado,
putamen, globo pálido, cuerpo calloso), cada una con una descripción de su
función.

## Arrancar

```bash
npm install
npm run dev
```

Abre la URL que indique Vite (por defecto <http://localhost:5173>).

Para compilar una versión de producción:

```bash
npm run build
npm run preview
```

## Tecnología

- **React + TypeScript + Vite**
- **React Three Fiber** y **drei** (render 3D y controles de órbita)
- **zustand** (estado y sincronización del resaltado bidireccional)

## Modelo 3D y fidelidad

Por defecto se usa un **modelo esquemático**: cada estructura está colocada según
su posición neuroanatómica real, pero su forma es una aproximación (no una
superficie médica milimétrica). Es ideal para aprender la **ubicación y la
relación** entre regiones.

Para una **superficie anatómica exacta**, la app puede cargar la malla de
**Z-Anatomy** (CC-BY-SA 4.0). Consulta **[MODELO.md](./MODELO.md)** para el
procedimiento (un único paso de exportación en Blender). El motor de interacción
es el mismo para ambos modelos: basta con colocar `public/models/cerebro.glb`.

## Estructura

```
src/
  data/regiones.ts        Fuente única de las regiones (nombre, función, color, geometría)
  data/mapeoZAnatomy.ts   Mapeo nombre de malla Z-Anatomy → región
  store/useStore.ts       Estado (hover/selección/visibilidad)
  components/
    Escena.tsx            Canvas, luces, OrbitControls, enfoque de cámara
    CerebroProcedural.tsx Modelo esquemático (por defecto)
    CerebroGLTF.tsx       Carga la malla Z-Anatomy si existe el GLB
    Region.tsx            Malla de región + interacción y resaltado
    PanelEtiquetas.tsx    Lista agrupada + buscador
    PanelInfo.tsx         Ficha de la región seleccionada
    Tooltip.tsx           Etiqueta flotante al pasar el ratón
    AcercaDe.tsx          Créditos, licencia y nota de fidelidad
scripts/
  exportarCerebroZAnatomy.py   Exportador Blender (Z-Anatomy → GLB)
```

## Créditos y licencia

- Modelo anatómico de alta fidelidad: **Z-Anatomy**, CC-BY-SA 4.0.
- El modelo esquemático incluido es original de este proyecto.

Esta aplicación es una ayuda de estudio y no sustituye material clínico o
docente oficial.
