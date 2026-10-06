import { MN, WD, TK, P, has, full, months, toggle } from './lib.js'

export default function Tracker({ S, setS, D, mi, setMi }) {
  const ms = months(D)
  const i = mi < ms.length ? mi : 0
  const ks = D.filter(k => k.slice(0, 7) === ms[i])

  return (
    <>
      <h2>Habit tracker</h2>
      <p className="sub">Tick a box for each habit you completed. Red means a missed day.</p>
      <div className="tabs">
        {ms.map((ym, j) => (
          <button key={ym} className={j === i ? 'on' : ''} onClick={() => setMi(j)}>{MN[+ym.slice(5) - 1]}</button>
        ))}
      </div>
      <div className="wrap">
        <table>
          <thead>
            <tr>
              <th>Habit</th>
              {ks.map(k => (
                <th key={k} className={k === TK ? 'today' : ''}>{+k.slice(8)}<small>{WD[P(k).getDay()]}</small></th>
              ))}
              <th className="tot">Done</th>
            </tr>
          </thead>
          <tbody>
            {S.habits.map(h => {
              const c = ks.filter(k => has(S, k, h.id)).length
              return (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  {ks.map(k => {
                    const on = has(S, k, h.id)
                    const cls = [k === TK && 'today', k > TK && 'fut', !on && k < TK && 'gap'].filter(Boolean).join(' ')
                    return (
                      <td key={k} className={cls}>
                        <button aria-label={`${h.name}, ${k}, ${on ? 'done' : 'not done'}`} onClick={() => toggle(setS, k, h.id, !on)}>
                          {on ? '✓' : ''}
                        </button>
                      </td>
                    )
                  })}
                  <td className="tot">{Math.round(c / ks.length * 100)}%</td>
                </tr>
              )
            })}
            <tr>
              <th>Full day</th>
              {ks.map(k => <th key={k} className={k === TK ? 'today' : ''}>{full(S, k) ? '★' : ''}</th>)}
              <th className="tot">{ks.filter(k => full(S, k)).length}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
