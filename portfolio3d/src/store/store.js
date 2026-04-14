import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // ── navigation ──────────────────────────────
  section: null,          // null = planet home
  prevSection: null,
  transitioning: false,
  txType: null,           // 'dive' | 'emerge' | 'warp'
  txTarget: null,

  // ── planet ──────────────────────────────────
  hovered: null,
  planetReady: false,

  // ── loading ─────────────────────────────────
  loading: true,
  progress: 0,
  loadMsg: 'Calibrating orbit...',

  // ── data ────────────────────────────────────
  profile: null,
  projects: [],
  skills: [],
  education: [],
  experience: [],
  certificates: [],
  achievements: [],

  // ── actions ─────────────────────────────────
  navigate(target) {
    const { section, transitioning } = get()
    if (transitioning || target === section) return
    const txType = section === null ? 'dive' : target === null ? 'emerge' : 'warp'
    set({ transitioning: true, txType, txTarget: target })
  },

  finishTransition() {
    const { txTarget, section } = get()
    set({ transitioning: false, section: txTarget, prevSection: section, txTarget: null, txType: null })
  },

  setHovered: (v)  => set({ hovered: v }),
  setPlanetReady: () => set({ planetReady: true }),
  setLoading: (v) => set({ loading: v }),
  setProgress: (p, msg) => set({ progress: p, ...(msg ? { loadMsg: msg } : {}) }),

  setData(key, val) { set({ [key]: val }) },
}))
