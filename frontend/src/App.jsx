import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Builder from './pages/Builder'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import SavedBuilds from './pages/SavedBuilds'
import Navbar from './Navbar'
import Settings from './pages/Settings'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/build" element={<Builder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/saved" element={<SavedBuilds />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />
      </Routes>
    </>
  )
}

export default App
