// firebase.js
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'
import {firebaseConfig} from './firebaseConfig.js'


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

async function onGoogleSignIn() {
  const provider = new GoogleAuthProvider()
  try {
    await signInWithPopup(auth, provider)
  } catch (error) {
    console.error(error)
  }
}

document.getElementById('google-signin-btn').addEventListener('click', onGoogleSignIn)

// widget.js
function initializeLlamaTree() {
  const llamaTree = document.querySelector('llama-tree-chat-widget')
  if (!llamaTree) {
    return setTimeout(initializeLlamaTree, 500) // Check every 500ms if llamaTree is available
  }


  document.getElementById('send-message-btn').addEventListener('click', sendMessage)
  function sendMessage() {
    const input = document.getElementById('message-input')
    const message = input.value
    input.value = ''
    llamaTree.sendMessage(message)
  }

  document.getElementById('load-system-message-btn').addEventListener('click', loadSystemMessage)

  function loadSystemMessage() {
    const titleInput = document.getElementById('system-message-title-input');
    const title = titleInput.value;
    titleInput.value = '';

    const contentTextArea = document.getElementById('system-message-content-input');
    let content = contentTextArea.value;
    contentTextArea.value = '';

    llamaTree.loadSystemMessage({
      title,
      content,
    });
  }


  auth.onAuthStateChanged(async (user) => {
    if (user) {
      await llamaTree.setProps({
        user,
        // onFunctionCall: (functionName, args) => {
        //   console.log('Function call', functionCall)
        // },
        onLlamaAction: (action) => {
          console.log('Llama action', action)
        },
      })

      llamaTree.setChatView({
        isOpen: true,
        isHistoryDrawerOpen: true,
        isLarge: true,
      })
    }
  })
}

initializeLlamaTree()
