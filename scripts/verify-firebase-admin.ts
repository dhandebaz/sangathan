
import dotenv from 'dotenv';
import path from 'path';
import admin from 'firebase-admin';

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyAdmin() {
  console.log('--- Verifying Firebase Admin Setup ---');
  
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  console.log('Project ID:', projectId);
  console.log('Client Email:', clientEmail);
  console.log('Private Key (exists):', !!privateKey);
  console.log('Private Key length:', privateKey?.length);

  if (!clientEmail || !privateKey || !projectId) {
    console.error('❌ Missing environment variables!');
    process.exit(1);
  }

  try {
    const cleanKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: cleanKey,
        }),
      });
    }

    console.log('✅ Firebase Admin initialized successfully.');
    
    // Try to create a custom token to verify credentials work
    const token = await admin.auth().createCustomToken('test-user');
    console.log('✅ Successfully generated test token.');
    
  } catch (error: any) {
    console.error('❌ Initialization failed:', error.message);
    if (error.errorInfo) {
        console.error('Error Info:', JSON.stringify(error.errorInfo, null, 2));
    }
    process.exit(1);
  }
}

verifyAdmin();
