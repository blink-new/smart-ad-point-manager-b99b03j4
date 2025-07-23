import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Battery, 
  Trash2, 
  Wifi, 
  AlertTriangle,
  Download,
  Calendar,
  Users,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  totalDevices: number
  onlineDevices: number
  avgBatteryLevel: number
  avgCapacityLevel: number
  alertsToday: number
  mediaUploadsToday: number
}

interface ChartData {
  name: string
  battery: number
  capacity: number
  uptime: number
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h')
  
  const analyticsData: AnalyticsData = {
    totalDevices: 12,
    onlineDevices: 10,
    avgBatteryLevel: 73,
    avgCapacityLevel: 45,
    alertsToday: 3,
    mediaUploadsToday: 28
  }

  const chartData: ChartData[] = [
    { name: 'Mon', battery: 85, capacity: 30, uptime: 98 },
    { name: 'Tue', battery: 82, capacity: 45, uptime: 95 },
    { name: 'Wed', battery: 78, capacity: 52, uptime: 99 },
    { name: 'Thu', battery: 75, capacity: 38, uptime: 97 },
    { name: 'Fri', battery: 73, capacity: 65, uptime: 94 },
    { name: 'Sat', battery: 71, capacity: 42, uptime: 98 },
    { name: 'Sun', battery: 69, capacity: 35, uptime: 99 }
  ]

  const devicePerformance = [
    { id: 'AP-001', name: 'Reception Ad Point', battery: 85, capacity: 30, uptime: 99.2, alerts: 0 },
    { id: 'AP-002', name: 'Lobby Ad Point', battery: 45, capacity: 75, uptime: 87.5, alerts: 2 },
    { id: 'SB-001', name: 'Main Hall Bin', battery: 92, capacity: 20, uptime: 98.8, alerts: 0 },
    { id: 'AP-003', name: 'Entrance Ad Point', battery: 15, capacity: 90, uptime: 65.2, alerts: 5 },
    { id: 'SB-002', name: 'Cafeteria Bin', battery: 78, capacity: 55, uptime: 95.1, alerts: 1 }
  ]

  const recentAlerts = [
    { id: 1, device: 'AP-003', type: 'Low Battery', severity: 'high', time: '2 hours ago' },
    { id: 2, device: 'AP-002', type: 'High Capacity', severity: 'medium', time: '4 hours ago' },
    { id: 3, device: 'SB-002', type: 'Connection Lost', severity: 'high', time: '6 hours ago' },
    { id: 4, device: 'AP-001', type: 'Maintenance Due', severity: 'low', time: '1 day ago' }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getPerformanceColor = (value: number, type: 'battery' | 'capacity' | 'uptime') => {
    if (type === 'battery') {
      return value > 50 ? 'text-green-600' : value > 20 ? 'text-yellow-600' : 'text-red-600'
    }
    if (type === 'capacity') {
      return value < 70 ? 'text-green-600' : value < 90 ? 'text-yellow-600' : 'text-red-600'
    }
    if (type === 'uptime') {
      return value > 95 ? 'text-green-600' : value > 85 ? 'text-yellow-600' : 'text-red-600'
    }
    return 'text-gray-600'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Performance insights and device metrics</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="text-xs"
              >
                {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Devices</p>
                <p className="text-2xl font-bold">{analyticsData.totalDevices}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online</p>
                <p className="text-2xl font-bold text-green-600">{analyticsData.onlineDevices}</p>
              </div>
              <Wifi className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Battery</p>
                <p className="text-2xl font-bold text-blue-600">{analyticsData.avgBatteryLevel}%</p>
              </div>
              <Battery className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Capacity</p>
                <p className="text-2xl font-bold text-orange-600">{analyticsData.avgCapacityLevel}%</p>
              </div>
              <Trash2 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alerts Today</p>
                <p className="text-2xl font-bold text-red-600">{analyticsData.alertsToday}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Media Uploads</p>
                <p className="text-2xl font-bold text-purple-600">{analyticsData.mediaUploadsToday}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={data.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.name}</span>
                    <div className="flex gap-4 text-xs">
                      <span className="text-blue-600">Battery: {data.battery}%</span>
                      <span className="text-orange-600">Capacity: {data.capacity}%</span>
                      <span className="text-green-600">Uptime: {data.uptime}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {/* Battery Bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-gray-600">Battery</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${data.battery}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Capacity Bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-gray-600">Capacity</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-orange-500 rounded-full transition-all duration-300"
                          style={{ width: `${data.capacity}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Uptime Bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-gray-600">Uptime</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-green-500 rounded-full transition-all duration-300"
                          style={{ width: `${data.uptime}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`} />
                    <div>
                      <p className="font-medium text-sm">{alert.type}</p>
                      <p className="text-xs text-gray-600">{alert.device}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {alert.severity}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Device Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Device</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Battery</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Capacity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Uptime</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Alerts</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {devicePerformance.map((device) => (
                  <tr key={device.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-gray-600">{device.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${getPerformanceColor(device.battery, 'battery')}`}>
                          {device.battery}%
                        </span>
                        {device.battery < 20 && <TrendingDown className="h-4 w-4 text-red-500" />}
                        {device.battery > 80 && <TrendingUp className="h-4 w-4 text-green-500" />}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getPerformanceColor(device.capacity, 'capacity')}`}>
                        {device.capacity}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getPerformanceColor(device.uptime, 'uptime')}`}>
                        {device.uptime}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {device.alerts > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {device.alerts}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          0
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        className={
                          device.uptime > 95 ? 'bg-green-500' : 
                          device.uptime > 85 ? 'bg-yellow-500' : 'bg-red-500'
                        }
                      >
                        {device.uptime > 95 ? 'Excellent' : device.uptime > 85 ? 'Good' : 'Poor'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics