import { cv } from './data/cv'
import { SECTIONS } from './data/sections'
import { ui } from './data/ui'

export default function App() {
  return (
    <main className="p-8">
      <h1>{cv.fr.name}</h1>
      <p>{ui.fr.headings.profile}</p>
      <p>{SECTIONS.length} sections</p>
    </main>
  )
}
