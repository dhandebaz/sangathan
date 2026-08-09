export async function GET() {
  const key = process.env.INDEXNOW_KEY || 'sangathan_seo_indexnow_2026'

  return new Response(key, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
