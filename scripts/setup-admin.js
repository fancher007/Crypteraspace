// This script creates an admin user in Firebase
// Run with Node.js: node setup-admin.js

const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Function to create admin user
async function createAdminUser(email, password) {
  try {
    // Create user with email and password
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Add admin role to user
    await firebase.firestore().collection('users').doc(user.uid).set({
      email: email,
      role: 'admin',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Admin user created successfully: ${email}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close Firebase connection
    process.exit(0);
  }
}

// Get admin credentials from command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node setup-admin.js <email> <password>');
  process.exit(1);
}

const email = args[0];
const password = args[1];

// Create admin user
createAdminUser(email, password);