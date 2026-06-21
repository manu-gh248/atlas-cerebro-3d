import { GRUPOS } from '../data/regiones'
import { REGIONES_POR_ID } from '../data/regiones'
import { useStore } from '../store/useStore'

/** Ficha de la región seleccionada: nombre, término científico, grupo y función. */
export function PanelInfo() {
  const selectedId = useStore((s) => s.selectedId)
  const select = useStore((s) => s.select)
  const region = selectedId ? REGIONES_POR_ID[selectedId] : null

  if (!region) {
    return (
      <div className="panel-info vacio">
        <p>
          Pasa el ratón por el cerebro para ver el nombre de cada parte, o haz clic
          (en el modelo o en la lista) para ver su función.
        </p>
      </div>
    )
  }

  return (
    <div className="panel-info" style={{ borderTopColor: region.color }}>
      <button className="cerrar" onClick={() => select(null)} aria-label="Cerrar ficha">
        ×
      </button>
      <h3 style={{ color: region.color }}>{region.nombre}</h3>
      <p className="cientifico">{region.nombreCientifico}</p>
      <p className="grupo-tag">{GRUPOS[region.grupo]}</p>
      <p className="funcion">{region.funcion}</p>
    </div>
  )
}
