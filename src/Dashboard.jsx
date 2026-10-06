import Checklist from './Checklist.jsx'
import { MN, TK, P, fmt, cnt, full, months, streaks } from './lib.js'

export default function Dashboard({ S, setS, D }) {
  const s = streaks(S, D)
  let tot = 0, chk = 0
  D.forEach(k => { if (k <= TK) { tot++; chk += cnt(S, k) } })
  const poss = tot * S.habits.length
  const pct = poss ? Math.round(chk / poss * 100) : 0
  const left = D.filter(k => k > TK).length
  const short = { month: 'short', day: 'numeric' }
  const stats = [[s.cur, 'day streak'], [s.best, 'best streak'], [pct + '%', 'habits done so far'], [left, 'days left']]

  return (
    <>
      <h2>Dashboard</h2>
      <p className="sub">
        {P(S.start).toLocaleDateString(undefined, short)} to {P(S.end).toLocaleDateString(undefined, { ...short, year: 'numeric' })}, {D.length} days
      </p>
      <div className="stats">
        {stats.map(([n, label]) => (
          <div className="card stat" key={label}><b>{n}</b><span>{label}</span></div>
        ))}
      </div>
      <div className="card">
        <h3>Months</h3>
        {months(D).map(ym => {
          const ks = D.filter(k => k.slice(0, 7) === ym)
          const fd = ks.filter(k => full(S, k)).length
          const ch = ks.reduce((a, k) => a + cnt(S, k), 0)
          const den = ks.length * S.habits.length
          const pp = den ? Math.round(ch / den * 100) : 0
          return (
            <div key={ym}>
              <div className="row">
                <span>{MN[+ym.slice(5) - 1]} {ym.slice(0, 4)}</span>
                <span>{fd} full days of {ks.length} ({pp}%)</span>
              </div>
              <div className="bar"><i style={{ width: pp + '%' }} /></div>
            </div>
          )
        })}
      </div>
      <div className="card">
        {D.includes(TK) ? (
          <>
            <h3>Today</h3>
            <Checklist S={S} setS={setS} k={TK} />
          </>
        ) : (
          TK < D[0] ? `Your period starts on ${fmt(D[0])}.` : 'Your period has ended. Set a new one in Settings.'
        )}
      </div>
    </>
  )
}
