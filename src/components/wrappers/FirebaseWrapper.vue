<script setup lang="ts">
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth";
</script>

<script lang="ts">
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVDOzoryNx797bfAz-PVPmoXqDieHA8zI",
  authDomain: "travians.firebaseapp.com",
  projectId: "travians",
  storageBucket: "travians.appspot.com",
  messagingSenderId: "314401414629",
  appId: "1:314401414629:web:c7fb478611b3268e5f230c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
setPersistence(auth, browserLocalPersistence);
</script>
<template></template>
