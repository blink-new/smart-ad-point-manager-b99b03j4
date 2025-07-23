import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { DeviceCard } from './DeviceCard'
import { AdPoint } from '../../types/device'
import { blink } from '../../blink/client'
import { 
  Monitor, 
  Battery, 
  Trash2, 
  AlertTriangle,
  TrendingUp,
  Wifi
} from 'lucide-react'

export function Dashboard() {
  const [devices, setDevices] = useState<AdPoint[]>([])
  const [loading, setLoading] = useState(true)

  const loadDevices = async () => {
    try {
      // For now, use mock data until database is set up
      const mockDevices: AdPoint[] = [
        {
          id: 'AP001',
          name: 'Entrance Display',
          x: 100,
          y: 150,
          batteryLevel: 85,
          capacityLevel: 65,
          status: 'online',
          lastSeen: new Date().toISOString(),
          userId: 'user123',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          mediaContent: [
            { id: '1', name: 'promo.mp4', type: 'video', url: '', uploadedAt: new Date().toISOString() }
          ]
        },
        {
          id: 'AP002',
          name: 'Lobby Screen',
          x: 300,
          y: 200,
          batteryLevel: 92,
          capacityLevel: 30,
          status: 'online',
          lastSeen: new Date().toISOString(),
          userId: 'user123',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          mediaContent: []
        }
      ]
      setDevices(mockDevices)
    } catch (error) {
      console.error('Failed to load devices:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDevices()
  }, [])

  // Calculate stats
  const totalDevices = devices.length
  const onlineDevices = devices.filter(d => d.status === 'online').length
  const lowBatteryDevices = devices.filter(d => d.batteryLevel < 20).length
  const highCapacityDevices = devices.filter(d => d.capacityLevel > 80).length
  const avgBatteryLevel = devices.length > 0 
    ? Math.round(devices.reduce((sum, d) => sum + d.batteryLevel, 0) / devices.length)
    : 0

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Monitor your smart ad points in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              {onlineDevices} online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Battery</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgBatteryLevel}%</div>
            <p className="text-xs text-muted-foreground">
              {lowBatteryDevices} devices low
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Capacity</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highCapacityDevices}</div>
            <p className="text-xs text-muted-foreground">
              Need emptying
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Status</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {onlineDevices}/{totalDevices} online
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(lowBatteryDevices > 0 || highCapacityDevices > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowBatteryDevices > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="destructive">{lowBatteryDevices}</Badge>
                <span className="text-sm text-yellow-800">devices have low battery (&lt;20%)</span>
              </div>
            )}
            {highCapacityDevices > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="destructive">{highCapacityDevices}</Badge>
                <span className="text-sm text-yellow-800">devices need emptying (&gt;80% full)</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Devices */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Devices</h2>
        {devices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Monitor className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
              <p className="text-gray-500 text-center max-w-sm">
                Get started by adding your first smart ad point device to the system.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.slice(0, 6).map((device) => (
              <DeviceCard 
                key={device.id} 
                device={device}
                onUploadMedia={(deviceId) => console.log('Upload media to:', deviceId)}
                onViewDetails={(deviceId) => console.log('View details:', deviceId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}