import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border-orange-200">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Under Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p className="mb-4">
            Sangathan is currently undergoing scheduled maintenance to improve our services.
          </p>
          <p>
            We apologize for the inconvenience and will be back shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
