import admin from 'firebase-admin'

if (!admin.apps.length) {
  // Use explicit service account object to avoid any env var parsing issues
  // This matches the exact JSON provided by the user
  const serviceAccount = {
    projectId: "thesangathanapp",
    clientEmail: "firebase-adminsdk-fbsvc@thesangathanapp.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtFjla+ISV4Cb1\n9E6FibIG8E89VrSaBnUrU/nVkpDuZ3nCndPRaMRqh1NGV6D36gGrKmL5boyWEiT7\nsG+A9pRkSn5HKGPvfkT/+d9dTu+uhd9ZyxFDVKnSIQP2KlqrijyCO6uKO2H9TacM\nihD+R2BJBd3mAOKOncp47DDFSsOOyO+qCbeqzMzORKrTvwwfW6Xa7qnxzRYKT9nQ\nBl3IA09NpActBFloylEjShE2T7BNCqmjoAXyJiM474lY8aGGVrTDXOCM1LUI+i9z\nvFExil2PBcgrn5vFmsnhiBAs/x4BAujUBhqUj481xLzZwhEYxIC+gGL7g7kRALYH\nwSRQxlTxAgMBAAECggEARWfVfPCNfenhxZt/BxY1cInZRG/pwJ+ZSVQFqQn6Gtcc\nYJlYEC8yH8N+9YR69B5+J8w53upg7mZ9NP3FYJG/5E1owJDmLelUss5YLnrSKond\nC40dsYGYDT4W8BWAwSuP4usZeLciLmf+dc1BTi2B4xY6qhmtv2FviLixP9OggjbQ\n0j+LkqdyOoO4+A3uo+9cQYTiEQyQ1zCYcpdO9qqhZUeMzElDFPCdrkXnzPWea2n+\nlAp+t8E9SY11aDJZHd76C/L9zYKTOYDlv2PmYUhhtec82LZ40Dds3nwTlTeUQUo1\nT/WuybajVOfQdheouBWU8ArpNUnmQbKcz2lTRDgLzwKBgQDaONTtf24xw4CBOvtc\nFgc/xghAckMWU5alPlag53UY3xiVRIynQveLFMkvnkjJL0/rUTqn5Vi7UtEMr4fZ\nCHvhKqulroaDmmsbkbJ2dRWFBhE5vAMAOk4PVrnYXuktabj6bZo4oqIB43XqRmWP\nnYuh7LXScWTy67nW+zGXO3NKxwKBgQDLDRcFiqA/2lZSt64H0Vr7a0LpOoFORCU1\nEGfJe5qoHX8bTu6nmcYQlaZ/PuOF6THbXZfQ1LTs21y19FoA/WODp3NAo+Hj8p9Q\nbtM7SV5bmSugjPglyHHCiTLgJNTjBH7YgSvjgnFc6TnDTA7JHNMhcd+r/mrR78m0\nGo2RJmDqhwKBgBnLrAfjD2Ccjp04Hqx1AihcvW740stZ2C3yX4UntyTYgmxqrQG8\nncx4CYwydsIpcJYNhRSBvOpv0LxiJ3nVUed9BstQBSCbaVvZ7jGoh4GxBOpBOk2V\nltKjWtaj6YZvv+kCeb+GIgZ9H9wwtCK06eObOqcEtn0stkweZ29MHMXTAoGBAJMR\njBcrbR5SmiuXdqma7XclHXWoNnfly70/gKzipgYWNzYkWZ9zNY5Vlh6cAle/q6jj\nhU5wggr8Z44yye3lmeqFomizSq270cCEROKwJXPa4UqMUD+tixgIH51RkBBN9UID\nbTKADHPrSTc3I45vHk0fGY6N2/jq4QFeKiNz1MaJAoGAESJ/sq6qqUDnHSDR3icq\nYDEkx2h/vlb4xpaFXHx5ESxGLB24v1Li4eN9T0x/HEgmUOk9zhH0aQ2bMorSGz9d\ng6nb9pmOsm2aAdSY3Jq+QeZue+XgoyumZxBiiUjrfWHOwlRnrb5aaWA3eGrHfFDn\nwRlGYfZBwyNH95x15n861Ps=\n-----END PRIVATE KEY-----"
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    console.log('[Firebase Admin] Initialized with hardcoded service account')
  } catch (error) {
    console.error('[Firebase Admin] Initialization Error:', error)
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
