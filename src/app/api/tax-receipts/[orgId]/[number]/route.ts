import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ orgId: string; number: string }> }
) {
  const { orgId, number } = await context.params
  // The stored pdf_url ends in ".pdf"; strip it so we match the DB row.
  const receiptNumber = number.replace(/\.pdf$/i, '')
  const supabase = createServiceClient()

  const { data: receipt } = await supabase
    .from('tax_receipts')
    .select(
      'id, receipt_number, receipt_date, financial_year, amount, donor_pan, organisations(id, name, slug), donors(id, first_name, last_name, email, phone)'
    )
    .eq('organisation_id', orgId)
    .eq('receipt_number', receiptNumber)
    .maybeSingle()

  if (!receipt) {
    return new NextResponse('Receipt not found', { status: 404 })
  }

  const orgName = (receipt.organisations as { name?: string } | null)?.name || 'Organisation'
  const donor = receipt.donors as { first_name?: string; last_name?: string | null; email?: string | null; phone?: string | null } | null
  const donorName = [donor?.first_name, donor?.last_name].filter(Boolean).join(' ') || 'Donor'
  const rupees = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(receipt.amount || 0)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Donation Receipt ${escapeHtml(receipt.receipt_number)}</title>
<style>
  * { box-sizing: border-box; }
  html { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
  body { margin: 0; padding: 40px 20px; background: #f1f5f9; color: #0f172a; }
  .sheet { max-width: 720px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 48px; }
  .brand { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 20px; }
  .brand h1 { margin: 0; font-size: 22px; letter-spacing: 0.02em; }
  .brand p { margin: 4px 0 0; color: #475569; font-size: 13px; }
  .fav { text-align: right; font-size: 13px; color: #475569; font-weight: 600; }
  .title { margin: 28px 0 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; }
  h2 { margin: 0 0 24px; font-size: 28px; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  td { padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 15px; }
  td.label { color: #475569; width: 42%; font-weight: 600; }
  td.value { text-align: right; font-weight: 600; }
  .amount { font-size: 20px; }
  .note { margin-top: 28px; padding: 14px 16px; background: #f8fafc; border-left: 3px solid #0f172a; color: #475569; font-size: 13px; line-height: 1.5; }
  .print-bar { max-width: 720px; margin: 20px auto 0; text-align: right; }
  .print-bar button { padding: 10px 20px; border: 1px solid #0f172a; background: #0f172a; color: #ffffff; font-size: 14px; font-weight: 600; border-radius: 6px; cursor: pointer; }
  @media print {
    body { background: #ffffff; padding: 16px; }
    .sheet { border: none; padding: 0; }
    .print-bar { display: none; }
  }
</style>
</head>
<body>
  <div class="print-bar"><button onclick="window.print()">Print / Save as PDF</button></div>
  <div class="sheet">
    <div class="brand">
      <div>
        <h1>${escapeHtml(orgName)}</h1>
        <p>Donation receipt</p>
      </div>
      <div class="fav">Receipt No.<br />${escapeHtml(receipt.receipt_number)}</div>
    </div>

    <div class="title">Receipt of Donation</div>
    <h2>${rupees}</h2>

    <table>
      <tr><td class="label">Donated by</td><td class="value">${escapeHtml(donorName)}</td></tr>
      <tr><td class="label">Date</td><td class="value">${escapeHtml(receipt.receipt_date || '')}</td></tr>
      <tr><td class="label">Financial year</td><td class="value">${escapeHtml(receipt.financial_year || '')}</td></tr>
      ${receipt.donor_pan ? `<tr><td class="label">PAN</td><td class="value">${escapeHtml(receipt.donor_pan)}</td></tr>` : ''}
    </table>

    <div class="note">
      This receipt is 80G/12A-ready. It can be marked as an 80G tax receipt only when the organisation holds its own 80G registration. Please retain this document for your records.
    </div>
  </div>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, max-age=300' },
  })
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}