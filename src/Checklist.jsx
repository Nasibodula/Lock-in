import { has, toggle } from './lib.js'

export default function Checklist({ S, setS, k }) {
  return (
    <ul>
      {!S.habits.length && <li>No habits yet. Add some in Settings.</li>}
      {S.habits.map(h => (
        <li key={h.id} className={'ck' + (has(S, k, h.id) ? ' done' : '')}>
          <label>
            <input type="checkbox" checked={has(S, k, h.id)} onChange={e => toggle(setS, k, h.id, e.target.checked)} />
            <span className="n">{h.name}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}
