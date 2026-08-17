export const GOOGLE_SCOPES = {
  CONTACTS_READONLY: 'https://www.googleapis.com/auth/contacts.readonly',
  SHEETS_READONLY: 'https://www.googleapis.com/auth/spreadsheets.readonly',
  FORMS_BODY_READONLY: 'https://www.googleapis.com/auth/forms.body.readonly',
  FORMS_RESPONSES_READONLY: 'https://www.googleapis.com/auth/forms.responses.readonly',
  CALENDAR_READWRITE: 'https://www.googleapis.com/auth/calendar.events',
  CALENDAR_FULL: 'https://www.googleapis.com/auth/calendar',
} as const;

export const GOOGLE_IMPORT_SCOPES = {
  contacts: [GOOGLE_SCOPES.CONTACTS_READONLY],
  sheets: [GOOGLE_SCOPES.SHEETS_READONLY],
  forms: [GOOGLE_SCOPES.FORMS_BODY_READONLY, GOOGLE_SCOPES.FORMS_RESPONSES_READONLY],
  calendar: [GOOGLE_SCOPES.CALENDAR_READWRITE, GOOGLE_SCOPES.CALENDAR_FULL],
};

export type GoogleFeature = keyof typeof GOOGLE_IMPORT_SCOPES;

export function getAllImportScopes(): string[] {
  return [
    ...GOOGLE_IMPORT_SCOPES.contacts,
    ...GOOGLE_IMPORT_SCOPES.sheets,
    ...GOOGLE_IMPORT_SCOPES.forms,
    GOOGLE_SCOPES.CALENDAR_READWRITE,
    GOOGLE_SCOPES.CALENDAR_FULL,
  ];
}

export function getScopesForFeature(feature: GoogleFeature): string[] {
  if (feature === 'calendar') {
    return [GOOGLE_SCOPES.CALENDAR_READWRITE, GOOGLE_SCOPES.CALENDAR_FULL];
  }
  return GOOGLE_IMPORT_SCOPES[feature] || [];
}

