import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Upload } from 'lucide-react'

export function MediaUpload() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Media Upload</h1>
        <p className="text-muted-foreground">
          Upload and manage digital content for your advertisement points
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Content Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Media Upload</h3>
            <p className="text-muted-foreground">
              Drag-and-drop media upload and content management features coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}