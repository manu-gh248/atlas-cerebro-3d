"""
Exporta el encéfalo de Z-Anatomy a public/models/cerebro.glb.

Z-Anatomy (https://github.com/Z-Anatomy) es un atlas libre de anatomía 3D para
Blender, licencia CC-BY-SA 4.0. Este script, ejecutado en modo headless, abre el
.blend del atlas, conserva solo las mallas del encéfalo (cerebro, cerebelo,
tronco y estructuras subcorticales que usamos) y exporta un GLB con cada
estructura como malla con nombre, listo para la app.

USO (necesitas Blender 3.x/4.x instalado):

    blender --background ruta/al/Z-Anatomy.blend \
        --python scripts/exportarCerebroZAnatomy.py -- public/models/cerebro.glb

El argumento tras "--" es la ruta de salida del GLB (opcional;
por defecto public/models/cerebro.glb).

Tras exportar, abre la app: detectará el GLB y usará la malla anatómica real.
Revisa la consola del navegador: CerebroGLTF imprime las mallas "sin mapear";
añade esos nombres a src/data/mapeoZAnatomy.ts para asociarlas a las regiones.
"""

import sys
import os
import bpy

# Palabras clave (en los nombres de malla de Z-Anatomy, en latín/inglés) que
# identifican estructuras del encéfalo que queremos conservar.
CLAVES_ENCEFALO = [
    "frontal_lobe", "parietal_lobe", "temporal_lobe", "occipital_lobe", "insula",
    "thalamus", "hypothalamus", "hippocampus", "amygdal",
    "caudate", "putamen", "pallmidus", "pallidum", "corpus_callosum",
    "midbrain", "mesencephalon", "pons", "medulla",
    "cerebellum",
    # términos generales por si el atlas agrupa:
    "brain", "cerebr", "encephal",
]


def nombre_relevante(nombre: str) -> bool:
    n = nombre.lower().replace(" ", "_").replace(".", "_").replace("-", "_")
    return any(clave in n for clave in CLAVES_ENCEFALO)


def main():
    argv = sys.argv
    salida = "public/models/cerebro.glb"
    if "--" in argv:
        extra = argv[argv.index("--") + 1:]
        if extra:
            salida = extra[0]

    salida = os.path.abspath(salida)
    os.makedirs(os.path.dirname(salida), exist_ok=True)

    # Mostrar todas las colecciones/objetos (Z-Anatomy oculta muchos por defecto).
    for obj in bpy.data.objects:
        obj.hide_set(False)
        obj.hide_viewport = False

    # Seleccionar solo las mallas del encéfalo; borrar el resto.
    bpy.ops.object.select_all(action="DESELECT")
    a_borrar = []
    conservadas = 0
    for obj in list(bpy.data.objects):
        if obj.type != "MESH":
            a_borrar.append(obj)
            continue
        if nombre_relevante(obj.name):
            obj.select_set(True)
            conservadas += 1
        else:
            a_borrar.append(obj)

    for obj in a_borrar:
        bpy.data.objects.remove(obj, do_unlink=True)

    print(f"[exportar] Mallas del encéfalo conservadas: {conservadas}")
    if conservadas == 0:
        print("[exportar] AVISO: no se reconoció ninguna malla. Revisa CLAVES_ENCEFALO "
              "y los nombres reales de las mallas en el .blend.")

    # Exportar GLB (binario, con nombres de malla preservados).
    bpy.ops.export_scene.gltf(
        filepath=salida,
        export_format="GLB",
        use_selection=False,
        export_yup=True,
        export_apply=True,
    )
    print(f"[exportar] GLB escrito en: {salida}")


if __name__ == "__main__":
    main()
