import Checklist from './Checklist.jsx'
import { TK, fmt, cnt } from './lib.js'

const MOODS = ['😞', '😕', '😐', '🙂', '🔥']

export default function Daily({ S, setS, D, sel, setSel }) {
  const k = D.includes(sel) ? sel : D.includes(TK) ? TK : D[0]
  const i = D.indexOf(k)
  const n = S.notes[k] || {}
  const setNote = patch => setS(s => ({ ...s, notes: { ...s.notes, [k]: { ...s.notes[k], ...patch } } }))

  return (
    <>
      <h2>Daily entry</h2>
      <p className="sub">{fmt(k)}, day {i + 1} of {D.length}</p>
      <div className="tabs">
        <button onClick={() => i > 0 && setSel(D[i - 1])}>Prev day</button>
        <button onClick={() => D.includes(TK) && setSel(TK)}>Today</button>
        <button onClick={() => i < D.length - 1 && setSel(D[i + 1])}>Next day</button>
        <input type="date" style={{ width: 'auto' }} value={k} min={D[0]} max={D[D.length - 1]}
          onChange={e => D.includes(e.target.value) && setSel(e.target.value)} aria-label="Pick a day" />
      </div>
      <div className="card">
        <h3>{cnt(S, k)} of {S.habits.length} habits done</h3>
        <Checklist S={S} setS={setS} k={k} />
      </div>
      <div className="card">
        <h3>How did the day go?</h3>
        <div className="mood">
          {MOODS.map((e, j) => (
            <button key={j} className={'btn' + (n.mood === j + 1 ? ' on' : '')} aria-label={`Mood ${j + 1} of 5`}
              onClick={() => setNote({ mood: n.mood === j + 1 ? 0 : j + 1 })}>{e}</button>
          ))}
        </div>
        <textarea rows={4} placeholder="What did you finish? What got in the way?" aria-label="Daily note"
          value={n.note || ''} onChange={e => setNote({ note: e.target.value })} />
      </div>
    </>
  )
}
