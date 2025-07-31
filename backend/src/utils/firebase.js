// Firebase initialization for file uploads
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const admin = require('firebase-admin');

// You must place your Firebase service account key JSON at the root as 'firebase-service-account.json'
const serviceAccount = require('../../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'makeup-6d473.appspot.com'
});

const bucket = getStorage().bucket();

module.exports = bucket;
