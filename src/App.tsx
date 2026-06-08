import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Employees from './pages/employees/Employees'
import Attendance from './pages/attendance/Attendance'
import Leaves from './pages/leaves/Leaves'
import Payroll from './pages/payroll/Payroll'

function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/employees" element={session ? <Employees /> : <Navigate to="/" />} />
        <Route path="/attendance" element={session ? <Attendance /> : <Navigate to="/" />} />
        <Route path="/leaves" element={session ? <Leaves /> : <Navigate to="/" />} />
        <Route path="/payroll" element={session ? <Payroll /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App