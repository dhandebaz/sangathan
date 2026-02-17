export interface DashboardEvent {
  id: string;
  title: string;
  start_time: string;
  location?: string | null;
  organisation_id?: string;
  event_type?: string;
  capacity?: number | null;
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
  priority: 'low' | 'medium' | 'high';
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
  organisation: {
    id: string;
    name: string;
    slug: string;
    member_count: { count: number }[];
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
  upi_reference?: string;
  notes?: string;
  verified_by?: string | null;
  organisation_id: string;
}

export interface Appeal {
  id: string;
  organisation_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  reason: string;
  resolution_note?: string;
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
  profiles?: { count: number }[];
  supporter_subscriptions?: { status: string }[];
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
  razorpay_subscription_id: string;
  razorpay_plan_id: string;
  status: 'created' | 'active' | 'cancelled' | 'expired';
  amount: number;
  created_at: string;
}
