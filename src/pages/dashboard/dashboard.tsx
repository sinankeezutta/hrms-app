import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import MainLayout from '../../layouts/Mainlayout'

export default function Dashboard() {
  const [employeeCount, setEmployeeCount] = useState(0)
  const [attendanceCount, setAttendanceCount] = useState(0)
  const [pendingLeaves, setPendingLeaves] = useState(0)
  const [payrollCount, setPayrollCount] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      const { count: emp } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
      setEmployeeCount(emp || 0)

      const today = new Date().toISOString().split('T')[0]
      const { count: att } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
      setAttendanceCount(att || 0)

      const { count: leaves } = await supabase
        .from('leave_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
      setPendingLeaves(leaves || 0)

      const { count: payroll } = await supabase
        .from('payroll')
        .select('*', { count: 'exact', head: true })
      setPayrollCount(payroll || 0)
    }
    fetchStats()
  }, [])

  const cards = [
    { title: 'Total Employees', value: employeeCount, icon: '👥', color: 'bg-blue-500' },
    { title: 'Present Today', value: attendanceCount, icon: '📅', color: 'bg-green-500' },
    { title: 'Pending Leaves', value: pendingLeaves, icon: '🌴', color: 'bg-yellow-500' },
    { title: 'Payroll Records', value: payrollCount, icon: '💰', color: 'bg-purple-500' },
  ]

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className={`${card.color} text-white text-3xl w-14 h-14 rounded-full flex items-center justify-center`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => window.location.href='/employees'} className="bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg p-4 text-center transition">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-sm font-medium">Add Employee</div>
          </button>
          <button onClick={() => window.location.href='/attendance'} className="bg-green-50 hover:bg-green-100 text-green-700 rounded-lg p-4 text-center transition">
            <div className="text-2xl mb-1">📅</div>
            <div className="text-sm font-medium">Mark Attendance</div>
          </button>
          <button onClick={() => window.location.href='/leaves'} className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg p-4 text-center transition">
            <div className="text-2xl mb-1">🌴</div>
            <div className="text-sm font-medium">Leave Requests</div>
          </button>
          <button onClick={() => window.location.href='/payroll'} className="bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg p-4 text-center transition">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-sm font-medium">Run Payroll</div>
          </button>
        </div>
      </div>
    </MainLayout>
  )
}