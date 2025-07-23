import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MapPin, 
  Battery, 
  Trash2, 
  Pencil, 
  Square, 
  Type, 
  Move,
  Eraser,
  Save,
  Undo,
  Redo
} from 'lucide-react'

interface Device {
  id: string
  name: string
  x: number
  y: number
  batteryLevel: number
  capacityLevel: number
  status: 'online' | 'offline' | 'warning'
  type: 'ad-point' | 'smart-bin'
}

interface Wall {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  thickness: number
  color: string
}

interface TextLabel {
  id: string
  x: number
  y: number
  text: string
  fontSize: number
  color: string
}

interface DrawingState {
  walls: Wall[]
  textLabels: TextLabel[]
}

type DrawingTool = 'select' | 'wall' | 'text' | 'eraser'

const FloorPlan: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'AP-001', x: 150, y: 100, batteryLevel: 85, capacityLevel: 30, status: 'online', type: 'ad-point' },
    { id: '2', name: 'AP-002', x: 400, y: 200, batteryLevel: 45, capacityLevel: 75, status: 'warning', type: 'ad-point' },
    { id: '3', name: 'SB-001', x: 300, y: 350, batteryLevel: 92, capacityLevel: 20, status: 'online', type: 'smart-bin' },
    { id: '4', name: 'AP-003', x: 600, y: 150, batteryLevel: 15, capacityLevel: 90, status: 'warning', type: 'ad-point' },
    { id: '5', name: 'SB-002', x: 500, y: 400, batteryLevel: 78, capacityLevel: 55, status: 'online', type: 'smart-bin' },
  ])

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  
  // Drawing state
  const [currentTool, setCurrentTool] = useState<DrawingTool>('select')
  const [drawingState, setDrawingState] = useState<DrawingState>({
    walls: [],
    textLabels: []
  })
  const [history, setHistory] = useState<DrawingState[]>([{ walls: [], textLabels: [] }])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  // Drawing interaction state
  const [isDrawingWall, setIsDrawingWall] = useState(false)
  const [currentWall, setCurrentWall] = useState<Partial<Wall> | null>(null)
  const [isAddingText, setIsAddingText] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })
  
  // Drawing settings
  const [wallThickness, setWallThickness] = useState(4)
  const [wallColor, setWallColor] = useState('#374151')
  const [textSize, setTextSize] = useState(14)
  const [textColor, setTextColor] = useState('#1f2937')

  const svgRef = useRef<SVGSVGElement>(null)

  // Distance from point to line (for eraser tool)
  const distanceToLine = useCallback((px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const A = px - x1
    const B = py - y1
    const C = x2 - x1
    const D = y2 - y1

    const dot = A * C + B * D
    const lenSq = C * C + D * D
    let param = -1
    if (lenSq !== 0) param = dot / lenSq

    let xx, yy
    if (param < 0) {
      xx = x1
      yy = y1
    } else if (param > 1) {
      xx = x2
      yy = y2
    } else {
      xx = x1 + param * C
      yy = y1 + param * D
    }

    const dx = px - xx
    const dy = py - yy
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // Save state to history
  const saveToHistory = useCallback((newState: DrawingState) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setDrawingState(newState)
  }, [history, historyIndex])

  // Undo/Redo functions
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setDrawingState(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setDrawingState(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  // Get SVG coordinates from mouse event
  const getSVGCoordinates = useCallback((event: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    
    const x = (event.clientX - rect.left - pan.x) / zoom
    const y = (event.clientY - rect.top - pan.y) / zoom
    return { x, y }
  }, [zoom, pan])

  // Device interaction handlers
  const handleDeviceMouseDown = useCallback((device: Device, event: React.MouseEvent) => {
    if (currentTool !== 'select') return
    
    event.preventDefault()
    event.stopPropagation()
    setSelectedDevice(device)
    setIsDragging(true)
    
    const coords = getSVGCoordinates(event)
    setDragOffset({
      x: coords.x - device.x,
      y: coords.y - device.y
    })
  }, [currentTool, getSVGCoordinates])

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (currentTool === 'select' && isDragging && selectedDevice) {
      const coords = getSVGCoordinates(event)
      const x = coords.x - dragOffset.x
      const y = coords.y - dragOffset.y

      setDevices(prev => prev.map(device => 
        device.id === selectedDevice.id 
          ? { ...device, x: Math.max(20, Math.min(780, x)), y: Math.max(20, Math.min(580, y)) }
          : device
      ))
    } else if (currentTool === 'wall' && isDrawingWall && currentWall) {
      const coords = getSVGCoordinates(event)
      setCurrentWall(prev => prev ? { ...prev, x2: coords.x, y2: coords.y } : null)
    }
  }, [currentTool, isDragging, selectedDevice, isDrawingWall, currentWall, getSVGCoordinates, dragOffset])

  const handleMouseUp = useCallback(() => {
    if (currentTool === 'select') {
      setIsDragging(false)
      setDragOffset({ x: 0, y: 0 })
    } else if (currentTool === 'wall' && isDrawingWall && currentWall) {
      // Complete wall drawing
      const newWall: Wall = {
        id: `wall-${Date.now()}`,
        x1: currentWall.x1!,
        y1: currentWall.y1!,
        x2: currentWall.x2!,
        y2: currentWall.y2!,
        thickness: wallThickness,
        color: wallColor
      }
      
      const newState = {
        ...drawingState,
        walls: [...drawingState.walls, newWall]
      }
      saveToHistory(newState)
      
      setIsDrawingWall(false)
      setCurrentWall(null)
    }
  }, [currentTool, isDrawingWall, currentWall, wallThickness, wallColor, drawingState, saveToHistory])

  // Canvas click handler
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    const coords = getSVGCoordinates(event)
    
    if (currentTool === 'wall' && !isDrawingWall) {
      // Start drawing wall
      setIsDrawingWall(true)
      setCurrentWall({
        x1: coords.x,
        y1: coords.y,
        x2: coords.x,
        y2: coords.y
      })
    } else if (currentTool === 'text') {
      // Start adding text
      setIsAddingText(true)
      setTextPosition(coords)
      setTextInput('')
    } else if (currentTool === 'eraser') {
      // Erase elements at click position
      const clickRadius = 10
      
      const newWalls = drawingState.walls.filter(wall => {
        // Check if click is near the wall line
        const distance = distanceToLine(coords.x, coords.y, wall.x1, wall.y1, wall.x2, wall.y2)
        return distance > clickRadius
      })
      
      const newTextLabels = drawingState.textLabels.filter(label => {
        const distance = Math.sqrt(Math.pow(coords.x - label.x, 2) + Math.pow(coords.y - label.y, 2))
        return distance > clickRadius
      })
      
      if (newWalls.length !== drawingState.walls.length || newTextLabels.length !== drawingState.textLabels.length) {
        const newState = { walls: newWalls, textLabels: newTextLabels }
        saveToHistory(newState)
      }
    }
  }, [currentTool, isDrawingWall, getSVGCoordinates, drawingState.walls, drawingState.textLabels, distanceToLine, saveToHistory])

  // Add text label
  const addTextLabel = useCallback(() => {
    if (textInput.trim()) {
      const newLabel: TextLabel = {
        id: `text-${Date.now()}`,
        x: textPosition.x,
        y: textPosition.y,
        text: textInput.trim(),
        fontSize: textSize,
        color: textColor
      }
      
      const newState = {
        ...drawingState,
        textLabels: [...drawingState.textLabels, newLabel]
      }
      saveToHistory(newState)
    }
    
    setIsAddingText(false)
    setTextInput('')
  }, [textInput, textPosition, textSize, textColor, drawingState, saveToHistory])

  // Tool selection
  const selectTool = useCallback((tool: DrawingTool) => {
    setCurrentTool(tool)
    setIsDrawingWall(false)
    setCurrentWall(null)
    setIsAddingText(false)
    setSelectedDevice(null)
  }, [])

  const getDeviceColor = (device: Device) => {
    if (device.status === 'offline') return '#ef4444'
    if (device.status === 'warning') return '#f59e0b'
    return device.type === 'ad-point' ? '#2563eb' : '#10b981'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const zoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3))
  const zoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5))
  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Floor Plan</h1>
          <p className="text-gray-600 mt-1">Interactive device location management with drawing tools</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex === 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex === history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button variant="outline" size="sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={resetView}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Drawing Tools */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Drawing Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            {/* Tool Selection */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={currentTool === 'select' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => selectTool('select')}
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button
                variant={currentTool === 'wall' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => selectTool('wall')}
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                variant={currentTool === 'text' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => selectTool('text')}
              >
                <Type className="h-4 w-4" />
              </Button>
              <Button
                variant={currentTool === 'eraser' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => selectTool('eraser')}
              >
                <Eraser className="h-4 w-4" />
              </Button>
            </div>

            {/* Wall Settings */}
            {currentTool === 'wall' && (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Thickness:</label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={wallThickness}
                    onChange={(e) => setWallThickness(Number(e.target.value))}
                    className="w-16 h-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Color:</label>
                  <input
                    type="color"
                    value={wallColor}
                    onChange={(e) => setWallColor(e.target.value)}
                    className="w-8 h-8 rounded border"
                  />
                </div>
              </>
            )}

            {/* Text Settings */}
            {currentTool === 'text' && (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Size:</label>
                  <Input
                    type="number"
                    min="8"
                    max="48"
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    className="w-16 h-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Color:</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded border"
                  />
                </div>
              </>
            )}

            <div className="text-sm text-gray-500 ml-auto">
              {currentTool === 'select' && 'Click and drag devices to move them'}
              {currentTool === 'wall' && 'Click to start drawing, click again to finish'}
              {currentTool === 'text' && 'Click where you want to add text'}
              {currentTool === 'eraser' && 'Click on walls or text to delete them'}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Floor Plan Canvas */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Interactive Floor Plan
                <Badge variant="outline" className="ml-2">
                  {currentTool === 'select' ? 'Select Mode' : 
                   currentTool === 'wall' ? 'Drawing Walls' :
                   currentTool === 'text' ? 'Adding Text' : 'Eraser Mode'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-[520px] overflow-hidden bg-gray-50 rounded-b-lg">
                <svg
                  ref={svgRef}
                  className={`w-full h-full ${
                    currentTool === 'select' ? 'cursor-move' :
                    currentTool === 'wall' ? 'cursor-crosshair' :
                    currentTool === 'text' ? 'cursor-text' :
                    'cursor-pointer'
                  }`}
                  viewBox="0 0 800 600"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onClick={handleCanvasClick}
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
                  }}
                >
                  {/* Floor Plan Background */}
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="800" height="600" fill="url(#grid)" />
                  
                  {/* Drawn Walls */}
                  {drawingState.walls.map((wall) => (
                    <line
                      key={wall.id}
                      x1={wall.x1}
                      y1={wall.y1}
                      x2={wall.x2}
                      y2={wall.y2}
                      stroke={wall.color}
                      strokeWidth={wall.thickness}
                      strokeLinecap="round"
                    />
                  ))}

                  {/* Current Wall Being Drawn */}
                  {currentWall && (
                    <line
                      x1={currentWall.x1}
                      y1={currentWall.y1}
                      x2={currentWall.x2}
                      y2={currentWall.y2}
                      stroke={wallColor}
                      strokeWidth={wallThickness}
                      strokeLinecap="round"
                      opacity="0.7"
                      strokeDasharray="5,5"
                    />
                  )}

                  {/* Text Labels */}
                  {drawingState.textLabels.map((label) => (
                    <text
                      key={label.id}
                      x={label.x}
                      y={label.y}
                      fill={label.color}
                      fontSize={label.fontSize}
                      fontFamily="Inter, sans-serif"
                      fontWeight="500"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {label.text}
                    </text>
                  ))}

                  {/* Devices */}
                  {devices.map((device) => (
                    <g key={device.id}>
                      {/* Device Marker */}
                      <circle
                        cx={device.x}
                        cy={device.y}
                        r="20"
                        fill={getDeviceColor(device)}
                        stroke="white"
                        strokeWidth="3"
                        className={`${currentTool === 'select' ? 'cursor-pointer hover:opacity-80' : 'pointer-events-none'} transition-opacity`}
                        onMouseDown={(e) => handleDeviceMouseDown(device, e)}
                      />
                      
                      {/* Device Icon */}
                      {device.type === 'ad-point' ? (
                        <rect
                          x={device.x - 8}
                          y={device.y - 8}
                          width="16"
                          height="16"
                          fill="white"
                          rx="2"
                          className="pointer-events-none"
                        />
                      ) : (
                        <circle
                          cx={device.x}
                          cy={device.y}
                          r="8"
                          fill="white"
                          className="pointer-events-none"
                        />
                      )}
                      
                      {/* Device Label */}
                      <text
                        x={device.x}
                        y={device.y + 35}
                        textAnchor="middle"
                        className="fill-gray-700 text-xs font-medium pointer-events-none"
                      >
                        {device.name}
                      </text>
                      
                      {/* Status Indicator */}
                      <circle
                        cx={device.x + 15}
                        cy={device.y - 15}
                        r="5"
                        fill={device.status === 'online' ? '#10b981' : device.status === 'warning' ? '#f59e0b' : '#ef4444'}
                        stroke="white"
                        strokeWidth="2"
                        className="pointer-events-none"
                      />
                    </g>
                  ))}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Details Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Device Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDevice ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedDevice.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {selectedDevice.type === 'ad-point' ? 'Ad Point' : 'Smart Bin'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge className={getStatusColor(selectedDevice.status)}>
                        {selectedDevice.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Battery className="h-3 w-3" />
                          Battery
                        </span>
                        <span className="text-sm font-medium">{selectedDevice.batteryLevel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedDevice.batteryLevel > 50 ? 'bg-green-500' : 
                            selectedDevice.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedDevice.batteryLevel}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Trash2 className="h-3 w-3" />
                          Capacity
                        </span>
                        <span className="text-sm font-medium">{selectedDevice.capacityLevel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedDevice.capacityLevel < 70 ? 'bg-green-500' : 
                            selectedDevice.capacityLevel < 90 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedDevice.capacityLevel}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="text-sm text-gray-600">Position</div>
                      <div className="text-sm font-mono">
                        X: {Math.round(selectedDevice.x)}, Y: {Math.round(selectedDevice.y)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Click on a device to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Drawing Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Drawing Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Walls</span>
                <span className="text-sm font-medium">{drawingState.walls.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Text Labels</span>
                <span className="text-sm font-medium">{drawingState.textLabels.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Devices</span>
                <span className="text-sm font-medium">{devices.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Device Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <span className="text-sm">Ad Point</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                <span className="text-sm">Smart Bin</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Online</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Warning</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Offline</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Text Input Modal */}
      {isAddingText && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Add Text Label</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && addTextLabel()}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingText(false)}>
                  Cancel
                </Button>
                <Button onClick={addTextLabel} disabled={!textInput.trim()}>
                  Add Text
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default FloorPlan