import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js'
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";

// Initialize Firebase
console.log("INITIALIZING FIREBASE", fbConfig)
const app = initializeApp(fbConfig);
const analytics = getAnalytics();
const auth = getAuth(app)

console.log('fbapp ready:', app)

export { app, auth, onAuthStateChanged, analytics }
