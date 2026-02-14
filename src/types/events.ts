export type EventType = 'public' | 'members' | 'volunteer' | 'core' | 'executive';
export type RSVPStatus = 'registered' | 'attended' | 'cancelled';

export interface Event {
  id: string;
  organisation_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  event_type: EventType;
  rsvp_enabled: boolean;
  capacity?: number;
  created_at: string;
  created_by: string;
}

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  legal_hold?: boolean;
}

export interface RSVP {
  id: string;
  event_id: string;
  user_id?: string | null;
  guest_name?: string | null;
  guest_email?: string | null;
  status: RSVPStatus;
  checked_in_at?: string | null;
  created_at: string;
  user?: {
    full_name: string | null;
  };
}
