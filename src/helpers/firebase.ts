import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDxtU2qKJYhDMF1WsDHYAUgePz-PGEWLP4",
  authDomain: "trigonometry-simulator.firebaseapp.com",
  projectId: "trigonometry-simulator",
  storageBucket: "trigonometry-simulator.appspot.com",
  messagingSenderId: "778727333265",
  appId: "1:778727333265:web:a61fdafd59427cbc380e30",
  measurementId: "G-YHLCN88ZG8"
})

const mapAuthCodeToMessage = (authCode: string) => {
  if (authCode === "auth/wrong-password") return "Password provided is invalid.";
  else if (authCode === 'auth/invalid-email') return 'Email provided is invalid.';
  else if (authCode === 'auth/user-not-found') return 'User does not exist with that email.';
  else if (authCode === 'auth/email-already-in-use') return 'Email provided already exists under a different user.';
  else return 'Unknown error occurred, try a different email or password or try again later.';
}

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
if (import.meta.env.DEV) {
  connectFirestoreEmulator(firestore, 'localhost', 8080)
}

export { firebaseApp, mapAuthCodeToMessage, auth, firestore }