import firebase from './firebase';
import 'firebase/messaging';

const messaging = firebase.messaging();

const firebaseConfig = {
    apiKey: "AIzaSyAQ9QTUwifPljmoyHwLFYIRK6o0-CPlIHU",
    authDomain: "senior-thesis-a5626.firebaseapp.com",
    projectId: "senior-thesis-a5626",
    storageBucket: "senior-thesis-a5626.appspot.com",
    messagingSenderId: "277988029521",
    appId: "1:277988029521:web:ea938a778f083124933470",
    measurementId: "G-9T0WCGN9LT"
};

firebase.initializeApp(firebaseConfig);

export const getToken = (setTokenFound) => {
  return messaging.getToken({vapidKey: 'GENERATED_MESSAGING_KEY'}).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
}

export default firebase;