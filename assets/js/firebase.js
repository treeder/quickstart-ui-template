import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js'
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'

// Initialize Firebase
console.log("INITIALIZING FIREBASE", fbConfig)
const app = initializeApp(fbConfig);
//- const analytics = getAnalytics();
const auth = getAuth(app);

// TEMP: flutter web issue: https://github.com/FirebaseExtended/flutterfire/issues/3356
//- const unsub = getAuth().onAuthStateChanged(() => unsub());

console.log('fbapp ready:', app)

export { app, auth };