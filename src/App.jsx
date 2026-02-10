import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Builder from './pages/Builder'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/build" element={<Builder />} />
    </Routes>
  )
}

export default App
