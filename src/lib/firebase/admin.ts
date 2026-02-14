import admin from 'firebase-admin'

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  
  if (privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      })
    } catch (error) {
      console.error('Firebase Admin Initialization Error:', error)
    }
  } else {
    console.warn('⚠️ FIREBASE_ADMIN_PRIVATE_KEY is missing. Firebase Admin SDK not initialized.')
  }
}

export const firebaseAdmin = admin

// Export a safe version of auth that throws at runtime if not initialized
// rather than crashing at import time
let auth: admin.auth.Auth
try {
  // If app is not initialized, this might throw
  auth = admin.apps.length ? admin.auth() : null as any
} catch (e) {
  auth = null as any
}

// Proxy to intercept calls if auth is null
export const firebaseAdminAuth = auth || new Proxy({}, {
  get: () => {
    throw new Error('Firebase Admin Auth is not initialized. Check your environment variables.')
  }
}) as admin.auth.Auth
