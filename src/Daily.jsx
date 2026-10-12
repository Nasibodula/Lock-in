// import Checklist from './Checklist.jsx'
// import { TK, fmt, cnt } from './lib.js'

// const MOODS = ['😞', '😕', '😐', '🙂', '🔥']

// export default function Daily({ S, setS, D, sel, setSel }) {
//   const k = D.includes(sel) ? sel : D.includes(TK) ? TK : D[0]
//   const i = D.indexOf(k)
//   const n = S.notes[k] || {}
//   const setNote = patch => setS(s => ({ ...s, notes: { ...s.notes, [k]: { ...s.notes[k], ...patch } } }))

//   return (
//     <>
//       <h2>Daily entry</h2>
//       <p className="sub">{fmt(k)}, day {i + 1} of {D.length}</p>
//       <div className="tabs">
//         <button onClick={() => i > 0 && setSel(D[i - 1])}>Prev day</button>
//         <button onClick={() => D.includes(TK) && setSel(TK)}>Today</button>
//         <button onClick={() => i < D.length - 1 && setSel(D[i + 1])}>Next day</button>
//         <input type="date" style={{ width: 'auto' }} value={k} min={D[0]} max={D[D.length - 1]}
//           onChange={e => D.includes(e.target.value) && setSel(e.target.value)} aria-label="Pick a day" />
//       </div>
//       <div className="card">
//         <h3>{cnt(S, k)} of {S.habits.length} habits done</h3>
//         <Checklist S={S} setS={setS} k={k} />
//       </div>
//       <div className="card">
//         <h3>How did the day go?</h3>
//         <div className="mood">
//           {MOODS.map((e, j) => (
//             <button key={j} className={'btn' + (n.mood === j + 1 ? ' on' : '')} aria-label={`Mood ${j + 1} of 5`}
//               onClick={() => setNote({ mood: n.mood === j + 1 ? 0 : j + 1 })}>{e}</button>
//           ))}
//         </div>
//         <textarea rows={4} placeholder="What did you finish? What got in the way?" aria-label="Daily note"
//           value={n.note || ''} onChange={e => setNote({ note: e.target.value })} />
//       </div>
//     </>
//   )
// }



import { useState } from 'react'
import DayNav from './DayNav.jsx'
import { dayOf } from './lib.js'

export default function Todo({ S, setS, D, sel, setSel }) {
  const k = dayOf(D, sel)
  const [text, setText] = useState('')
  const [time, setTime] = useState('')
  const tasks = [...(S.tasks[k] || [])].sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
  const setTasks = fn => setS(s => ({ ...s, tasks: { ...s.tasks, [k]: fn(s.tasks[k] || []) } }))
  const add = () => {
    const t = text.trim()
    if (!t) return
    setTasks(a => [...a, { id: 't' + Date.now(), text: t, time, done: false }])
    setText(''); setTime('')
  }

  return (
    <>
      <h2>To-do</h2>
      <DayNav D={D} k={k} setSel={setSel} />
      <div className="f" style={{ marginTop: 0, marginBottom: 12 }}>
        <input type="time" aria-label="Time" value={time} onChange={e => setTime(e.target.value)} />
        <input type="text" placeholder="Work task" aria-label="New task" value={text}
          onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        <button className="btn pri" onClick={add}>Add</button>
      </div>
      <div className="paper">
        <h4>Work schedule:</h4>
        <ul className="hl">
          {!tasks.length && <li className="empty">Nothing planned yet.</li>}
          {tasks.map(t => (
            <li key={t.id} className={t.done ? 'done' : ''}>
              <label>
                <span className="n">{t.time && <b className="tm">{t.time}</b>}{t.text}</span>
                <input type="checkbox" checked={t.done}
                  onChange={e => setTasks(a => a.map(x => (x.id === t.id ? { ...x, done: e.target.checked } : x)))} />
              </label>
              <button className="x" aria-label={`Delete ${t.text}`} onClick={() => setTasks(a => a.filter(x => x.id !== t.id))}>×</button>
            </li>
          ))}
        </ul>
      </div>
      <p className="sub">{tasks.filter(t => t.done).length} of {tasks.length} done</p>
    </>
  )
}