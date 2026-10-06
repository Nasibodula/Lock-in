import { MN, TK, P, has, cnt, full, months, streaks } from './lib.js'

const DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Bar({ label, right, pct }) {
  return (
    <div>
      <div className="row"><span>{label}</span><span>{right}</span></div>
      <div className="bar"><i style={{ width: pct + '%' }} /></div>
    </div>
  )
}

export default function Dashboard({ S, D }) {
  const s = streaks(S, D)
  const past = D.filter(k => k <= TK)
  const nh = S.habits.length
  const chk = past.reduce((a, k) => a + cnt(S, k), 0)
  const pct = past.length && nh ? Math.round(chk / (past.length * nh) * 100) : 0
  const left = D.length - past.length
  const tk = past.flatMap(k => S.tasks[k] || [])
  const tdone = tk.filter(t => t.done).length
  const short = { month: 'short', day: 'numeric' }

  const perHabit = S.habits.map(h => ({ h, c: past.filter(k => has(S, k, h.id)).length }))
  const weekday = DN.map((n, d) => {
    const ks = past.filter(k => P(k).getDay() === d)
    const v = ks.reduce((a, k) => a + (nh ? cnt(S, k) / nh : 0), 0)
    return { n, p: ks.length ? Math.round(v / ks.length * 100) : 0 }
  })
  const stats = [[s.cur, 'day streak'], [s.best, 'best streak'], [pct + '%', 'habits done so far'], [left, 'days left']]

  return (
    <>
      <h2>Dashboard</h2>
      <p className="sub">
        {P(S.start).toLocaleDateString(undefined, short)} to {P(S.end).toLocaleDateString(undefined, { ...short, year: 'numeric' })}, {D.length} days
      </p>
      <div className="stats">
        {stats.map(([n, label]) => <div className="card stat" key={label}><b>{n}</b><span>{label}</span></div>)}
      </div>

      <div className="card">
        <h3>Months</h3>
        {months(D).map(ym => {
          const ks = D.filter(k => k.slice(0, 7) === ym)
          const fd = ks.filter(k => full(S, k)).length
          const den = ks.length * nh
          const pp = den ? Math.round(ks.reduce((a, k) => a + cnt(S, k), 0) / den * 100) : 0
          return <Bar key={ym} label={`${MN[+ym.slice(5) - 1]} ${ym.slice(0, 4)}`} right={`${fd} full days of ${ks.length} (${pp}%)`} pct={pp} />
        })}
      </div>

      <div className="card">
        <h3>Each habit so far</h3>
        {perHabit.length === 0 && <p className="sub">No habits yet.</p>}
        {perHabit.map(({ h, c }) => {
          const p = past.length ? Math.round(c / past.length * 100) : 0
          return <Bar key={h.id} label={h.name} right={`${c} of ${past.length} days (${p}%)`} pct={p} />
        })}
      </div>

      <div className="card">
        <h3>Which weekdays you perform best</h3>
        {weekday.map(w => <Bar key={w.n} label={w.n} right={w.p + '%'} pct={w.p} />)}
      </div>

      <div className="card">
        <h3>To-do lists</h3>
        <p className="sub" style={{ margin: 0 }}>{tdone} of {tk.length} tasks done across your days so far.</p>
      </div>
    </>
  )
}
