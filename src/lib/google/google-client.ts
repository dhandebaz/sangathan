import { createClient } from '@/lib/supabase/server';

export async function getGoogleProviderToken(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session || !session.provider_token) {
    return null;
  }
  
  return session.provider_token;
}

export type GoogleApiResult<T> = 
  | { ok: true; data: T } 
  | { ok: false; error: string; code: number };

export async function googleApiFetch<T>(
  url: string,
  providerToken: string,
  options?: RequestInit
): Promise<GoogleApiResult<T>> {
  try {
    const headers = new Headers(options?.headers);
    headers.set('Authorization', `Bearer ${providerToken}`);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = 'Google API error';
      if (response.status === 401) {
        errorMessage = 'Token expired or invalid';
      } else if (response.status === 403) {
        errorMessage = 'Insufficient scopes or permission denied';
      } else if (response.status === 429) {
        errorMessage = 'Rate limited by Google API';
      } else {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
        } catch {
          // Keep default message if not JSON
        }
      }
      
      return {
        ok: false,
        error: errorMessage,
        code: response.status,
      };
    }

    const data = await response.json() as T;
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error during fetch',
      code: 500,
    };
  }
}
