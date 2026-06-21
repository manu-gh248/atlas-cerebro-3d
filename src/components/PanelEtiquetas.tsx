import { useMemo, useState } from 'react'
import { GRUPOS, Grupo, REGIONES } from '../data/regiones'
import { useStore } from '../store/useStore'

const ORDEN_GRUPOS: Grupo[] = ['lobulo', 'subcortical', 'tronco', 'cerebelo']

/** Lista de regiones agrupadas por categoría, con buscador. Clic = señalar en el 3D. */
export function PanelEtiquetas() {
  const [busqueda, setBusqueda] = useState('')
  const selectedId = useStore((s) => s.selectedId)
  const hoveredId = useStore((s) => s.hoveredId)
  const select = useStore((s) => s.select)
  const setHovered = useStore((s) => s.setHovered)

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return REGIONES
    return REGIONES.filter(
      (r) =>
        r.nombre.toLowerCase().includes(q) ||
        r.nombreCientifico.toLowerCase().includes(q),
    )
  }, [busqueda])

  return (
    <aside className="panel-etiquetas">
      <h1 className="titulo-app">🧠 Atlas del Cerebro 3D</h1>
      <p className="subtitulo-app">Haz clic en una región para señalarla en el modelo</p>

      <input
        className="buscador"
        type="search"
        placeholder="Buscar región…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="lista-grupos">
        {ORDEN_GRUPOS.map((grupo) => {
          const items = filtradas.filter((r) => r.grupo === grupo)
          if (!items.length) return null
          return (
            <section key={grupo} className="grupo">
              <h2 className="grupo-titulo">{GRUPOS[grupo]}</h2>
              <ul>
                {items.map((r) => {
                  const activa = selectedId === r.id
                  const resaltada = hoveredId === r.id
                  return (
                    <li key={r.id}>
                      <button
                        className={`etiqueta${activa ? ' activa' : ''}${resaltada ? ' resaltada' : ''}`}
                        onClick={() => select(r.id)}
                        onMouseEnter={() => setHovered(r.id)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <span className="etiqueta-punto" style={{ background: r.color }} />
                        {r.nombre}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </aside>
  )
}
