/**
 * GST invoice math (prices are GST-inclusive) + deterministic invoice numbers.
 * Seller is assumed Delhi-based (BILLING_SELLER_STATE, default 'DL'):
 * buyer in Delhi → CGST 9% + SGST 9%, else IGST 18%.
 */

export interface GstSplit {
  subtotal: number
  cgst: number
  sgst: number
  igst: number
  total: number
}

const round2 = (n: number) => Math.round(n * 100) / 100

export function isDelhiBuyer(buyerState?: string | null): boolean {
  if (!buyerState) return false
  const s = buyerState.toLowerCase()
  return s.includes('delhi') || s === 'dl' || s.includes('new delhi') || s.includes('nct')
}

export function splitGst(totalInclGst: number, buyerState?: string | null): GstSplit {
  const total = round2(totalInclGst)
  const subtotal = round2(total / 1.18)
  const gst = round2(total - subtotal)
  if (isDelhiBuyer(buyerState)) {
    const half = round2(gst / 2)
    return { subtotal, cgst: half, sgst: round2(gst - half), igst: 0, total }
  }
  return { subtotal, cgst: 0, sgst: 0, igst: gst, total }
}

/** Deterministic, human-friendly invoice no derived from the transaction id. */
export function invoiceNoFor(date: Date | string, transactionId: string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const short = (transactionId || 'xxxxxxxx').replace(/-/g, '').slice(0, 8).toUpperCase()
  return `SANG-${year}-${short}`
}

export function sellerInfo(): { name: string; address: string; state: string; gstin: string } {
  return {
    name: process.env.BILLING_SELLER_NAME || 'Bahujan Queer Foundation',
    address:
      process.env.BILLING_SELLER_ADDRESS ||
      'Street 8, Ghaffar Manzil, Jamia Nagar, Okhla, New Delhi 110025, India',
    state: process.env.BILLING_SELLER_STATE || 'DL',
    gstin: process.env.BILLING_SELLER_GSTIN || '',
  }
}
