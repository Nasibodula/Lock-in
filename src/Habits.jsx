import { useState } from 'react'
import { TK, P, cnt, dayOf, groupsOf, has, toggle } from './lib.js'

const MOODS = ['😞', '😕', '😐', '🙂', '🔥']
const LIMIT = 5

export default function Habits({ S, setS, D, sel, setSel }) {
  const [open, setOpen] = useState({})
  const k = dayOf(D, sel)
  const i = D.indexOf(k)
  const n = S.notes[k] || {}
  const setNote = patch => setS(s => ({ ...s, notes: { ...s.notes, [k]: { ...s.notes[k], ...patch } } }))
  const date = P(k).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <div className="nb-page">
      <div className="nb-top">
        <button aria-label="Previous day" onClick={() => i > 0 && setSel(D[i - 1])}>‹</button>
        <button className="d" onClick={() => D.includes(TK) && setSel(TK)}>{date}{k === TK ? ' · today' : ''}</button>
        <button aria-label="Next day" onClick={() => i < D.length - 1 && setSel(D[i + 1])}>›</button>
        <span className="c">{cnt(S, k)}/{S.habits.length}</span>
      </div>

      {!S.habits.length && <section><h4>No habits yet:</h4><ul className="one"><li>Add some in Settings</li></ul></section>}

      {groupsOf(S.habits).map(([g, hs]) => {
        const long = hs.length > LIMIT
        const shown = long && !open[g] ? hs.slice(0, LIMIT) : hs
        return (
          <section key={g}>
            <h4>{g}:</h4>
            <ul className={shown.length > 6 ? 'two' : 'one'}>
              {shown.map(h => (
                <li key={h.id} className={has(S, k, h.id) ? 'done' : ''}>
                  <label>
                    <span>{h.name}</span>
                    <input type="checkbox" checked={has(S, k, h.id)} onChange={e => toggle(setS, k, h.id, e.target.checked)} />
                  </label>
                </li>
              ))}
            </ul>
            {long && (
              <button type="button" className="more" aria-expanded={!!open[g]}
                onClick={() => setOpen(o => ({ ...o, [g]: !o[g] }))}>
                {open[g] ? '▴ show less' : `▾ ${hs.length - LIMIT} more`}
              </button>
            )}
          </section>
        )
      })}

      <section>
        <h4>End of day:</h4>
        <div className="nb-mood">
          {MOODS.map((e, j) => (
            <button key={j} className={n.mood === j + 1 ? 'on' : ''} aria-label={`Mood ${j + 1} of 5`}
              onClick={() => setNote({ mood: n.mood === j + 1 ? 0 : j + 1 })}>{e}</button>
          ))}
        </div>
        <textarea placeholder="What went well, what got in the way?" aria-label="End-of-day remark"
          value={n.note || ''} onChange={e => setNote({ note: e.target.value })} />
      </section>
    </div>
  )
}