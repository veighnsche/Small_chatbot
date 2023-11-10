// firebase
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'

const firebaseConfig = {
  apiKey: 'AIzaSyCKEVvZx6wk5hNjNsSg4_a4DKFmOVRK9Xw',
  authDomain: 'weightlifting-plan-and-track.firebaseapp.com',
  databaseURL: 'https://weightlifting-plan-and-track-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'weightlifting-plan-and-track',
  storageBucket: 'weightlifting-plan-and-track.appspot.com',
  messagingSenderId: '448087616119',
  appId: '1:448087616119:web:63d8d524ef5bd3e6a43472',
  measurementId: 'G-6W8L2GY8D8',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const onGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider()
  try {
    await signInWithPopup(auth, provider)
  } catch (error) {
    console.error(error)
  }
}

auth.onAuthStateChanged((user) => {
  if (user) {
    passUserToWidget(user)
  }
})

document.getElementById('google-signin-btn').addEventListener('click', onGoogleSignIn)

// widget
const passUserToWidget = (user) => {
  const chatWidget = document.querySelector('llama-tree-chat-widget')
  chatWidget.setProps({
    url: 'http://localhost:3001',
    user,
    onFunctionCall: (functionName, args) => {
      console.log(functionName, args)
    },
  })
}

const sendMessage = () => {
  const input = document.getElementById('message-input')
  const message = input.value
  input.value = ''

  const chatWidget = document.querySelector('llama-tree-chat-widget')
  chatWidget.sendMessage(message)
}

document.getElementById('send-message-btn').addEventListener('click', sendMessage)
