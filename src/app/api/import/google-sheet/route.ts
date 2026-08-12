import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: { session } } = await supabase.auth.getSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sheetUrl, useApi } = await request.json()

    if (!sheetUrl || typeof sheetUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid Google Sheet URL' }, { status: 400 })
    }

    const providerToken = session?.provider_token

    if (useApi && providerToken) {
      try {
        const matchId = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
        if (matchId) {
          const spreadsheetId = matchId[1]
          let sheetName = 'Sheet1'
          
          const gidMatch = sheetUrl.match(/[?&#]gid=([0-9]+)/)
          if (gidMatch) {
            const gid = gidMatch[1]
            const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
              headers: { Authorization: `Bearer ${providerToken}` }
            })
            
            if (metaRes.ok) {
              const meta = await metaRes.json()
              const sheet = meta.sheets?.find((s: any) => s.properties?.sheetId?.toString() === gid)
              if (sheet?.properties?.title) {
                sheetName = sheet.properties.title
              }
            } else if (metaRes.status === 401 || metaRes.status === 403) {
              throw new Error('API Auth Failed')
            }
          }
          
          const valuesRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}`, {
            headers: { Authorization: `Bearer ${providerToken}` }
          })
          
          if (valuesRes.ok) {
            const valuesData = await valuesRes.json()
            const rows = valuesData.values || []
            
            const csvContent = rows.map((row: any[]) => row.map(cell => {
              const cellStr = String(cell || '')
              if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return `"${cellStr.replace(/"/g, '""')}"`
              }
              return cellStr
            }).join(',')).join('\n')
            
            return NextResponse.json({ success: true, csvContent, source: 'api' })
          } else if (valuesRes.status === 401 || valuesRes.status === 403) {
            throw new Error('API Auth Failed')
          }
        }
      } catch (err) {
        // Fall back to public fetch on API failure
      }
    }

    // Extract Google Sheet ID
    // Formats:
    // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
    // https://docs.google.com/spreadsheets/d/e/2PACX-SPREADSHEET_ID/pubhtml
    const matchId = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    const matchPub = sheetUrl.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)\//)

    let exportUrl = sheetUrl

    if (matchPub) {
      // Published web sheet
      exportUrl = `https://docs.google.com/spreadsheets/d/e/${matchPub[1]}/pub?output=csv`
    } else if (matchId) {
      // Standard sheet with ID
      const sheetId = matchId[1]
      // Check for gid (specific tab)
      const gidMatch = sheetUrl.match(/[?&#]gid=([0-9]+)/)
      const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : ''
      exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gidParam}`
    }

    const response = await fetch(exportUrl, {
      headers: {
        'User-Agent': 'Sangathan-Sheet-Importer/1.0',
      },
    })

    if (!response.ok) {
      return NextResponse.json({
        error: 'Unable to access the Google Sheet. Please ensure the sheet sharing is set to "Anyone with the link can view".',
      }, { status: 400 })
    }

    const csvContent = await response.text()

    if (!csvContent || csvContent.includes('<!DOCTYPE html>') || csvContent.includes('<html')) {
      return NextResponse.json({
        error: 'The link returned a web page instead of CSV data. Please ensure the sheet is shared as "Anyone with link" or published to web.',
      }, { status: 400 })
    }

    return NextResponse.json({ success: true, csvContent, source: 'public' })
  } catch (err: unknown) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Failed to fetch Google Sheet',
    }, { status: 500 })
  }
}
