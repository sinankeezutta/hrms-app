import MainLayout from '../../layouts/MainLayout'

export default function Dashboard() {
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-blue-600">Welcome to HRMS! 🎉</h1>
      <p className="text-gray-600 mt-2">Select a module from the sidebar.</p>
    </MainLayout>
  )
}