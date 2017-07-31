import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
  apiKey: "AIzaSyCTQ46dxQdNMmlf6zPmmh5MrTDT91jZgKQ",
  authDomain: "pseudogram-cee1b.firebaseapp.com",
  databaseURL: "https://pseudogram-cee1b.firebaseio.com",
  projectId: "pseudogram-cee1b",
  storageBucket: "pseudogram-cee1b.appspot.com",
  messagingSenderId: "44453532176"
});

ReactDOM.render( < App / > ,
  document.getElementById('root')
);
registerServiceWorker();
