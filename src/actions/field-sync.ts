'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { FieldRecord } from '@/lib/offline/field-store'

export async function syncFieldBatchAction(records: FieldRecord[]) {
  if (!records || records.length === 0) {
    return { success: true, syncedIds: [] }
  }

  const orgId = await getSelectedOrganisationId()
  if (!orgId) return { success: false, error: 'Organisation not identified' }

  const adminClient = createServiceClient()
  const syncedIds: string[] = []

  for (const rec of records) {
    try {
      if (rec.type === 'member_intake') {
        const { fullName, email, phone, role } = rec.data
        if (fullName) {
          await adminClient.from('members').insert({
            organisation_id: orgId,
            full_name: fullName,
            email: email || null,
            phone: phone || null,
            role: role || 'member',
          })
          syncedIds.push(rec.id)
        }
      } else if (rec.type === 'field_grievance') {
        const { location, category, description } = rec.data
        if (description) {
          await adminClient.from('tickets').insert({
            organisation_id: orgId,
            title: `[FIELD INTAKE] ${category || 'Issue'} at ${location || 'Campus'}`,
            description: `Offline Ground Intake:\n${description}`,
            status: 'open',
            priority: 'medium',
            type: 'grievance',
          })
          syncedIds.push(rec.id)
        }
      } else if (rec.type === 'petition_signature') {
        const { petitionId, name, email, phone, locality, wantsToVolunteer } = rec.data
        if (petitionId && name && email) {
          await adminClient.from('petition_signatures').insert({
            petition_id: petitionId,
            supporter_name: name,
            supporter_email: email,
            supporter_phone: phone || null,
            supporter_locality: locality || null,
            wants_to_volunteer: !!wantsToVolunteer,
          })
          const { data: pet } = await adminClient.from('petitions').select('current_signatures').eq('id', petitionId).maybeSingle()
          if (pet) {
            await adminClient.from('petitions').update({ current_signatures: (pet.current_signatures || 0) + 1 }).eq('id', petitionId)
          }
          syncedIds.push(rec.id)
        }
      } else {
        syncedIds.push(rec.id)
      }
    } catch (e) {
      console.error('Failed to sync record', rec.id, e)
      // still continue with other records in the batch
    }
  }

  return {
    success: true,
    syncedIds,
    count: syncedIds.length,
  }
}
