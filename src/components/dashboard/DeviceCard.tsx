import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import { 
  Battery, 
  Trash2, 
  Wifi, 
  WifiOff, 
  AlertTriangle,
  Monitor,
  Upload
} from 'lucide-react'
import { AdPoint } from '../../types/device'
import { cn } from '../../lib/utils'

interface DeviceCardProps {
  device: AdPoint
  onUploadMedia?: (deviceId: string) => void
  onViewDetails?: (deviceId: string) => void
}

export function DeviceCard({ device, onUploadMedia, onViewDetails }: DeviceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'offline': return 'bg-red-500'
      case 'maintenance': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi className="h-4 w-4" />
      case 'offline': return <WifiOff className="h-4 w-4" />
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />
      default: return <Monitor className="h-4 w-4" />
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'bg-green-500'
    if (level > 20) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getCapacityColor = (level: number) => {
    if (level < 70) return 'bg-green-500'
    if (level < 90) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{device.name}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", getStatusColor(device.status))} />
            <Badge variant="secondary" className="text-xs">
              {getStatusIcon(device.status)}
              <span className="ml-1 capitalize">{device.status}</span>
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-500">ID: {device.id}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Battery Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4" />
              <span>Battery</span>
            </div>
            <span className="font-medium">{device.batteryLevel}%</span>
          </div>
          <Progress 
            value={device.batteryLevel} 
            className="h-2"
            style={{
              '--progress-background': getBatteryColor(device.batteryLevel)
            } as React.CSSProperties}
          />
        </div>

        {/* Capacity Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              <span>Capacity</span>
            </div>
            <span className="font-medium">{device.capacityLevel}%</span>
          </div>
          <Progress 
            value={device.capacityLevel} 
            className="h-2"
            style={{
              '--progress-background': getCapacityColor(device.capacityLevel)
            } as React.CSSProperties}
          />
        </div>

        {/* Media Content */}
        <div className="text-sm">
          <span className="text-gray-600">Media Files: </span>
          <span className="font-medium">{device.mediaContent?.length || 0}</span>
        </div>

        {/* Last Seen */}
        <div className="text-xs text-gray-500">
          Last seen: {new Date(device.lastSeen).toLocaleString()}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onUploadMedia?.(device.id)}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewDetails?.(device.id)}
          >
            <Monitor className="h-4 w-4 mr-1" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}