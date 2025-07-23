export interface AdPoint {
  id: string
  name: string
  x: number
  y: number
  batteryLevel: number
  capacityLevel: number
  status: 'online' | 'offline' | 'maintenance'
  lastSeen: string
  mediaContent?: {
    id: string
    name: string
    type: 'image' | 'video'
    url: string
    uploadedAt: string
  }[]
  userId: string
  createdAt: string
  updatedAt: string
}

export interface FloorPlan {
  id: string
  name: string
  width: number
  height: number
  backgroundImage?: string
  userId: string
  createdAt: string
}