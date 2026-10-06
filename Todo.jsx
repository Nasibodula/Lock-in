import { useState } from 'react'
import Checklist from './Checklist.jsx'
import { TK, fmt, cnt } from './lib.js'

const MOODS = ['😞', '😕', '😐', '🙂', '🔥']

export default function Todo({ S, setS, D, sel, setSel }) {
  const k = D.includes(sel) ? sel : D.includes(TK) ? TK : D[0]
  const i = D.indexOf(k)
  const n = S.notes[k] || {}
  const tasks = S.tasks[k] || []
  const [text, setText] = useState('')

  const setNote = patch => setS(s => ({ ...s, notes: { ...s.notes, [k]: { ...s.notes[k], ...patch } } }))
  const setTasks = fn => setS(s => ({ ...s, tasks: { ...s.tasks, [k]: fn(s.tasks[k] || []) } }))
  const addTask = () => {
    const t = text.trim()
    if (!t) return
    setTasks(a => [...a, { id: 't' + Date.now(), text: t, done: false }])
    setText('')
  }

  return (
    <>
      <h2>TODO</h2>
      <p className="sub">{fmt(k)}, day {i + 1} of {D.length}</p>
      <div className="tabs">
        <button onClick={() => i > 0 && setSel(D[i - 1])}>Prev day</button>
        <button onClick={() => D.includes(TK) && setSel(TK)}>Today</button>
        <button onClick={() => i < D.length - 1 && setSel(D[i + 1])}>Next day</button>
        <input type="date" style={{ width: 'auto' }} value={k} min={D[0]} max={D[D.length - 1]}
          onChange={e => D.includes(e.target.value) && setSel(e.target.value)} aria-label="Pick a day" />
      </div>

      <div className="card">
        <h3>Non-negotiables: {cnt(S, k)} of {S.habits.length}</h3>
        <Checklist S={S} setS={setS} k={k} />
      </div>

      <div className="card">
        <h3>To-do list for this day: {tasks.filter(t => t.done).length} of {tasks.length}</h3>
        <div className="f" style={{ marginBottom: 6 }}>
          <input type="text" placeholder="Write a task" aria-label="New task" value={text}
            onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} />
          <button className="btn pri" onClick={addTask}>Add</button>
        </div>
        {tasks.map(t => (
          <div key={t.id} className={'task' + (t.done ? ' done' : '')}>
            <label>
              <input type="checkbox" checked={t.done}
                onChange={e => setTasks(a => a.map(x => (x.id === t.id ? { ...x, done: e.target.checked } : x)))} />
              <span>{t.text}</span>
            </label>
            <button className="x" aria-label={`Delete ${t.text}`} onClick={() => setTasks(a => a.filter(x => x.id !== t.id))}>×</button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>End-of-day remark</h3>
        <div className="mood">
          {MOODS.map((e, j) => (
            <button key={j} className={'btn' + (n.mood === j + 1 ? ' on' : '')} aria-label={`Mood ${j + 1} of 5`}
              onClick={() => setNote({ mood: n.mood === j + 1 ? 0 : j + 1 })}>{e}</button>
          ))}
        </div>
        <textarea rows={4} placeholder="Say something about today: what went well, what got in the way?" aria-label="End-of-day remark"
          value={n.note || ''} onChange={e => setNote({ note: e.target.value })} />
      </div>
    </>
  )
}
