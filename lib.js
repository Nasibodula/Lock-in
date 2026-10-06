import { useEffect, useState } from 'react'

const KEY = 'lockin-app-v2'
export const MN = ['January','February','March','April','May','June','July','August','September','October','November','December']
export const WD = ['S','M','T','W','T','F','S']
const pad = n => (n < 10 ? '0' + n : '' + n)
export const K = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const P = s => { const [a, b, c] = s.split('-'); return new Date(+a, b - 1, +c) }
export const TK = K(new Date())
export const fmt = k => P(k).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

export const DEF = () => ({
  start: '2026-10-01',
  end: '2026-12-31',
  habits: [
    { id: 'h1', name: 'Job applications' },
    { id: 'h2', name: 'Farmer chatbot build' },
    { id: 'h3', name: 'MBA concept paper' },
    { id: 'h4', name: 'Learn a skill' },
    { id: 'h5', name: 'Exercise' }
  ],
  log: {},   // { 'YYYY-MM-DD': [habitId, ...] }
  notes: {}, // { 'YYYY-MM-DD': { mood, note } }  note = end-of-day remark
  tasks: {}  // { 'YYYY-MM-DD': [{ id, text, done }] }
})

function load() {
  try {
    const p = JSON.parse(localStorage.getItem(KEY))
    if (p && p.habits && p.log && p.start) return { notes: {}, tasks: {}, ...p }
  } catch {}
  return DEF()
}

export function useStore() {
  const [S, setS] = useState(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch {} }, [S])
  return [S, setS]
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
