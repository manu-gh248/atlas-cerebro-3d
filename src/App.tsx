import { useEffect, useState } from 'react'
import { Escena } from './components/Escena'
import { PanelEtiquetas } from './components/PanelEtiquetas'
import { PanelInfo } from './components/PanelInfo'
import { Tooltip } from './components/Tooltip'
import { AcercaDe } from './components/AcercaDe'
import { useStore } from './store/useStore'

export default function App() {
  // null = comprobando; true/false = hay (o no) malla anatómica Z-Anatomy disponible.
  const [usarGLTF, setUsarGLTF] = useState<boolean | null>(null)

  const cortezaVisible = useStore((s) => s.cortezaVisible)
  const cortezaTransparente = useStore((s) => s.cortezaTransparente)
  const toggleCorteza = useStore((s) => s.toggleCorteza)
  const toggleTransparencia = useStore((s) => s.toggleTransparencia)

  useEffect(() => {
    let activo = true
    // Nota: el dev server de Vite hace fallback a index.html (HTML) para rutas inexistentes,
    // así que no basta con res.ok: descartamos respuestas HTML para evitar falsos positivos.
    fetch(`${import.meta.env.BASE_URL}models/cerebro.glb`, { method: 'HEAD' })
      .then((r) => {
        if (!activo) return
        const tipo = r.headers.get('content-type') ?? ''
        setUsarGLTF(r.ok && !tipo.includes('text/html'))
      })
      .catch(() => activo && setUsarGLTF(false))
    return () => {
      activo = false
    }
  }, [])

  return (
    <div className="app">
      <PanelEtiquetas />

      <main className="visor">
        {usarGLTF !== null && <Escena usarGLTF={usarGLTF} />}

        <div className="controles">
          <AcercaDe />
          <label className="check">
            <input type="checkbox" checked={cortezaVisible} onChange={toggleCorteza} />
            Mostrar corteza (lóbulos)
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={cortezaTransparente}
              onChange={toggleTransparencia}
              disabled={!cortezaVisible}
            />
            Corteza transparente
          </label>
          {usarGLTF === false && (
            <p className="badge-modelo">Modelo esquemático · ver MODELO.md para Z-Anatomy</p>
          )}
          {usarGLTF === true && <p className="badge-modelo ok">Malla anatómica Z-Anatomy</p>}
        </div>

        <div className="ayuda">Arrastra para rotar · rueda para zoom · clic derecho para mover</div>

        <Tooltip />
        <PanelInfo />
      </main>
    </div>
  )
}
