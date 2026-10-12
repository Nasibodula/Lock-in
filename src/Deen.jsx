import DayNav from './DayNav.jsx'
import Paper from './Paper.jsx'
import { dayOf, groupsOf, toggleDeen } from './lib.js'

export default function Deen({ S, setS, D, sel, setSel }) {
  const k = dayOf(D, sel)
  const on = S.deen.log[k] || []
  const pages = S.deen.pages[k] || ''
  const setPages = v => setS(s => ({ ...s, deen: { ...s.deen, pages: { ...s.deen.pages, [k]: v } } }))

  return (
    <>
      <h2>Deen</h2>
      <DayNav D={D} k={k} setSel={setSel} />
      <h3>{S.deen.items.filter(i => on.includes(i.id)).length} of {S.deen.items.length} done</h3>
      <Paper groups={groupsOf(S.deen.items)} isOn={id => on.includes(id)}
        onToggle={(id, v) => toggleDeen(setS, k, id, v)} />
      <div className="card">
        <h3>Quran pages read today</h3>
        <input type="number" min="0" inputMode="numeric" aria-label="Quran pages read"
          style={{ maxWidth: 160 }} value={pages} onChange={e => setPages(e.target.value)} />
      </div>
    </>
  )
}