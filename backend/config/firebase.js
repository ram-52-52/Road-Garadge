const admin = require('firebase-admin');

// IMPORTANT: Replace this with your actual service account JSON or use environment variables
// const serviceAccount = require("../path/to/serviceAccountKey.json");

/**
 * Initialize Firebase Admin SDK
 * For development, we might not have the service account key yet, 
 * so we enclose it in a try-catch to prevent the server from crashing.
 */
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      // credential: admin.credential.cert(serviceAccount),
      // For now, we use a placeholder or check for environment variables
      credential: admin.credential.applicationDefault(), 
    });
    console.log('🔥 Firebase Admin Initialized');
  }
} catch (error) {
  console.error('⚠️ Firebase Admin failed to initialize:', error.message);
}

module.exports = admin;
