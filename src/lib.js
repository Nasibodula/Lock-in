// import { useEffect, useState } from 'react'
// import { useCallback, useEffect, useRef, useState } from 'react'
// import { api } from './api.js'

// const KEY = 'lockin-app-v2'
// export const MN = ['January','February','March','April','May','June','July','August','September','October','November','December']
// export const WD = ['S','M','T','W','T','F','S']
// const pad = n => (n < 10 ? '0' + n : '' + n)
// export const K = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
// export const P = s => { const [a, b, c] = s.split('-'); return new Date(+a, b - 1, +c) }
// export const TK = K(new Date())
// export const fmt = k => P(k).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

// export const DEEN = () => ({
//   items: [
//     { id: 'd1', name: 'Fajr', group: 'Prayers' },
//     { id: 'd2', name: 'Dhuhr', group: 'Prayers' },
//     { id: 'd3', name: 'Asr', group: 'Prayers' },
//     { id: 'd4', name: 'Maghrib', group: 'Prayers' },
//     { id: 'd5', name: 'Isha', group: 'Prayers' },
//     { id: 'd6', name: 'Read Quran', group: 'Quran' },
//     { id: 'd7', name: 'Quran revision', group: 'Quran' },
//     { id: 'd8', name: 'Morning adhkar', group: 'Adhkar' },
//     { id: 'd9', name: 'Evening adhkar', group: 'Adhkar' },
//     { id: 'd10', name: 'Sunnah prayers', group: 'Extras' },
//     { id: 'd11', name: 'Dua', group: 'Extras' },
//     { id: 'd12', name: 'Sadaqah', group: 'Extras' }
//   ],
//   log: {},   // { 'YYYY-MM-DD': [itemId, ...] }
//   pages: {}  // { 'YYYY-MM-DD': 'number of pages' }
// })

// export const DEF = () => ({
//   start: '2026-10-01',
//   end: '2026-12-31',
//   habits: [
//     { id: 'p1', name: 'Wake up at 6:00 am', group: 'Morning routine' },
//     { id: 'p2', name: 'Drink jeera water', group: 'Morning routine' },
//     { id: 'p3', name: 'Breathing exercise', group: 'Morning routine' },
//     { id: 'p4', name: '30 minutes workout', group: 'Morning routine' },
//     { id: 'p5', name: 'Read 10 pages', group: 'Morning routine' },
//     { id: 'p6', name: 'Write affirmations', group: 'Morning routine' },

//     { id: 'p7', name: '10k steps', group: 'Health' },
//     { id: 'p8', name: '3L water', group: 'Health' },
//     { id: 'p9', name: 'No sugar', group: 'Health' },
//     { id: 'p10', name: 'No junk', group: 'Health' },
//     { id: 'p11', name: 'Skincare', group: 'Health' },
//     { id: 'p12', name: 'Haircare', group: 'Health' },
//     { id: 'p13', name: 'Meditations', group: 'Health' },

//     { id: 'p14', name: 'Morning hour without screen', group: 'Digital detox' },
//     { id: 'p15', name: 'No scrolling', group: 'Digital detox' },

//     { id: 'p16', name: 'Plan next day in advance', group: 'Night routine' }
//   ],
//   log: {},   // { 'YYYY-MM-DD': [habitId, ...] }
//   notes: {}, // { 'YYYY-MM-DD': { mood, note } }  note = end-of-day remark
//   tasks: {}, // { 'YYYY-MM-DD': [{ id, text, time, done }] }
//   deen: DEEN()
// })

// function load() {
//   try {
//     const p = JSON.parse(localStorage.getItem(KEY))
//     if (p && p.habits && p.log && p.start) {
//       const s = { notes: {}, tasks: {}, deen: DEEN(), ...p }
//       // old habits had no section, so swap in the new list from the picture
//       if (s.habits.length && !s.habits.some(h => h.group)) s.habits = DEF().habits
//       return s
//     }
//   } catch {}
//   return DEF()
// }

// export function useStore() {
//   const [S, setS] = useState(load)
//   useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch {} }, [S])
//   return [S, setS]
// }

// export function daysOf(start, end) {
//   const s = P(start), e = P(end), out = []
//   for (let i = 0; i < 400; i++) {
//     const d = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i)
//     if (d > e) break
//     out.push(K(d))
//   }
//   return out
// }
// export const months = D => [...new Set(D.map(k => k.slice(0, 7)))]
// export const has = (S, k, id) => (S.log[k] || []).includes(id)
// export const cnt = (S, k) => S.habits.filter(h => has(S, k, h.id)).length
// export const full = (S, k) => S.habits.length > 0 && cnt(S, k) === S.habits.length

