export default function Paper({ groups, isOn, onToggle, empty }) {
  if (!groups.length) return <div className="paper"><h4>{empty}</h4></div>
  return (
    <div className="paper">
      {groups.map(([g, items]) => (
        <section key={g}>
          <h4>{g}:</h4>
          <ul className="hl">
            {items.map(h => (
              <li key={h.id} className={isOn(h.id) ? 'done' : ''}>
                <label>
                  <span className="n">{h.name}</span>
                  <input type="checkbox" checked={isOn(h.id)} onChange={e => onToggle(h.id, e.target.checked)} />
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}