/**
 * One-time script: drop the old non-sparse firebaseUid index
 * so Mongoose can recreate it with sparse: true.
 * Run once: node scripts/fixFirebaseUidIndex.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const collection = db.collection('users');

    try {
        await collection.dropIndex('firebaseUid_1');
        console.log('✅ Dropped old firebaseUid_1 index');
    } catch (e) {
        console.log('ℹ️  Index did not exist or already dropped:', e.message);
    }

    // Mongoose will recreate it with sparse: true on next app start
    await mongoose.disconnect();
    console.log('Done. Restart your backend server to apply the new sparse index.');
    process.exit(0);
}).catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
});
