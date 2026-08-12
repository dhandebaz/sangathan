'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { bulkImportMembers } from './import'
import { batchCreateInvites } from '../invites'

const ContactItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  designation: z.string().optional(),
  area: z.string().optional(),
  role: z.enum(['admin', 'editor', 'viewer', 'member']).default('member'),
})

const ImportContactsSchema = z.object({
  contacts: z.array(ContactItemSchema).min(1, 'At least one contact is required'),
  action: z.enum(['add_members', 'send_invites']),
})

export const importGoogleContacts = createSafeAction(
  ImportContactsSchema,
  async (input, context) => {
    const { contacts, action } = input

    if (action === 'send_invites') {
      const emailContacts = contacts
        .filter((c) => c.email && c.email.trim().length > 0)
        .map((c) => ({
          email: c.email as string,
          name: c.name,
          role: c.role,
        }))

      if (emailContacts.length === 0) {
        return {
          success: false,
          error: 'None of the selected contacts have a valid email address for invitations.',
        }
      }

      const res = await batchCreateInvites({ invites: emailContacts })
      return res
    } else {
      // Add directly as members
      const memberRows = contacts.map((c) => ({
        full_name: c.name,
        phone: c.phone || '',
        email: c.email || undefined,
        designation: c.designation || undefined,
        area: c.area || undefined,
        role: c.role,
        status: 'active' as const,
      })).filter((m) => m.phone.length >= 5)

      if (memberRows.length === 0) {
        return {
          success: false,
          error: 'At least a phone number is required to register contacts directly into the member directory.',
        }
      }

      const res = await bulkImportMembers({ members: memberRows })
      return res
    }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'import_google_contacts' }
)
