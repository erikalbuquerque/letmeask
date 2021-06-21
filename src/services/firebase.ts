import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyAIhwjI0NCJavUY7aWwaXJ-TGNfJ_P1kow",
  authDomain: "letmeask-ac39b.firebaseapp.com",
  databaseURL: "https://letmeask-ac39b-default-rtdb.firebaseio.com",
  projectId: "letmeask-ac39b",
  storageBucket: "letmeask-ac39b.appspot.com",
  messagingSenderId: "262991099305",
  appId: "1:262991099305:web:58692901fc2e748522c0b8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const database = firebase.database()

export { auth, database }
