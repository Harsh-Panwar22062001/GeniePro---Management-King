import { initializeApp } from "firebase/app";
import { getAuth, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARxumgUGi5VqpcJo4PYu4JXUZ-janZUB8",
  authDomain: "geniepro-ff87f.firebaseapp.com",
  projectId: "geniepro-ff87f",
  storageBucket: "geniepro-ff87f.appspot.com",
  messagingSenderId: "989253102095",
  appId: "1:989253102095:web:4b886d667f855f3c5e517a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize auth
const auth = getAuth(app);

// Export the functions and auth
export { getAuth, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink };
