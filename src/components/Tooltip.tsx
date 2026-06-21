import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { REGIONES_POR_ID } from '../data/regiones'

/** Etiqueta flotante que sigue al ratón y muestra el nombre de la región bajo el cursor. */
export function Tooltip() {
  const hoveredId = useStore((s) => s.hoveredId)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  if (!hoveredId) return null
  const region = REGIONES_POR_ID[hoveredId]
  if (!region) return null

  return (
    <div
      className="tooltip"
      style={{ left: pos.x + 14, top: pos.y + 14, borderColor: region.color }}
    >
      <span className="tooltip-punto" style={{ background: region.color }} />
      {region.nombre}
    </div>
  )
}
