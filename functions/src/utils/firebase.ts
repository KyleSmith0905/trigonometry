import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";

const firebaseApp = initializeApp();
const firebaseAuth = getAuth();
const firebaseFirestore = getFirestore();

export { firebaseApp, firebaseAuth, firebaseFirestore };