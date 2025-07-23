import { 
  LayoutDashboard, 
  Map, 
  Smartphone, 
  Upload, 
  BarChart3,
  Zap,
  Trash2
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'floorplan', label: 'Floor Plan', icon: Map },
  { id: 'devices', label: 'Devices', icon: Smartphone },
  { id: 'media', label: 'Media Upload', icon: Upload },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Smart Ad Points</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeView === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Trash2 className="w-3 h-3" />
          <span>Smart Bins Active</span>
        </div>
      </div>
    </div>
  )
}