// export const toggle = (setS, k, id, on) =>
//   setS(S => ({ ...S, log: { ...S.log, [k]: [...(S.log[k] || []).filter(x => x !== id), ...(on ? [id] : [])] } }))

// export function streaks(S, D) {
//   let idx = D.indexOf(TK)
//   if (idx < 0) idx = TK > D[D.length - 1] ? D.length - 1 : -1
//   let cur = 0
//   if (idx >= 0) {
//     let j = idx
//     if (!full(S, D[j])) j--
//     while (j >= 0 && full(S, D[j])) { cur++; j-- }
//   }
//   let best = 0, run = 0
//   D.forEach(k => { if (full(S, k)) { run++; best = Math.max(best, run) } else run = 0 })
//   return { cur, best }
// }

// // --- new in this version ---

// // groups a list of habits (or deen items) by their section name, keeping order
// export const groupsOf = habits => {
//   const m = new Map()
//   habits.forEach(h => {
//     const g = h.group || 'Daily habits'
//     if (!m.has(g)) m.set(g, [])
//     m.get(g).push(h)
//   })
//   return [...m]
// }

// // which day a page should show: the picked day, else today, else the first day
// export const dayOf = (D, sel) => (D.includes(sel) ? sel : D.includes(TK) ? TK : D[0])

// // tick or untick a Deen item for a day
// export const toggleDeen = (setS, k, id, on) =>
//   setS(S => ({ ...S, deen: { ...S.deen, log: { ...S.deen.log, [k]: [...(S.deen.log[k] || []).filter(x => x !== id), ...(on ? [id] : [])] } } }))



import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from './api.js'

const KEY = 'lockin-app-v2'
export const MN = ['January','February','March','April','May','June','July','August','September','October','November','December']
export const WD = ['S','M','T','W','T','F','S']
const pad = n => (n < 10 ? '0' + n : '' + n)
export const K = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const P = s => { const [a, b, c] = s.split('-'); return new Date(+a, b - 1, +c) }
export const TK = K(new Date())
export const fmt = k => P(k).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

export const DEEN = () => ({
  items: [
    { id: 'd1', name: 'Fajr', group: 'Prayers' },
    { id: 'd2', name: 'Dhuhr', group: 'Prayers' },
    { id: 'd3', name: 'Asr', group: 'Prayers' },
    { id: 'd4', name: 'Maghrib', group: 'Prayers' },
    { id: 'd5', name: 'Isha', group: 'Prayers' },
    { id: 'd6', name: 'Read Quran', group: 'Quran' },
    { id: 'd7', name: 'Quran revision', group: 'Quran' },
    { id: 'd8', name: 'Morning adhkar', group: 'Adhkar' },
    { id: 'd9', name: 'Evening adhkar', group: 'Adhkar' },
    { id: 'd10', name: 'Sunnah prayers', group: 'Extras' },
    { id: 'd11', name: 'Dua', group: 'Extras' },
    { id: 'd12', name: 'Sadaqah', group: 'Extras' }
  ],
  log: {},   // { 'YYYY-MM-DD': [itemId, ...] }
  pages: {}  // { 'YYYY-MM-DD': 'number of pages' }
})

export const DEF = () => ({
  start: '2026-10-01',
  end: '2026-12-31',
  habits: [
    { id: 'p1', name: 'Wake up at 6:00 am', group: 'Morning routine' },
    { id: 'p2', name: 'Drink jeera water', group: 'Morning routine' },
    { id: 'p3', name: 'Breathing exercise', group: 'Morning routine' },
    { id: 'p4', name: '30 minutes workout', group: 'Morning routine' },
    { id: 'p5', name: 'Read 10 pages', group: 'Morning routine' },
    { id: 'p6', name: 'Write affirmations', group: 'Morning routine' },

    { id: 'p7', name: '10k steps', group: 'Health' },
    { id: 'p8', name: '3L water', group: 'Health' },
    { id: 'p9', name: 'No sugar', group: 'Health' },
    { id: 'p10', name: 'No junk', group: 'Health' },
    { id: 'p11', name: 'Skincare', group: 'Health' },
    { id: 'p12', name: 'Haircare', group: 'Health' },
    { id: 'p13', name: 'Meditations', group: 'Health' },

    { id: 'p14', name: 'Morning hour without screen', group: 'Digital detox' },
    { id: 'p15', name: 'No scrolling', group: 'Digital detox' },

    { id: 'p16', name: 'Plan next day in advance', group: 'Night routine' }
  ],
  log: {},   // { 'YYYY-MM-DD': [habitId, ...] }
  notes: {}, // { 'YYYY-MM-DD': { mood, note } }  note = end-of-day remark
  tasks: {}, // { 'YYYY-MM-DD': [{ id, text, time, done }] }
  deen: DEEN()
})

