import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.provider_token) {
      return NextResponse.json({ 
        error: 'Google API access not authorized. Please grant permission first.', 
        needsConsent: true 
      }, { status: 403 })
    }

    let nextPageToken: string | undefined = undefined;
    const allContacts: any[] = [];
    
    do {
      const url = new URL('https://people.googleapis.com/v1/people/me/connections');
      url.searchParams.append('personFields', 'names,emailAddresses,phoneNumbers,organizations');
      url.searchParams.append('pageSize', '1000');
      url.searchParams.append('sortOrder', 'FIRST_NAME_ASCENDING');
      if (nextPageToken) {
        url.searchParams.append('pageToken', nextPageToken);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return NextResponse.json({ error: 'Google session expired.', needsConsent: true }, { status: 401 });
        }
        if (response.status === 403) {
          return NextResponse.json({ error: 'Missing permissions for Google Contacts.', needsConsent: true }, { status: 403 });
        }
        if (response.status === 429) {
          return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
        }
        return NextResponse.json({ error: 'Failed to fetch contacts from Google.' }, { status: response.status });
      }

      const data = await response.json();
      
      const connections = data.connections || [];
      
      for (const connection of connections) {
        const name = connection.names?.[0]?.displayName || '';
        const email = connection.emailAddresses?.[0]?.value || '';
        const phone = connection.phoneNumbers?.[0]?.value || '';
        const organization = connection.organizations?.[0]?.name || '';
        const title = connection.organizations?.[0]?.title || '';

        if (name || email || phone) {
          allContacts.push({
            name,
            email,
            phone,
            organization,
            title
          });
        }
      }
      
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    return NextResponse.json({ 
      success: true, 
      contacts: allContacts, 
      totalCount: allContacts.length 
    });

  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
