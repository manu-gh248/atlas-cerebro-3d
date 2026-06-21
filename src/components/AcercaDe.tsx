import { useState } from 'react'

/** Modal con créditos, licencia y aviso sobre la fidelidad del modelo. */
export function AcercaDe() {
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      <button className="boton-acerca" onClick={() => setAbierto(true)}>
        ⓘ Acerca de
      </button>

      {abierto && (
        <div className="modal-fondo" onClick={() => setAbierto(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar" onClick={() => setAbierto(false)} aria-label="Cerrar">
              ×
            </button>
            <h2>Atlas del Cerebro 3D</h2>
            <p>
              Herramienta interactiva para estudiar las principales regiones del cerebro:
              rota el modelo, señala una parte para ver su nombre y función, o usa la lista
              de etiquetas para localizar cada estructura.
            </p>

            <h3>Sobre la fidelidad del modelo</h3>
            <p>
              El modelo que ves por defecto es <strong>esquemático</strong>: cada estructura
              está colocada según su posición neuroanatómica real, pero su forma es una
              aproximación, no una superficie médica milimétrica. Sirve para aprender la
              <em> ubicación y relación</em> entre regiones.
            </p>
            <p>
              Para una superficie anatómica exacta (cisuras y circunvoluciones reales) la app
              admite cargar la malla de <strong>Z-Anatomy</strong>. Consulta el archivo
              <code> MODELO.md</code> del proyecto para el procedimiento.
            </p>

            <h3>Créditos y licencia</h3>
            <p>
              Modelo anatómico de fidelidad: <strong>Z-Anatomy</strong> — el atlas libre de
              anatomía 3D, bajo licencia <strong>CC-BY-SA 4.0</strong>. Cualquier uso de esa
              malla debe mantener la atribución y la misma licencia.
            </p>
            <p className="nota">
              Esta aplicación es una ayuda de estudio y no sustituye material clínico ni
              docente oficial.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
