import { useState, useEffect } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { DashboardOverview } from './components/dashboard/DashboardOverview'
import FloorPlan from './components/floorplan/FloorPlan'
import { DeviceManagement } from './components/devices/DeviceManagement'
import { MediaUpload } from './components/media/MediaUpload'
import Analytics from './components/analytics/Analytics'
import { blink } from './blink/client'
import { Toaster } from './components/ui/toaster'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Smart Ad Point Manager...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Smart Ad Point Manager</h1>
            <p className="text-lg text-gray-600">
              Manage your digital advertisement points and smart bins with real-time monitoring
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">
              Access your dashboard to monitor battery levels, capacity status, and manage your devices.
            </p>
            <button
              onClick={() => blink.auth.login()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />
      case 'floorplan':
        return <FloorPlan />
      case 'devices':
        return <DeviceManagement />
      case 'media':
        return <MediaUpload />
      case 'analytics':
        return <Analytics />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 p-6">
        {renderContent()}
      </main>
      <Toaster />
    </div>
  )
}

export default App