// fills in anything missing so older saved data still works
export const norm = p => {
  const s = { notes: {}, tasks: {}, deen: DEEN(), ...p }
  // old habits had no section, so swap in the new list
  if (s.habits.length && !s.habits.some(h => h.group)) s.habits = DEF().habits
  return s
}

function load() {
  try {
    const p = JSON.parse(localStorage.getItem(KEY))
    if (p && p.habits && p.log && p.start) return norm(p)
  } catch {}
  return DEF()
}

// used on logout so the next person on this device starts clean
export const clearLocal = () => { try { localStorage.removeItem(KEY) } catch {} }

// local copy for speed/offline, MongoDB (via the server) is the source of truth
export function useStore(auth, onExpired) {
  const [S, setS] = useState(load)
  const [sync, setSync] = useState('loading') // loading | saving | saved | offline
  const ready = useRef(false)   // true once we have heard from the server
  const skip = useRef(false)    // do not re-upload data we just downloaded
  const dirty = useRef(false)   // true when there are unsaved changes
  const latest = useRef(S)
  latest.current = S

  const push = useCallback(async () => {
    setSync('saving')
    try {
      await api('/api/data', { method: 'PUT', token: auth.token, body: { state: latest.current } })
      dirty.current = false
      setSync('saved')
    } catch (e) {
      if (e.status === 401) onExpired(); else setSync('offline')
    }
  }, [auth.token])

  // first load: server data wins; if the account is new, upload what is on this device
  useEffect(() => {
    let dead = false, timer
    const pull = async () => {
      try {
        const r = await api('/api/data', { token: auth.token })
        if (dead) return
        ready.current = true
        if (r.state) { skip.current = true; setS(norm(r.state)); setSync('saved') } else push()
      } catch (e) {
        if (dead) return
        if (e.status === 401) onExpired()
        else { setSync('offline'); timer = setTimeout(pull, 5000) }
      }
    }
    pull()
    return () => { dead = true; clearTimeout(timer) }
  }, [auth.token])

  // every change: save on this device now, to MongoDB shortly after
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(S)) } catch {}
    if (!ready.current) return
    if (skip.current) { skip.current = false; return }
    dirty.current = true
    setSync('saving')
    const t = setTimeout(push, 700)
    return () => clearTimeout(t)
  }, [S])

  // save straight away when the tab is hidden or the connection comes back
  useEffect(() => {
    const flush = () => { if (ready.current && dirty.current) push() }
    const vis = () => document.visibilityState === 'hidden' && flush()
    window.addEventListener('online', flush)
    document.addEventListener('visibilitychange', vis)
    return () => {
      window.removeEventListener('online', flush)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [push])

  return [S, setS, sync]
}

export function daysOf(start, end) {
  const s = P(start), e = P(end), out = []
  for (let i = 0; i < 400; i++) {
    const d = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i)
    if (d > e) break
    out.push(K(d))
  }
  return out
}
export const months = D => [...new Set(D.map(k => k.slice(0, 7)))]
export const has = (S, k, id) => (S.log[k] || []).includes(id)
export const cnt = (S, k) => S.habits.filter(h => has(S, k, h.id)).length
export const full = (S, k) => S.habits.length > 0 && cnt(S, k) === S.habits.length

export const toggle = (setS, k, id, on) =>
  setS(S => ({ ...S, log: { ...S.log, [k]: [...(S.log[k] || []).filter(x => x !== id), ...(on ? [id] : [])] } }))

export function streaks(S, D) {
  let idx = D.indexOf(TK)
  if (idx < 0) idx = TK > D[D.length - 1] ? D.length - 1 : -1
  let cur = 0
  if (idx >= 0) {
    let j = idx
    if (!full(S, D[j])) j--
    while (j >= 0 && full(S, D[j])) { cur++; j-- }
  }
  let best = 0, run = 0
  D.forEach(k => { if (full(S, k)) { run++; best = Math.max(best, run) } else run = 0 })
  return { cur, best }
}

// groups a list of habits (or deen items) by their section name, keeping order
export const groupsOf = habits => {
  const m = new Map()
  habits.forEach(h => {
    const g = h.group || 'Daily habits'
    if (!m.has(g)) m.set(g, [])
    m.get(g).push(h)
  })
  return [...m]
}

// which day a page should show: the picked day, else today, else the first day
export const dayOf = (D, sel) => (D.includes(sel) ? sel : D.includes(TK) ? TK : D[0])

// tick or untick a Deen item for a day
export const toggleDeen = (setS, k, id, on) =>
  setS(S => ({ ...S, deen: { ...S.deen, log: { ...S.deen.log, [k]: [...(S.deen.log[k] || []).filter(x => x !== id), ...(on ? [id] : [])] } } }))