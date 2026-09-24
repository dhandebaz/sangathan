// Event-Driven Automation Rule Engine for Sangathan

export interface AutomationRule {
  id: string
  name: string
  description: string
  triggerEvent:
    | 'member_joined'
    | 'donation_received'
    | 'grievance_filed'
    | 'emergency_sos_triggered'
    | 'petition_signed'
    | 'event_rsvp_submitted'
  conditions: {
    field: string
    operator: 'equals' | 'greater_than' | 'contains'
    value: any
  }[]
  actions: {
    actionType:
      | 'issue_digital_id'
      | 'send_welcome_message'
      | 'assign_task'
      | 'alert_legal_team'
      | 'generate_tax_receipt'
      | 'add_to_solidarity_broadcast'
    params?: Record<string, any>
  }[]
  isActive: boolean
  executionCount?: number
  lastTriggeredAt?: string
}

export const PREBUILT_AUTOMATION_RECIPES: Omit<AutomationRule, 'id'>[] = [
  {
    name: 'Instant Member Onboarding & Digital ID Delivery',
    description: 'When a new member joins → Issue cryptographic digital ID card → Assign orientation task to regional head → Send WhatsApp welcome message.',
    triggerEvent: 'member_joined',
    conditions: [],
    actions: [
      { actionType: 'issue_digital_id' },
      { actionType: 'assign_task', params: { title: 'New Member Welcome & Orientation', assigneeRole: 'regional_head' } },
      { actionType: 'send_welcome_message', params: { channel: 'whatsapp', template: 'welcome_cadre' } },
    ],
    isActive: true,
  },
  {
    name: 'Emergency SOS Rapid Legal Dispatch',
    description: 'When an emergency SOS alert is triggered on field → Broadcast alert to legal aid team → Dispatch SMS to executive committee.',
    triggerEvent: 'emergency_sos_triggered',
    conditions: [{ field: 'severity', operator: 'equals', value: 'critical' }],
    actions: [
      { actionType: 'alert_legal_team', params: { priority: 'highest' } },
      { actionType: 'add_to_solidarity_broadcast', params: { channel: 'sms' } },
    ],
    isActive: true,
  },
  {
    name: 'High-Value Donor Confirmation & Thank You',
    description: 'When a donation > ₹5,000 is received → Log an acknowledgment for the treasurer to issue a receipt (80G only if the org holds its own registration) → Notify treasurer.',
    triggerEvent: 'donation_received',
    conditions: [{ field: 'amount', operator: 'greater_than', value: 5000 }],
    actions: [
      { actionType: 'assign_task', params: { title: 'Issue donor receipt', assigneeRole: 'treasurer' } },
      { actionType: 'send_welcome_message', params: { channel: 'email', template: 'donor_gratitude' } },
    ],
    isActive: true,
  },
  {
    name: 'Petition Signer to Active Volunteer Conversion',
    description: 'When a supporter signs a public petition and opts to volunteer → Auto-create volunteer record → Send induction briefing.',
    triggerEvent: 'petition_signed',
    conditions: [{ field: 'wants_to_volunteer', operator: 'equals', value: true }],
    actions: [
      { actionType: 'issue_digital_id' },
      { actionType: 'assign_task', params: { title: 'Volunteer Induction Outreach', assigneeRole: 'campaign_lead' } },
    ],
    isActive: true,
  },
]
