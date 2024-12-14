const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert('./FirebaseAccoutKey.json'),
});

const db = admin.firestore();

module.exports = { admin, db };