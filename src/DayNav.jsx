import { TK, fmt } from './lib.js'

export default function DayNav({ D, k, setSel }) {
  const i = D.indexOf(k)
  return (
    <>
      <p className="sub">{fmt(k)}, day {i + 1} of {D.length}</p>
      <div className="tabs">
        <button onClick={() => i > 0 && setSel(D[i - 1])}>Prev day</button>
        <button onClick={() => D.includes(TK) && setSel(TK)}>Today</button>
        <button onClick={() => i < D.length - 1 && setSel(D[i + 1])}>Next day</button>
        <input type="date" style={{ width: 'auto' }} value={k} min={D[0]} max={D[D.length - 1]}
          onChange={e => D.includes(e.target.value) && setSel(e.target.value)} aria-label="Pick a day" />
      </div>
    </>
  )
}