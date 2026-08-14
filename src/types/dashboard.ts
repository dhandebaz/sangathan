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

export interface ElectionWithPositions {
  id: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  election_positions?: ElectionPositionWithCandidates[];
}

export interface ElectionPositionWithCandidates {
  id: string;
  election_id: string;
  title: string;
  max_votes_per_voter: number;
  candidates?: CandidateWithProfile[];
}

export interface CandidateWithProfile {
  id: string;
  position_id: string;
  profile_id: string;
  manifesto_text?: string | null;
  votes_count: number;
  profiles?: {
    full_name?: string | null;
    email?: string | null;
  };
}

export interface ElectionPositionSimple {
  id: string;
  title: string;
  max_votes_per_voter: number;
}

export interface ElectionCandidateSimple {
  id: string;
  position_id: string;
  profile_id: string;
  manifesto_text?: string | null;
  votes_count: number;
  profiles?: {
    full_name?: string | null;
    email?: string | null;
  };
}

export interface FacilityWithOrg {
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

export interface BookingWithDetails {
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
  facilities?: {
    name: string;
  };
  profiles?: {
    full_name?: string | null;
  };
}

export interface BotLog {
  id: string;
  conversation_id: string;
  channel: string;
  direction: 'incoming' | 'outgoing';
  message_text: string;
  created_at: string;
}

export interface BotConversation {
  id: string;
  channel: string;
  sender_id: string;
  sender_name?: string | null;
  last_command?: string | null;
  last_state?: string | null;
  created_at: string;
  updated_at: string;
  member?: {
    id: string;
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    role?: string | null;
  };
}

export interface BotChannelConfig {
  id: string;
  organisation_id: string;
  channel: string;
  credentials: Record<string, unknown>;
  status: string;
  connected_phone?: string | null;
}

export interface TransparencyEntry {
  id: string;
  organisation_id: string;
  title: string;
  category: string;
  amount: number;
  recipient_vendor: string;
  expense_date: string;
  receipt_sha256_hash?: string | null;
}

export interface CollaborationLink {
  id: string;
  requester_org_id: string;
  responder_org_id: string;
  status: 'pending' | 'active' | 'rejected';
  created_at: string;
  requester?: { name: string };
  responder?: { name: string };
}

export interface JobPostingWithApps extends JobPosting {
  job_applications?: JobApplicationWithProfile[];
}

export interface JobApplicationWithProfile extends JobApplication {
  profiles?: {
    full_name?: string | null;
    phone?: string | null;
  };
}

export interface EmergencySOSAlert {
  id: string;
  organisation_id: string;
  user_id: string | null;
  latitude: string | null;
  longitude: string | null;
  location_description: string | null;
  status: 'active' | 'responding' | 'resolved' | 'cancelled';
  created_at: string;
  resolved_at: string | null;
  profiles?: {
    full_name?: string | null;
    phone?: string | null;
    email?: string | null;
  };
}

export interface ElectionVoteTally {
  id: string;
  title: string;
  description?: string | null;
  created_at: string | null;
}

export type GrantStatus = 'draft' | 'submitted' | 'awarded' | 'rejected';
export type CBAStatus = 'active' | 'draft' | 'expired' | 'archived';

// ==========================================
// 4 ORG TYPES OPERATIONAL SUITE INTERFACES
// ==========================================

export interface GrantMilestone {
  id: string;
  grant_id: string;
  organisation_id: string;
  title: string;
  tranche_amount: number;
  target_date?: string | null;
  disbursed_at?: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'verified';
  deliverables?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GrantExpense {
  id: string;
  grant_id: string;
  organisation_id: string;
  milestone_id?: string | null;
  budget_line_item: string;
  amount: number;
  expense_date: string;
  vendor_name?: string | null;
  receipt_url?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface VolunteerCertificate {
  id: string;
  organisation_id: string;
  volunteer_profile_id: string;
  certificate_number: string;
  service_hours_recognized: number;
  issue_date: string;
  issued_by?: string | null;
  citation_text?: string | null;
  verification_hash: string;
  pdf_url?: string | null;
  created_at: string;
  volunteer?: {
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
}

export interface ElectionBoothTally {
  id: string;
  election_id: string;
  position_id: string;
  candidate_id: string;
  booth_name: string;
  round_number: number;
  votes_count: number;
  recorded_by?: string | null;
  created_at: string;
  candidates?: {
    manifesto_text?: string | null;
    profiles?: {
      full_name?: string | null;
    };
  };
  election_positions?: {
    title?: string | null;
  };
}

export interface HostelMessAudit {
  id: string;
  organisation_id: string;
  hostel_name: string;
  inspection_type: 'mess_quality' | 'room_allotment' | 'sanitation_hygiene' | 'study_hall';
  meal_type?: 'breakfast' | 'lunch' | 'snacks' | 'dinner' | null;
  rating?: number | null;
  student_name?: string | null;
  roll_number?: string | null;
  remarks?: string | null;
  photo_url?: string | null;
  action_taken?: string | null;
  status: 'open' | 'under_investigation' | 'resolved' | 'escalated_to_warden';
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateExpense {
  id: string;
  election_id: string;
  candidate_id: string;
  item_description: string;
  amount: number;
  vendor_name?: string | null;
  receipt_url?: string | null;
  expense_date: string;
  is_lyngdoh_compliant: boolean;
  created_at: string;
}

export interface TradeDispute {
  id: string;
  organisation_id: string;
  dispute_ref: string;
  employer_name: string;
  worker_count: number;
  dispute_nature: 'wage_theft' | 'unlawful_termination' | 'safety_hazard' | 'cba_violation' | 'lockout' | 'pension_gratuity';
  stage: 'shop_floor' | 'works_committee' | 'alc_conciliation' | 'labour_court' | 'industrial_tribunal' | 'settled';
  lead_shop_steward_id?: string | null;
  next_hearing_date?: string | null;
  summary: string;
  settlement_terms?: string | null;
  status: 'active' | 'pending_hearing' | 'settled' | 'appealed' | 'dismissed';
  created_at: string;
  updated_at: string;
  lead_steward?: {
    full_name?: string | null;
    phone?: string | null;
  };
}

export interface CBAClause {
  id: string;
  cba_id: string;
  organisation_id: string;
  clause_number: string;
  topic: 'basic_wages' | 'da_allowances' | 'working_hours' | 'shift_timing' | 'occupational_safety' | 'overtime_rates' | 'medical_insurance' | 'bonus_gratuity' | 'grievance_procedure';
  current_clause_text: string;
  union_demand_text: string;
  management_counter_offer?: string | null;
  status: 'in_negotiation' | 'agreed' | 'deadlocked' | 'referred_to_arbitration';
  created_at: string;
  updated_at: string;
}

export interface StrikeRosterEntry {
  id: string;
  organisation_id: string;
  strike_name: string;
  plant_location: string;
  picket_date: string;
  shift_name: string;
  steward_in_charge?: string | null;
  workers_present: number;
  relief_disbursed: number;
  notes?: string | null;
  created_at: string;
}

export interface DomesticStaff {
  id: string;
  organisation_id: string;
  full_name: string;
  phone: string;
  role: 'maid' | 'cook' | 'driver' | 'gardener' | 'car_cleaner' | 'electrician' | 'plumber' | 'security_guard';
  flat_units: string[];
  photo_url?: string | null;
  police_verified: boolean;
  aadhar_last4?: string | null;
  pass_code: string;
  status: 'active' | 'suspended' | 'barred';
  created_at: string;
  updated_at: string;
}

export interface SocietyAsset {
  id: string;
  organisation_id: string;
  asset_name: string;
  category: 'lift_elevator' | 'dg_generator' | 'fire_fighting' | 'water_pumps' | 'cctv_security' | 'swimming_pool' | 'gym_equipment' | 'transformer';
  location_block?: string | null;
  vendor_name: string;
  vendor_phone?: string | null;
  amc_start_date?: string | null;
  amc_expiry_date: string;
  statutory_noc_expiry?: string | null;
  last_service_date?: string | null;
  next_service_due: string;
  annual_amc_cost?: number | null;
  status: 'operational' | 'service_due' | 'under_breakdown' | 'noc_pending';
  created_at: string;
  updated_at: string;
}

export interface BatchMaintenanceRun {
  id: string;
  organisation_id: string;
  billing_month: string;
  rate_type: 'per_sqft' | 'flat_rate';
  rate_amount: number;
  total_units_billed: number;
  total_invoiced_amount: number;
  due_date: string;
  created_by?: string | null;
  created_at: string;
}
