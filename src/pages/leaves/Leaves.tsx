import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import MainLayout from '../../layouts/Mainlayout'

type LeaveRequest = {
  id: string
  employee_id: string
  start_date: string
  end_date: string
  reason: string
  status: string
  employees: { full_name: string }
}

export default function Leaves() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [employees, setEmployees] = useState<{ id: string; full_name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    employee_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    status: 'pending',
  })

  const fetchLeaves = async () => {
    const { data } = await supabase
      .from('leave_requests')
      .select('*, employees(full_name)')
      .order('created_at', { ascending: false })
    if (data) setLeaves(data)
    setLoading(false)
  }

  const fetchEmployees = async () => {
    const { data } = await supabase.from('employees').select('id, full_name')
    if (data) setEmployees(data)
  }

  useEffect(() => {
    fetchLeaves()
    fetchEmployees()
  }, [])

  const handleAdd = async () => {
    const { error } = await supabase.from('leave_requests').insert([form])
    if (!error) {
      setShowForm(false)
      setForm({ employee_id: '', start_date: '', end_date: '', reason: '', status: 'pending' })
      fetchLeaves()
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from('leave_requests').update({ status }).eq('id', id)
    fetchLeaves()
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Leave Requests</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Request
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">New Leave Request</h2>
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
              placeholder="Start Date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="date"
              placeholder="End Date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Request
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
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No leave requests yet.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{leave.employees?.full_name}</td>
                    <td className="p-3">{leave.start_date}</td>
                    <td className="p-3">{leave.end_date}</td>
                    <td className="p-3">{leave.reason}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                        leave.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleStatusChange(leave.id, 'approved')}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(leave.id, 'rejected')}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Reject
                      </button>
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