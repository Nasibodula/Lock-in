import { useState } from 'react'
import { groupsOf } from './lib.js'

const DEFAULT = 'Daily habits'
const gOf = h => h.group || DEFAULT

export default function SectionEditor({ title, items, onChange, prefix }) {
  const [drafts, setDrafts] = useState({})
  const [secName, setSecName] = useState('')
  const [secFirst, setSecFirst] = useState('')
  const mk = (name, group) => ({ id: prefix + Date.now() + Math.random().toString(36).slice(2, 5), name, group })

  const renameSection = (g, v) => {
    v = v.trim()
    if (!v || v === g) return
    onChange(items.map(h => (gOf(h) === g ? { ...h, group: v } : h)))
  }
  const removeSection = g =>
    confirm(`Remove the section "${g}" and all its items? History is kept but hidden.`) &&
    onChange(items.filter(h => gOf(h) !== g))
  const renameItem = (id, v) => v.trim() && onChange(items.map(h => (h.id === id ? { ...h, name: v.trim() } : h)))
  const removeItem = h => confirm(`Remove "${h.name}"? Its history is kept but hidden.`) &&
    onChange(items.filter(y => y.id !== h.id))
  const addItem = g => {
    const x = (drafts[g] || '').trim()
    if (!x) return
    onChange([...items, mk(x, g)])
    setDrafts(d => ({ ...d, [g]: '' }))
  }
  const addSection = () => {
    const g = secName.trim(), x = secFirst.trim()
    if (!g || !x) return
    onChange([...items, mk(x, g)])
    setSecName(''); setSecFirst('')
  }

  return (
    <div className="card">
      <h3>{title}</h3>
      {groupsOf(items).map(([g, hs]) => (
        <div key={g} style={{ marginBottom: 18 }}>
          <div className="f" style={{ marginTop: 0 }}>
            <input type="text" aria-label="Section heading" key={g} defaultValue={g}
              style={{ textTransform: 'uppercase', letterSpacing: '.05em' }}
              onBlur={e => renameSection(g, e.target.value)} />
            <button className="btn" onClick={() => removeSection(g)}>Remove section</button>
          </div>
          {hs.map(h => (
            <div className="f" key={h.id}>
              <input type="text" aria-label="Item name" defaultValue={h.name} onBlur={e => renameItem(h.id, e.target.value)} />
              <button className="btn" onClick={() => removeItem(h)}>Remove</button>
            </div>
          ))}
          <div className="f">
            <input type="text" placeholder={`Add to ${g}`} aria-label={`Add item to ${g}`} value={drafts[g] || ''}
              onChange={e => setDrafts(d => ({ ...d, [g]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addItem(g)} />
            <button className="btn pri" onClick={() => addItem(g)}>Add</button>
          </div>
        </div>
      ))}
      <h3 style={{ marginTop: 8 }}>New section</h3>
      <div className="f" style={{ marginTop: 0 }}>
        <input type="text" placeholder="Section heading" aria-label="New section heading" value={secName} onChange={e => setSecName(e.target.value)} />
        <input type="text" placeholder="First item" aria-label="First item" value={secFirst} onChange={e => setSecFirst(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSection()} />
        <button className="btn pri" onClick={addSection}>Add section</button>
      </div>
    </div>
  )
}