import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  Smartphone, 
  Battery, 
  Trash2, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

// Mock data for demonstration
const mockDevices = [
  {
    id: 'AP001',
    name: 'Entrance Display',
    location: 'Main Entrance',
    battery: 85,
    capacity: 65,
    status: 'online',
    lastSeen: '2 minutes ago',
    mediaCount: 3
  },
  {
    id: 'AP002',
    name: 'Lobby Screen',
    location: 'Reception Lobby',
    battery: 92,
    capacity: 30,
    status: 'online',
    lastSeen: '1 minute ago',
    mediaCount: 5
  },
  {
    id: 'AP003',
    name: 'Cafeteria Point',
    location: 'Employee Cafeteria',
    battery: 23,
    capacity: 88,
    status: 'warning',
    lastSeen: '5 minutes ago',
    mediaCount: 2
  },
  {
    id: 'AP004',
    name: 'Exit Display',
    location: 'Emergency Exit',
    battery: 78,
    capacity: 95,
    status: 'critical',
    lastSeen: '3 minutes ago',
    mediaCount: 1
  }
]

export function DashboardOverview() {
  const [devices, setDevices] = useState(mockDevices)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-accent text-accent-foreground'
      case 'warning':
        return 'bg-yellow-500 text-white'
      case 'critical':
        return 'bg-destructive text-destructive-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'bg-accent'
    if (level > 20) return 'bg-yellow-500'
    return 'bg-destructive'
  }

  const getCapacityColor = (level: number) => {
    if (level < 70) return 'bg-accent'
    if (level < 90) return 'bg-yellow-500'
    return 'bg-destructive'
  }

  const totalDevices = devices.length
  const onlineDevices = devices.filter(d => d.status === 'online').length
  const warningDevices = devices.filter(d => d.status === 'warning').length
  const criticalDevices = devices.filter(d => d.status === 'critical').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your smart advertisement points and bin capacity in real-time
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              Active advertisement points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <Wifi className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{onlineDevices}</div>
            <p className="text-xs text-muted-foreground">
              Devices connected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningDevices}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalDevices}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Device Status Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Device Status</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {devices.map((device) => (
            <Card key={device.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{device.location}</p>
                  </div>
                  <Badge className={getStatusColor(device.status)}>
                    {getStatusIcon(device.status)}
                    <span className="ml-1 capitalize">{device.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Battery className="w-4 h-4" />
                      <span className="text-sm font-medium">Battery</span>
                      <span className="text-sm text-muted-foreground">{device.battery}%</span>
                    </div>
                    <Progress 
                      value={device.battery} 
                      className="h-2"
                      style={{
                        '--progress-background': getBatteryColor(device.battery)
                      } as any}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Capacity</span>
                      <span className="text-sm text-muted-foreground">{device.capacity}%</span>
                    </div>
                    <Progress 
                      value={device.capacity} 
                      className="h-2"
                      style={{
                        '--progress-background': getCapacityColor(device.capacity)
                      } as any}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Last seen: {device.lastSeen}</span>
                  <span>{device.mediaCount} media files</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}