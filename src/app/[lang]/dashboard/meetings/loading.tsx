export default function MeetingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="h-8 w-48 bg-muted rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-muted rounded-md"></div>
        </div>
        <div className="h-10 w-40 bg-muted rounded-md"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-card border border-border rounded-sm space-y-2">
            <div className="h-4 w-24 bg-muted rounded-xs"></div>
            <div className="h-7 w-12 bg-muted rounded-xs"></div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-3 rounded-sm border border-border">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-20 bg-muted rounded-sm"></div>
          ))}
        </div>
        <div className="h-9 w-full sm:max-w-xs bg-muted rounded-sm"></div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-card border border-border rounded-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-6 w-56 bg-muted rounded-xs"></div>
                <div className="h-4 w-40 bg-muted rounded-xs"></div>
              </div>
              <div className="h-6 w-20 bg-muted rounded-sm"></div>
            </div>
            <div className="h-10 w-full bg-muted/40 rounded-sm"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
