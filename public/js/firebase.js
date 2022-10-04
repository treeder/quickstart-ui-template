import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js"
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js'
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js"


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
var analytics = null;
if (firebaseConfig.measurementId) {
    analytics = getAnalytics();
}

export { app, auth, onAuthStateChanged, analytics }
