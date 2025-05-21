// Firebase Configuration
// Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyAYlunVVu4SO6ArsK5RxEUmMYq6CsdjX7I",
    authDomain: "blocsyde-6312e.firebaseapp.com",
    projectId: "blocsyde-6312e",
    storageBucket: "blocsyde-6312e.firebasestorage.app",
    messagingSenderId: "441143409009",
    appId: "1:441143409009:web:6ec98cbc6990914c041ed0"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Check authentication state
  auth.onAuthStateChanged(user => {
    // For admin pages, redirect if not logged in
    if (window.location.pathname.includes('/admin/dashboard.html') && !user) {
      window.location.href = '/admin/login.html';
    }
    
    // For login page, redirect if already logged in
    if (window.location.pathname.includes('/admin/login.html') && user) {
      window.location.href = '/admin/dashboard.html';
    }
  });