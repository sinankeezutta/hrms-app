import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import MainLayout from '../../layouts/MainLayout'

type PayrollRecord = {
  id: string
  employee_id: string
  month: string
  basic_salary: number
  deductions: number
  net_salary: number
  paid_at: string
  employees: { full_name: string }
}

export default function Payroll() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([])
  const [employees, setEmployees] = useState<{ id: string; full_name: string; salary: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    employee_id: '',
    month: '',
    basic_salary: '',
    deductions: '0',
    net_salary: '',
  })

  const fetchPayrolls = async () => {
    const { data } = await supabase
      .from('payroll')
      .select('*, employees(full_name)')
      .order('paid_at', { ascending: false })
    if (data) setPayrolls(data)
    setLoading(false)
  }

  const fetchEmployees = async () => {
    const { data } = await supabase.from('employees').select('id, full_name, salary')
    if (data) setEmployees(data)
  }

  useEffect(() => {
    fetchPayrolls()
    fetchEmployees()
  }, [])

  const handleEmployeeChange = (id: string) => {
    const emp = employees.find((e) => e.id === id)
    if (emp) {
      const net = emp.salary - Number(form.deductions)
      setForm({
        ...form,
        employee_id: id,
        basic_salary: String(emp.salary),
        net_salary: String(net),
      })
    }
  }

  const handleDeductionChange = (val: string) => {
    const net = Number(form.basic_salary) - Number(val)
    setForm({ ...form, deductions: val, net_salary: String(net) })
  }

  const handleAdd = async () => {
    const { error } = await supabase.from('payroll').insert([
      {
        employee_id: form.employee_id,
        month: form.month,
        basic_salary: Number(form.basic_salary),
        deductions: Number(form.deductions),
        net_salary: Number(form.net_salary),
      },
    ])
    if (!error) {
      setShowForm(false)
      setForm({ employee_id: '', month: '', basic_salary: '', deductions: '0', net_salary: '' })
      fetchPayrolls()
    }
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Payroll</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Generate Payroll
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">New Payroll Entry</h2>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.employee_id}
              onChange={(e) => handleEmployeeChange(e.target.value)}
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
              placeholder="Month (e.g. June 2026)"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Basic Salary"
              value={form.basic_salary}
              readOnly
              className="border rounded px-3 py-2 text-sm bg-gray-50"
            />
            <input
              placeholder="Deductions"
              value={form.deductions}
              onChange={(e) => handleDeductionChange(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Net Salary"
              value={form.net_salary}
              readOnly
              className="border rounded px-3 py-2 text-sm bg-gray-50"
            />
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Payroll
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
                <th className="p-3 text-left">Month</th>
                <th className="p-3 text-left">Basic Salary</th>
                <th className="p-3 text-left">Deductions</th>
                <th className="p-3 text-left">Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No payroll records yet.
                  </td>
                </tr>
              ) : (
                payrolls.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.employees?.full_name}</td>
                    <td className="p-3">{p.month}</td>
                    <td className="p-3">₹{p.basic_salary}</td>
                    <td className="p-3">₹{p.deductions}</td>
                    <td className="p-3 font-medium text-green-600">₹{p.net_salary}</td>
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