// import { useState } from 'react'
// import { DEF, P } from './lib.js'

// export default function Settings({ S, setS, onSaved }) {
//   const [start, setStart] = useState(S.start)
//   const [end, setEnd] = useState(S.end)
//   const [err, setErr] = useState('')
//   const [name, setName] = useState('')

//   const savePeriod = () => {
//     if (!start || !end || P(end) < P(start)) return setErr('Pick an end date that is after the start date.')
//     if ((P(end) - P(start)) / 864e5 > 399) return setErr('The period can be up to 400 days.')
//     setErr('')
//     setS(s => ({ ...s, start, end }))
//     onSaved()
//   }
//   const addHabit = () => {
//     const x = name.trim()
//     if (!x) return
//     setS(s => ({ ...s, habits: [...s.habits, { id: 'h' + Date.now(), name: x }] }))
//     setName('')
//   }
//   const rename = (id, v) => v.trim() && setS(s => ({ ...s, habits: s.habits.map(h => (h.id === id ? { ...h, name: v.trim() } : h)) }))
//   const remove = h => confirm(`Remove "${h.name}"? Its history is kept but hidden.`) &&
//     setS(s => ({ ...s, habits: s.habits.filter(y => y.id !== h.id) }))

//   return (
//     <>
//       <h2>Settings</h2>
//       <p className="sub">Choose the period you want to track. The calendar and months update to match.</p>
//       <div className="card">
//         <h3>Tracking period</h3>
//         <div className="g2">
//           <label>Start<input type="date" value={start} onChange={e => setStart(e.target.value)} /></label>
//           <label>End<input type="date" value={end} onChange={e => setEnd(e.target.value)} /></label>
//         </div>
//         <button className="btn pri" style={{ marginTop: 10 }} onClick={savePeriod}>Save period</button>
//         {err && <div className="err">{err}</div>}
//       </div>
//       <div className="card">
//         <h3>Habits</h3>
//         {S.habits.map(h => (
//           <div className="f" key={h.id}>
//             <input type="text" aria-label="Habit name" defaultValue={h.name} onBlur={e => rename(h.id, e.target.value)} />
//             <button className="btn" onClick={() => remove(h)}>Remove</button>
//           </div>
//         ))}
//         <div className="f">
//           <input type="text" placeholder="New habit" aria-label="New habit" value={name}
//             onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addHabit()} />
//           <button className="btn pri" onClick={addHabit}>Add habit</button>
//         </div>
//       </div>
//       <div className="card">
//         <h3>Data</h3>
//         <p className="sub">Everything is saved in this browser on this device.</p>
//         <button className="btn" onClick={() => confirm('Clear all habits, progress and notes?') && setS(DEF())}>Reset all data</button>
//       </div>
//     </>
//   )
// }


import { useState } from 'react'
import { DEF, P } from './lib.js'
import SectionEditor from './SectionEditor.jsx'

const SYNC = { loading: 'Loading your data...', saving: 'Saving...', saved: 'All changes saved to your account.', offline: 'Offline. Changes will save when you reconnect.' }

export default function Settings({ S, setS, auth, sync, onLogout, onSaved }) {
  const [start, setStart] = useState(S.start)
  const [end, setEnd] = useState(S.end)
  const [err, setErr] = useState('')

  const savePeriod = () => {
    if (!start || !end || P(end) < P(start)) return setErr('Pick an end date that is after the start date.')
    if ((P(end) - P(start)) / 864e5 > 399) return setErr('The period can be up to 400 days.')
    setErr('')
    setS(s => ({ ...s, start, end }))
    onSaved()
  }

  return (
    <>
      <h2>Settings</h2>
      <p className="sub">Choose the period you want to track. The calendar and months update to match.</p>

      <div className="card">
        <h3>Account</h3>
        <p className="sub" style={{ marginBottom: 8 }}>{auth.email}</p>
        <p className="sub">{SYNC[sync]}</p>
        <button className="btn" onClick={() => confirm('Log out of this device?') && onLogout()}>Log out</button>
      </div>

      <div className="card">
        <h3>Tracking period</h3>
        <div className="g2">
          <label>Start<input type="date" value={start} onChange={e => setStart(e.target.value)} /></label>
          <label>End<input type="date" value={end} onChange={e => setEnd(e.target.value)} /></label>
        </div>
        <button className="btn pri" style={{ marginTop: 10 }} onClick={savePeriod}>Save period</button>
        {err && <div className="err">{err}</div>}
      </div>

      <SectionEditor title="Habits" prefix="h" items={S.habits}
        onChange={habits => setS(s => ({ ...s, habits }))} />

      <SectionEditor title="Deen" prefix="d" items={S.deen.items}
        onChange={items => setS(s => ({ ...s, deen: { ...s.deen, items } }))} />

      <div className="card">
        <h3>Data</h3>
        <p className="sub">Your data is saved to your account and cached on this device.</p>
        <button className="btn" onClick={() => confirm('Clear all habits, progress and notes?') && setS(DEF())}>Reset all data</button>
      </div>
    </>
  )
}