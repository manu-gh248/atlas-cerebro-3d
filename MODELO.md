# Integrar la malla anatómica real (Z-Anatomy)

Por defecto la app usa un **modelo esquemático** (regiones colocadas en su
posición neuroanatómica real, pero con forma aproximada). Para tener la
**superficie anatómica exacta** —con las cisuras y circunvoluciones reales—
puedes incorporar la malla de **Z-Anatomy**.

> **Z-Anatomy** es *el atlas libre de anatomía 3D*, publicado bajo licencia
> **CC-BY-SA 4.0**. Cualquier distribución de esa malla (o derivados) debe
> mantener la **atribución** a Z-Anatomy y la **misma licencia**.
> Repositorios: <https://github.com/Z-Anatomy>

## Pasos

1. **Descarga el atlas** desde el repositorio de Z-Anatomy (el archivo `.blend`,
   p. ej. dentro de `Z-Anatomy.zip` en `Z-Anatomy/Models-of-human-anatomy`).

2. **Instala [Blender](https://www.blender.org/)** (3.x o 4.x).

3. **Exporta solo el encéfalo a GLB** con el script incluido (modo headless):

   ```bash
   blender --background /ruta/al/Z-Anatomy.blend \
       --python scripts/exportarCerebroZAnatomy.py -- public/models/cerebro.glb
   ```

   El script conserva las mallas del encéfalo (cerebro, cerebelo, tronco y
   estructuras subcorticales) y escribe `public/models/cerebro.glb` con cada
   estructura como una malla con nombre.

4. **Arranca la app** (`npm run dev`). Detecta automáticamente el GLB y cambia
   al modelo anatómico real (verás la insignia *“Malla anatómica Z-Anatomy”*).

## Ajustar el mapeo de nombres

La app asocia cada malla del GLB a una de nuestras regiones por su nombre
(`src/data/mapeoZAnatomy.ts`). Z-Anatomy usa nomenclatura latina (Terminologia
Anatomica), a veces con sufijos de lado (`_l`, `_r`) o índices.

Al cargar el GLB, abre la **consola del navegador**: `CerebroGLTF` imprime un
aviso con las **mallas sin mapear** (que quedan ocultas). Copia esos nombres y
añádelos al diccionario `MAPA` de `mapeoZAnatomy.ts` apuntando al `id` de región
correspondiente (los `id` están en `src/data/regiones.ts`).

## Volver al modelo esquemático

Elimina (o renombra) `public/models/cerebro.glb` y recarga. La app vuelve al
modelo procedural automáticamente.
