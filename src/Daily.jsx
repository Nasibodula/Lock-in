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