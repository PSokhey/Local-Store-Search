//---------------------------------------------------
// replace the lines below with your own "firebaseConfig"
// key value pairs
//--------------------------------------------------- 

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAzSTPSshHMenAtU6yzhhMVv6aXRxr7u7A",
    authDomain: "localstoresearchproject.firebaseapp.com",
    projectId: "localstoresearchproject",
    storageBucket: "localstoresearchproject.appspot.com",
    messagingSenderId: "1060426772473",
    appId: "1:1060426772473:web:264cd542e1bb54a3ea9728"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Get a reference to database
const db = firebase.firestore();
// Get a reference to the storage service, which is used to create references in your storage bucket
// const storage = firebase.storage();