import { create } from 'zustand'

interface Estado {
  /** Región bajo el cursor (resaltado temporal). */
  hoveredId: string | null
  /** Región seleccionada (ficha abierta + cámara enfocada). */
  selectedId: string | null
  /** Solicitud de enfoque de cámara: id + contador para forzar re-disparo. */
  focusReq: { id: string; n: number } | null

  /** Corteza (lóbulos) visible. Al ocultarla se ven y se pueden señalar las estructuras profundas. */
  cortezaVisible: boolean
  /** Corteza semitransparente para entrever el interior. */
  cortezaTransparente: boolean

  setHovered: (id: string | null) => void
  select: (id: string | null) => void
  toggleCorteza: () => void
  toggleTransparencia: () => void
}

export const useStore = create<Estado>((set, get) => ({
  hoveredId: null,
  selectedId: null,
  focusReq: null,
  cortezaVisible: true,
  cortezaTransparente: true,

  setHovered: (id) => set({ hoveredId: id }),

  toggleCorteza: () => set((s) => ({ cortezaVisible: !s.cortezaVisible })),
  toggleTransparencia: () => set((s) => ({ cortezaTransparente: !s.cortezaTransparente })),

  select: (id) => {
    if (id === null) {
      set({ selectedId: null })
      return
    }
    const n = (get().focusReq?.n ?? 0) + 1
    set({ selectedId: id, focusReq: { id, n } })
  },
}))
