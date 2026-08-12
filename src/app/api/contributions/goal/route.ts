import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const initialGoal = 50000
  const stretchGoal = 100000

  try {
    const supabaseAdmin = createServiceClient()

    // Aggregate completed billing transactions / contributions
    const { data: transactions, error } = await supabaseAdmin
      .from('billing_transactions')
      .select('amount')
      .eq('status', 'completed')

    if (error) {
      console.warn('Could not aggregate live contributions, using fallback zero base:', error.message)
      return NextResponse.json({
        totalRaised: 0,
        initialGoal,
        stretchGoal,
        contributorCount: 0,
        progressPercentage: 0,
        isLive: false,
      })
    }

    const totalRaised = (transactions || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
    const contributorCount = (transactions || []).length
    const progressPercentage = Math.min(100, Math.round((totalRaised / initialGoal) * 100))

    return NextResponse.json({
      totalRaised,
      initialGoal,
      stretchGoal,
      contributorCount,
      progressPercentage,
      isLive: true,
      lastUpdated: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Error fetching contribution goal:', err)
    return NextResponse.json({
      totalRaised: 0,
      initialGoal,
      stretchGoal,
      contributorCount: 0,
      progressPercentage: 0,
      isLive: false,
    })
  }
}
