import { useEffect, useState } from 'react'
import Dashboard from './Dashboard.jsx'
import Habits from './Habits.jsx'
import Todo from './Todo.jsx'
import Deen from './Deen.jsx'
import Settings from './Settings.jsx'
import { TK, daysOf, useStore } from './lib.js'

const TABS = [['dash', 'Home'], ['habit', 'Habits'], ['todo', 'To-do'], ['deen', 'Deen'], ['set', 'Settings']]

export default function App() {
  const [S, setS] = useStore()
  const [view, setView] = useState('dash')
  const [sel, setSel] = useState(TK)
  const D = daysOf(S.start, S.end)

  useEffect(() => { window.scrollTo(0, 0) }, [view])
  useEffect(() => { document.body.classList.toggle('nb', view === 'habit') }, [view])

  const props = { S, setS, D }
  const day = { ...props, sel, setSel }
  return (
    <div className="app">
      <nav>
        <h1>Lock-in</h1>
        {TABS.map(([id, label]) => (
          <button key={id} className={view === id ? 'on' : ''} onClick={() => setView(id)}>{label}</button>
        ))}
      </nav>
      <main key={view} className={view === 'habit' ? 'nb' : ''}>
        {view === 'dash' && <Dashboard {...props} />}
        {view === 'habit' && <Habits {...day} />}
        {view === 'todo' && <Todo {...day} />}
        {view === 'deen' && <Deen {...day} />}
        {view === 'set' && <Settings S={S} setS={setS} onSaved={() => setView('dash')} />}
      </main>
    </div>
  )
}