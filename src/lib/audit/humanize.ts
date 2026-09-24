const ACTION_LABELS: Record<string, string> = {
  LOG_PHYSICAL_RECEIVING: 'Logged physical receiving',
  LOG_FIELD_SPOT_AUDIT: 'Completed a field spot audit',
  MEMBER_CREATED: 'Added a new member',
  MEMBER_INVITED: 'Invited a new member',
  MEMBER_STATUS_CHANGED: 'Updated a member status',
  MEMBERS_BULK_IMPORTED: 'Imported members in bulk',
  TICKET_CREATED: 'Logged a new complaint',
  TICKET_STATUS_UPDATED: 'Updated a complaint status',
  TICKET_DELETED: 'Removed a complaint',
  TICKET_ASSIGNED: 'Assigned a complaint',
  TICKET_SLA_SET: 'Set a response deadline',
  COMPLAINT_AI_ANALYSIS: 'Ran an AI complaint analysis',
  COMPLAINT_AUTHORITY_UPDATED: 'Assigned a complaint to an authority',
  COMPLAINT_PRINTED: 'Marked a complaint as printed',
  COMPLAINT_DELIVERED: 'Marked a complaint as delivered',
  EVENT_CREATED: 'Scheduled a new event',
  EVENT_UPDATED: 'Updated an event',
  EVENT_CHECK_IN: 'Checked someone into an event',
  TASK_CREATED: 'Created a new task',
  MEETING_CREATED: 'Scheduled a meeting',
  MEETING_DELETED: 'Cancelled a meeting',
  CAMPAIGN_CREATED: 'Launched a campaign',
  CAMPAIGN_STATUS_UPDATED: 'Updated a campaign status',
  CAMPAIGN_DELETED: 'Removed a campaign',
  DONATION_LOGGED: 'Logged a donation',
  DONATION_VERIFIED: 'Verified a donation',
  DONATION_DELETED: 'Removed a donation record',
  SUBSCRIPTION_CREATED: 'Created a subscription',
  TAX_RECEIPT_GENERATED: 'Issued a tax receipt',
  DOCUMENT_UPLOADED: 'Uploaded a document',
  DOCUMENT_DELETED: 'Removed a document',
  FORM_CREATED: 'Created a new form',
  FORM_UPDATED: 'Updated a form',
  FORM_STATUS_CHANGED: 'Changed a form status',
  FORM_SLUG_UPDATED: 'Updated a form link',
  FORM_DELETED: 'Removed a form',
  GOOGLE_FORM_IMPORTED: 'Imported responses from Google Forms',
  AUTHORITY_CREATED: 'Added an authority contact',
  AUTHORITY_UPDATED: 'Updated an authority contact',
  AUTHORITY_DELETED: 'Removed an authority contact',
  VISITOR_PRE_APPROVED: 'Pre-approved a visitor',
  VISITOR_CHECKED_IN: 'Checked in a visitor',
  VISITOR_CHECKED_OUT: 'Checked out a visitor',
  ANNOUNCEMENT_CREATED: 'Published an announcement',
  SAVE_PRESS_RELEASE: 'Saved a press release',
  ORG_PROFILE_UPDATED: 'Updated organisation profile',
  ORG_PLAN_CHANGED: 'Changed the plan',
  ORG_SUSPENDED: 'Suspended an organisation',
  ORG_REACTIVATED: 'Reactivated an organisation',
  ORG_UPDATED_BY_ADMIN: 'Updated an organisation',
  ORG_DELETED_BY_ADMIN: 'Removed an organisation',
  PLATFORM_BROADCAST_CREATED: 'Sent a platform broadcast',
  SYSTEM_SETTING_UPDATED: 'Updated a system setting',
  SYSTEM_SETTING_DELETED: 'Removed a system setting',
  USER_DELETED: 'Removed a user',
  RISK_EVENT_OPEN: 'Raised a risk alert',
  RISK_EVENT_RESOLVED: 'Resolved a risk alert',
  RISK_EVENT_ESCALATED: 'Escalated a risk alert',
}

/**
 * Converts internal audit action codes (e.g. "LOG_PHYSICAL_RECEIVING")
 * into a human-friendly sentence that admins can read at a glance.
 * Falls back to a Title-Case conversion for unknown codes instead of
 * showing raw uppercase code.
 */
export function humanizeAction(action: string): string {
  const mapped = ACTION_LABELS[action]
  if (mapped) return mapped

  if (!action) return 'Performed an action'

  return action
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}