import { useState } from 'react'

const LIMIT = 5

export default function Paper({ groups, isOn, onToggle, empty }) {
  const [open, setOpen] = useState({})
  if (!groups.length) return <div className="paper"><h4>{empty}</h4></div>
  return (
    <div className="paper">
      {groups.map(([g, items]) => {
        const long = items.length > LIMIT
        const shown = long && !open[g] ? items.slice(0, LIMIT) : items
        return (
          <section key={g}>
            <h4>{g}:</h4>
            <ul className="hl">
              {shown.map(h => (
                <li key={h.id} className={isOn(h.id) ? 'done' : ''}>
                  <label>
                    <span className="n">{h.name}</span>
                    <input type="checkbox" checked={isOn(h.id)} onChange={e => onToggle(h.id, e.target.checked)} />
                  </label>
                </li>
              ))}
            </ul>
            {long && (
              <button type="button" className="more" aria-expanded={!!open[g]}
                onClick={() => setOpen(o => ({ ...o, [g]: !o[g] }))}>
                {open[g] ? '▴ show less' : `▾ ${items.length - LIMIT} more`}
              </button>
            )}
          </section>
        )
      })}
    </div>
  )
}