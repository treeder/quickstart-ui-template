import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js'
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";

// Initialize Firebase
const app = initializeApp(fbConfig);
const auth = getAuth(app)
var analytics = null;
if (firebaseConfig.measurementId) {
    analytics = getAnalytics();
}

export { app, auth, onAuthStateChanged, analytics }
