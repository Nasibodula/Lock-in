import { useLayoutEffect, useRef, useState } from 'react'
import { MN, WD, TK, P, cnt, full, has, months, streaks, groupsOf } from './lib.js'

const PINKS = ['#fbcfe0', '#f8b4cf', '#f48fb9', '#ee6fa5', '#e24f93', '#cf3a80', '#b82c70', '#e9a0c2']

export default function Dashboard({ S, D }) {
  const s = streaks(S, D)
  let tot = 0, chk = 0
  D.forEach(k => { if (k <= TK) { tot++; chk += cnt(S, k) } })
  const poss = tot * S.habits.length
  const pct = poss ? Math.round(chk / poss * 100) : 0
  const left = D.filter(k => k > TK).length
  const short = { month: 'short', day: 'numeric' }
  const stats = [[s.cur, 'day streak'], [s.best, 'best streak'], [pct + '%', 'habits done so far'], [left, 'days left']]

  const ms = months(D)
  const [mi, setMi] = useState(() => Math.max(0, ms.indexOf(TK.slice(0, 7))))
  const i = mi < ms.length ? mi : 0
  const ks = D.filter(k => k.slice(0, 7) === ms[i])
  const rows = groupsOf(S.habits).flatMap(([, hs]) => hs)

  // open the tracker with today's column in view (today + the days before it)
  const wrap = useRef(null)
  useLayoutEffect(() => {
    const w = wrap.current
    if (!w) return
    const t = w.querySelector('.hm-day.today')
    if (!t) { w.scrollLeft = 0; return }
    w.scrollLeft += t.getBoundingClientRect().right - w.getBoundingClientRect().right + 6
  }, [i, ks.length])

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

      <div className="card hm-card">
        <h3>Habit tracker</h3>
        <p className="sub" style={{ marginBottom: 10 }}>Each habit has its own shade of pink. White means not done.</p>
        <div className="tabs">
          {ms.map((ym, j) => (
            <button key={ym} className={j === i ? 'on' : ''} onClick={() => setMi(j)}>{MN[+ym.slice(5) - 1]}</button>
          ))}
        </div>
        <div className="hm-wrap" ref={wrap}>
          <div className="hm" style={{ '--n': ks.length }}>
            <div className="hm-row">
              <div className="hm-name" />
              {ks.map(k => (
                <div key={k} className={'hm-day' + (k === TK ? ' today' : '')}>{+k.slice(8)}<small>{WD[P(k).getDay()]}</small></div>
              ))}
            </div>
            {rows.map((h, r) => {
              const c = PINKS[r % PINKS.length]
              return (
                <div className="hm-row" key={h.id}>
                  <div className="hm-name"><i style={{ background: c }} />{h.name}</div>
                  {ks.map(k => {
                    const on = has(S, k, h.id)
                    return (
                      <div key={k} title={`${h.name}, ${k}`}
                        className={'hm-c' + (on ? ' on' : '') + (k === TK ? ' today' : '') + (k > TK ? ' fut' : '')}
                        style={on ? { background: c, borderColor: c } : undefined} />
                    )
                  })}
                </div>
              )
            })}
            <div className="hm-row">
              <div className="hm-name"><i style={{ background: '#a8296a' }} />Full day</div>
              {ks.map(k => (
                <div key={k} title={`Full day, ${k}`}
                  className={'hm-c' + (full(S, k) ? ' full' : '') + (k === TK ? ' today' : '') + (k > TK ? ' fut' : '')} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Months</h3>
        {ms.map(ym => {
          const mk = D.filter(k => k.slice(0, 7) === ym)
          const fd = mk.filter(k => full(S, k)).length
          const ch = mk.reduce((a, k) => a + cnt(S, k), 0)
          const den = mk.length * S.habits.length
          const pp = den ? Math.round(ch / den * 100) : 0
          return (
            <div key={ym}>
              <div className="row">
                <span>{MN[+ym.slice(5) - 1]} {ym.slice(0, 4)}</span>
                <span>{fd} full days of {mk.length} ({pp}%)</span>
              </div>
              <div className="bar"><i style={{ width: pp + '%' }} /></div>
            </div>
          )
        })}
      </div>
    </>
  )
}