import { useEffect, useState } from 'react'
import Dashboard from './Dashboard.jsx'
import Todo from './Todo.jsx'
import Tracker from './Tracker.jsx'
import Settings from './Settings.jsx'
import { TK, daysOf, useStore } from './lib.js'

const TABS = [['dash', 'Dashboard'], ['todo', 'TODO'], ['track', 'Tracker'], ['set', 'Settings']]

export default function App() {
  const [S, setS] = useStore()
  const [view, setView] = useState('dash')
  const [mi, setMi] = useState(0)
  const [sel, setSel] = useState(TK)
  const D = daysOf(S.start, S.end)

  useEffect(() => { window.scrollTo(0, 0) }, [view])
  useEffect(() => { setMi(0) }, [S.start, S.end])

  const props = { S, setS, D }
  return (
    <div className="app">
      <main key={view}>
        {view === 'dash' && <Dashboard {...props} />}
        {view === 'todo' && <Todo {...props} sel={sel} setSel={setSel} />}
        {view === 'track' && <Tracker {...props} mi={mi} setMi={setMi} />}
        {view === 'set' && <Settings S={S} setS={setS} onSaved={() => setView('dash')} />}
      </main>
      <nav>
        {TABS.map(([id, label]) => (
          <button key={id} className={view === id ? 'on' : ''} onClick={() => setView(id)}>{label}</button>
        ))}
      </nav>
    </div>
  )
}
