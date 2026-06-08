import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="w-64 min-h-screen bg-blue-800 text-white flex flex-col">
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-xl font-bold">HRMS</h1>
        <p className="text-blue-300 text-sm">Management System</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-left px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              🏠 Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/employees')}
              className="w-full text-left px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              👥 Employees
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/attendance')}
              className="w-full text-left px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              📅 Attendance
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/leaves')}
              className="w-full text-left px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              🌴 Leave Requests
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/payroll')}
              className="w-full text-left px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              💰 Payroll
            </button>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded hover:bg-red-600 transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  )
}