import { NextRequest, NextResponse } from 'next/server'

const SUPPORTED_SERVICES = [
  'pan/verify', 'gstin/verify', 'cin/verify', 'darpan/sync',
  'fcra/status', 'lgd/lookup', 'digilocker/connect', 'epfo/verify',
] as const

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string; service: string }> }
) {
  const { orgId, service } = await params
  
  return NextResponse.json(
    {
      status: 'not_implemented',
      service,
      orgId,
      message: `Government API integration for '${service}' is pending. This endpoint is reserved for future integration.`,
      availableServices: SUPPORTED_SERVICES,
    },
    { status: 501 }
  )
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string; service: string }> }
) {
  const { orgId, service } = await params
  
  return NextResponse.json(
    {
      status: 'not_implemented',
      service,
      orgId,
      message: `Government API integration for '${service}' is pending. This endpoint is reserved for future integration.`,
      availableServices: SUPPORTED_SERVICES,
    },
    { status: 501 }
  )
}
