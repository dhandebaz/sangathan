import admin from 'firebase-admin'

// Track initialization error for better debugging
let initError: Error | null = null;

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  
  if (privateKey) {
    try {
      // Robust key handling: remove quotes if they exist, handle escaped newlines
      const cleanKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();

      if (!clientEmail) {
        throw new Error('FIREBASE_ADMIN_CLIENT_EMAIL is missing or empty');
      }
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: clientEmail,
          privateKey: cleanKey,
        }),
      })
      console.log('✅ [Firebase Admin] Initialized successfully')
    } catch (error) {
      console.error('❌ [Firebase Admin] Initialization Error:', error)
      initError = error instanceof Error ? error : new Error(String(error));
    }
  } else {
    console.warn('⚠️ [Firebase Admin] FIREBASE_ADMIN_PRIVATE_KEY is missing.')
    initError = new Error('FIREBASE_ADMIN_PRIVATE_KEY is missing from environment variables');
  }
}

export const firebaseAdmin = admin

// Export a safe version of auth that throws at runtime if not initialized
let auth: admin.auth.Auth | null = null
try {
  auth = admin.apps.length ? admin.auth() : null
} catch {
  auth = null
}

// Proxy to intercept calls if auth is null
export const firebaseAdminAuth = auth || new Proxy({}, {
  get: () => {
    throw new Error(`Firebase Admin Auth is not initialized. Reason: ${initError ? initError.message : 'Unknown error'}. Check server logs.`)
  }
}) as admin.auth.Auth
