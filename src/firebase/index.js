import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "<your-api-key>",
    authDomain: "'<your-authDomain>'",
    databaseURL:"<your-databaseURL>",
    projectId: "<your-projectId>",
    storageBucket: "<your-storageBucket>",
    messagingSenderId: "<your-messagingSenderId>",
    appId: "<your-appId>",
    measurementId: "<your-measurementId>"
  };

  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage();

  export {storage, firebase as default};