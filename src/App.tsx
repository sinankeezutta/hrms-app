import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Employees from './pages/employees/Employees'
import Attendance from './pages/attendance/Attendance'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App