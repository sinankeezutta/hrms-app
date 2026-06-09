import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import MainLayout from '../../layouts/Mainlayout'

type AttendanceRecord = {
  id: string
  employee_id: string
  date: string
  check_in: string
  check_out: string
  status: string
  employees: { full_name: string }
}

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [employees, setEmployees] = useState<{ id: string; full_name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    employee_id: '',
    date: '',
    check_in: '',
    check_out: '',
    status: 'present',
  })

  const fetchRecords = async () => {
    const { data } = await supabase
      .from('attendance')
      .select('*, employees(full_name)')
      .order('date', { ascending: false })
    if (data) setRecords(data)
    setLoading(false)
  }

  const fetchEmployees = async () => {
    const { data } = await supabase.from('employees').select('id, full_name')
    if (data) setEmployees(data)
  }

  useEffect(() => {
    fetchRecords()
    fetchEmployees()
  }, [])

  const handleAdd = async () => {
    const { error } = await supabase.from('attendance').insert([form])
    if (!error) {
      setShowForm(false)
      setForm({ employee_id: '', date: '', check_in: '', check_out: '', status: 'present' })
      fetchRecords()
    }
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Attendance</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Record
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">New Attendance Record</h2>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.employee_id}
              onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="time"
              placeholder="Check In"
              value={form.check_in}
              onChange={(e) => setForm({ ...form, check_in: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="time"
              placeholder="Check Out"
              value={form.check_out}
              onChange={(e) => setForm({ ...form, check_out: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
            </select>
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Record
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Check In</th>
                <th className="p-3 text-left">Check Out</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No records yet. Add one!
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{rec.employees?.full_name}</td>
                    <td className="p-3">{rec.date}</td>
                    <td className="p-3">{rec.check_in}</td>
                    <td className="p-3">{rec.check_out}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rec.status === 'present' ? 'bg-green-100 text-green-700' :
                        rec.status === 'absent' ? 'bg-red-100 text-red-700' :
                        rec.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  )
}