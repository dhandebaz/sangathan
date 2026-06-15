export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      <span className="ml-4 text-gray-600">Preparing print layout...</span>
    </div>
  )
}
