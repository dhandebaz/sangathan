export interface DashboardEvent {
  id: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time?: string | null;
  location?: string | null;
  organisation_id?: string;
  event_type?: string;
  capacity?: number | null;
  rsvp_enabled?: boolean;
  event_rsvps?: { count: number }[];
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id?: string;
  guest_name?: string;
  guest_email?: string;
  status: 'registered' | 'attended' | 'cancelled';
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export interface Organisation {
  id: string;
  name: string;
  slug: string;
}

export interface DashboardTask {
  id: string;
  title: string;
  description?: string | null;
  priority: 'low' | 'medium' | 'high';
  visibility_level?: string;
  due_date?: string | null;
}

export interface DashboardAnnouncement {
  id: string;
  title: string;
  content: string;
  is_pinned?: boolean;
  created_at: string;
  expires_at?: string | null;
  announcement_views?: { user_id: string }[];
}

export interface DashboardForm {
  id: string;
  title: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  visibility?: 'public' | 'members' | 'private' | null;
  form_submissions?: { count: number }[];
  fields?: DashboardFormField[];
}

export interface DashboardFormField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
}

export interface AdminStats {
  members: number;
  events: number;
  tasks: number;
  donations: number;
}

export interface RecentActivityItem {
  title?: string;
  type: string;
  created_at: string;
}

export interface NetworkMember {
  status: 'pending' | 'active' | 'suspended';
  organisation: {
    id: string;
    name: string;
    slug: string;
    member_count?: number;
  };
}

export interface Network {
  id: string;
  name: string;
  description?: string;
  slug: string;
  visibility?: 'public' | 'private';
  members: NetworkMember[];
}

export interface PublicEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  location?: string | null;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  type: 'informal' | 'formal';
  voting_method: 'anonymous' | 'identifiable';
  organisation_id: string;
  final_results?: PollResults;
  end_time?: string;
  created_at: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  label: string;
  display_order: number;
}

export interface PollResults {
  counts: Record<string, number>;
  total: number;
  passed?: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  end_time?: string;
  description?: string;
  location?: string | null;
  organisation_id?: string;
  visibility?: 'public' | 'members' | 'private';
  meeting_link?: string | null;
  meeting_attendance?: { count: number }[];
}

export interface MeetingAttendance {
  member_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  members: {
    full_name: string;
  };
}

export interface Member {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  designation: string | null;
  area: string | null;
  status: 'active' | 'inactive' | null;
  joining_date: string | null;
  role: string | null;
}

export interface Donation {
  id: string;
  amount: number;
  donor_name: string;
  date: string;
  payment_method: string;
  upi_reference: string | null;
  notes: string | null;
  verified_by: string | null;
  organisation_id: string;
}

export interface Appeal {
  id: string;
  organisation_id: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  reason: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  created_at: string;
  action: string;
  resource_table: string;
  resource_id: string;
  details: Record<string, unknown> | null;
  profiles?: {
    full_name: string;
  };
  organisations?: {
    name: string;
  };
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warn' | 'error' | 'security' | 'critical';
  source: string;
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface SystemAdminOrganisation {
  id: string;
  name: string;
  slug: string;
  is_suspended: boolean;
  created_at: string;
  status: 'active' | 'warning' | 'suspended' | 'under_review';
  membership_policy: 'open_auto' | 'admin_approval' | 'invite_only';
  members?: { count: number }[];
}

export interface DataRequest {
  id: string;
  request_type: 'deletion' | 'export' | 'other';
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
  organisations?: {
    name: string;
  };
  profiles?: {
    email: string;
  };
}

export interface RiskEvent {
  id: string;
  risk_type: string;
  severity: 'low' | 'medium' | 'high';
  entity_id: string;
  entity_type: string;
  detected_at: string;
  metadata: Record<string, unknown> | null;
  status: 'pending' | 'investigated' | 'resolved' | 'dismissed';
}

export interface SupporterSubscription {
  id: string;
  organisation_id: string;
  subscription_id: string;
  plan_id: string;
  status: 'created' | 'active' | 'cancelled' | 'expired';
  amount: number;
  created_at: string;
}

export interface DonationSubscription {
  id: string;
  organisation_id: string;
  donor_id: string;
  amount: number;
  currency: string;
  frequency: 'monthly' | 'quarterly' | 'annual';
  status: 'active' | 'paused' | 'cancelled' | 'past_due';
  next_payment_date: string;
  payment_method_details?: Record<string, unknown> | null;
  campaign_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaxReceipt {
  id: string;
  organisation_id: string;
  donation_id: string;
  donor_id: string;
  receipt_number: string;
  receipt_date: string;
  financial_year: string;
  amount: number;
  donor_pan?: string | null;
  pdf_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  organisation_id: string;
  unit_number: string;
  block_building?: string | null;
  owner_profile_id?: string | null;
  tenant_profile_id?: string | null;
  area_sqft?: number | null;
  status: 'occupied' | 'vacant' | 'under_construction';
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  organisation_id: string;
  unit_id: string;
  type: 'maintenance' | 'special_levy' | 'penalty';
  amount: number;
  billing_period_start?: string | null;
  billing_period_end?: string | null;
  due_date: string;
  status: 'draft' | 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  transaction_id?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}
export interface BillingPlan {
  id: string;
  organisation_id: string;
  name: string;
  amount: number;
  currency: string;
  frequency: 'monthly' | 'quarterly' | 'annual' | 'one_time';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MembershipDue {
  id: string;
  organisation_id: string;
  member_profile_id: string;
  plan_id?: string | null;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  transaction_id?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Election {
  id: string;
  organisation_id: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ElectionPosition {
  id: string;
  election_id: string;
  title: string;
  max_votes_per_voter: number;
  created_at: string;
}

export interface Candidate {
  id: string;
  position_id: string;
  profile_id: string;
  manifesto_text?: string | null;
  votes_count: number;
  created_at: string;
}

export interface ElectionVoter {
  id: string;
  election_id: string;
  profile_id: string;
  voted_at: string;
}

export interface Facility {
  id: string;
  organisation_id: string;
  name: string;
  description?: string | null;
  capacity?: number | null;
  hourly_rate?: number | null;
  status: 'available' | 'maintenance' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface FacilityBooking {
  id: string;
  organisation_id: string;
  facility_id: string;
  profile_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  id: string;
  organisation_id: string;
  title: string;
  employer_name: string;
  location?: string | null;
  description?: string | null;
  skills_required?: string[] | null;
  wage_rate?: string | null;
  positions_available: number;
  start_date?: string | null;
  status: 'open' | 'filled' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  profile_id: string;
  status: 'applied' | 'dispatched' | 'rejected' | 'completed';
  notes?: string | null;
  created_at: string;
  updated_at: string;
}
