import Paper from './Paper.jsx'
import { has, toggle, groupsOf } from './lib.js'

export default function Checklist({ S, setS, k }) {
  return <Paper groups={groupsOf(S.habits)} isOn={id => has(S, k, id)}
    onToggle={(id, v) => toggle(setS, k, id, v)} empty="No habits yet. Add some in Settings." />
}