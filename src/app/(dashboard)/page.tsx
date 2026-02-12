export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="content-card rounded-lg">
          <h3 className="font-bold text-gray-500 uppercase text-sm">Total Members</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  )
}
