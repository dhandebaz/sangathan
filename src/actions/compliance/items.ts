'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { COMPLIANCE_RULES, OrgMetrics } from '@/lib/compliance-engine/rules'

export type ComplianceItemRow = {
  id: string
  organisation_id: string
  category: string
  title: string
  description: string | null
  status: string
  due_date: string | null
  document_url: string | null
  document_name: string | null
  document_size: number | null
  notes: string | null
  created_at: string
  updated_at: string
  registration_link?: string
}

import { createServiceClient } from '@/lib/supabase/service'

async function evaluateComplianceRecommendations(orgId: string, orgType: string) {
  const adminClient = createServiceClient()

  // 1. Fetch real usage metrics
  const { count: memberCount } = await adminClient
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('organisation_id', orgId)

  const { count: eventCount } = await adminClient
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('organisation_id', orgId)

  const { data: donations } = await adminClient
    .from('donations')
    .select('amount, currency')
    .eq('organisation_id', orgId)

  const totalDonations = donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0
  const hasForeignDonations = donations?.some(d => d.currency && d.currency !== 'INR') || false

  const metrics: OrgMetrics = {
    memberCount: memberCount || 0,
    totalDonations: totalDonations,
    eventCount: eventCount || 0,
    hasForeignDonations,
    hasPaidTickets: false
  }

  // 2. Determine required items based on rules
  const requiredRuleIds: string[] = []
  for (const rule of COMPLIANCE_RULES) {
    const isApplicableType = rule.orgTypes.includes('all') || rule.orgTypes.includes(orgType.toLowerCase())
    if (isApplicableType && rule.condition(metrics)) {
      requiredRuleIds.push(rule.id)
    }
  }

  // 3. Fetch existing items
  const { data: existingItems } = await adminClient
    .from('compliance_items')
    .select('title')
    .eq('organisation_id', orgId)

  const existingTitles = new Set(existingItems?.map(i => i.title) || [])

  // 4. Insert missing items
  for (const ruleId of requiredRuleIds) {
    const rule = COMPLIANCE_RULES.find(r => r.id === ruleId)
    if (rule && !existingTitles.has(rule.title)) {
      await adminClient.from('compliance_items').insert({
        organisation_id: orgId,
        title: rule.title,
        category: rule.category,
        description: rule.description,
        status: 'not_started'
      })
    }
  }
}

export async function getComplianceItems(orgId: string): Promise<ComplianceItemRow[]> {
  const supabase = await createClient()

  // Ensure AI Engine evaluates rules before fetching
  const { data: orgData } = await supabase
    .from('organisations')
    .select('org_type')
    .eq('id', orgId)
    .single()

  await evaluateComplianceRecommendations(orgId, orgData?.org_type || 'ngo')

  const { data, error } = await supabase
    .from('compliance_items')
    .select('*')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching compliance items:', error)
    return []
  }

  // Enrich with registration_links from rules
  const enrichedData = data.map((item: ComplianceItemRow) => {
    const matchingRule = COMPLIANCE_RULES.find(r => r.title === item.title)
    if (matchingRule?.registration_link) {
      item.registration_link = matchingRule.registration_link
    }
    return item
  })

  return enrichedData || []
}

export async function updateComplianceItemStatus(
  itemId: string,
  status: string,
  notes?: string | null
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const updateData: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (notes !== undefined) updateData.notes = notes

  const { error } = await supabase
    .from('compliance_items')
    .update(updateData)
    .eq('id', itemId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/[lang]/dashboard/compliance')
  return { success: true }
}

export async function deleteComplianceItem(itemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('compliance_items')
    .delete()
    .eq('id', itemId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/[lang]/dashboard/compliance')
  return { success: true }
}

export async function uploadComplianceDocument(itemId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  if (!profile?.organisation_id || !['admin', 'executive'].includes(profile.role)) {
    return { success: false, error: 'Unauthorized' }
  }

  const file = formData.get('file') as File
  if (!file) return { success: false, error: 'No file provided' }

  if (file.size > 10 * 1024 * 1024) return { success: false, error: 'File exceeds 10MB limit' }

  const fileExt = file.name.split('.').pop()
  const fileName = `compliance_${itemId}_${Date.now()}.${fileExt}`
  const filePath = `${profile.organisation_id}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('compliance_docs')
    .upload(filePath, file, { upsert: true })

  if (uploadError) return { success: false, error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from('compliance_docs')
    .getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from('compliance_items')
    .update({
      document_url: publicUrl,
      document_name: file.name,
      document_size: file.size,
      status: 'submitted',
      updated_at: new Date().toISOString()
    })
    .eq('id', itemId)

  if (updateError) return { success: false, error: updateError.message }

  revalidatePath('/[lang]/dashboard/compliance')
  return { success: true }
}

export async function removeComplianceDocument(itemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('compliance_items')
    .update({
      document_url: null,
      document_name: null,
      document_size: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', itemId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/[lang]/dashboard/compliance')
  return { success: true }
}
