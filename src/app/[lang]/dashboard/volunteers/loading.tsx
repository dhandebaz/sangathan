export default function VolunteersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="h-8 w-48 bg-muted rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-muted rounded-md"></div>
        </div>
        <div className="h-10 w-36 bg-muted rounded-md"></div>
      </div>

      <div className="bg-card rounded-sm border border-border overflow-hidden shadow-sm mb-6">
        <div className="p-4 border-b border-border bg-muted">
          <div className="h-9 w-full sm:max-w-xs bg-background rounded-sm"></div>
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-muted"></div>
                <div className="h-4 w-32 bg-muted rounded-sm"></div>
              </div>
              <div className="h-4 w-40 bg-muted rounded-sm"></div>
              <div className="h-4 w-24 bg-muted rounded-sm"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
