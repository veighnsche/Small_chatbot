// firebase.js
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'
import {firebaseConfig} from './firebaseConfig.js'


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

async function onGoogleSignIn() {
  console.log('Sign in with Google')
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

  /**
   * @type {ChatWidgetElement}
   */
  const llamaTree = document.querySelector('llama-tree-chat-widget')
  if (!llamaTree) {
    return setTimeout(initializeLlamaTree, 500) // Check every 500ms if llamaTree is available
  }

  document.getElementById('send-message-btn').addEventListener('click', sendMessage)

  async function sendMessage() {
    const input = document.getElementById('message-input')
    const message = input.value
    input.value = ''
    const assistantMessage = await llamaTree.sendLlamaMessage(message)

    console.log('Assistant message', assistantMessage)
  }

  document.getElementById('load-system-message-btn').addEventListener('click', loadSystemMessage)

  function loadSystemMessage() {
    const titleInput = document.getElementById('system-message-title-input')
    const title = titleInput.value
    titleInput.value = ''

    const contentTextArea = document.getElementById('system-message-content-input')
    let content = contentTextArea.value
    contentTextArea.value = ''

    llamaTree.loadSystemMessage({
      title,
      content,
    })
  }

  document.getElementById('set-function-call-btn').addEventListener('click', setFunctionCall)

  async function setFunctionCall() {
    llamaTree.loadSystemMessage({
      title: 'Motivation',
      content: '```markdown\n' +
        'As a senior front-end developer at iO, my relentless pursuit of understanding cutting-edge AI technologies has led to mastery over LLMs and generative AI systems like DALL-E and Stable diffusion. My journey is fueled by the desire to drive change, inspire innovation, and empower others in the dynamic world of technology. I view every challenge as an opportunity for growth, pushing boundaries to shape the future of our digital landscape.\n' +
        '\n' +
        '- Shows a genuine passion for the field of AI, Data Science, and Software Engineering, reflecting a strong intrinsic motivation and dedication to the work.\n' +
        '- Thrives in dynamic and challenging environments, where the opportunity to push the boundaries of AI is met with enthusiasm.\n' +
        '- Possesses a track record of delivering MVPs within tight timelines, demonstrating the ability to work efficiently and effectively in fast-paced settings.\n' +
        '- Displays curiosity and an eagerness to explore and overcome technical challenges, signaling a proactive approach to continuous learning and growth.\n' +
        '- Communicates effectively and collaborates seamlessly with colleagues from diverse teams, indicating strong interpersonal skills and the ability to work collaboratively.\n' +
        '\n' +
        '```',
    })

    await llamaTree.sendLlamaMessage('Translate into Dutch', {
      model: 'gpt-3.5-turbo',
      function_call: {name: 'set_motivation'},
      functions: [
        {
          name: 'set_motivation',
          description: 'Set the motivation in the edit form of the user',
          parameters: {
            type: 'object',
            properties: {
              updated_motivation: {
                type: 'object',
                description:
                  'The updated motivation based on the user\'s input.',
                properties: {
                  markdown: {
                    type: 'string',
                    description: 'The updated motivation in markdown format',
                  },
                },
                required: ['markdown'],
              },
            },
            required: ['updated_motivation'],
          },
        },
      ],
    })
  }

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      await llamaTree.setUser(user)

      llamaTree.setChatView({
        isOpen: true,
        isHistoryDrawerOpen: true,
        isLarge: true,
      })
    }
  })

  llamaTree.onFunctionArgumentsStream('set_motivation', (args) => {
    if (args && 'updated_motivation' in args) {
      const updatedMotivation = args.updated_motivation
      if (updatedMotivation && 'markdown' in updatedMotivation) {
        const markdown = updatedMotivation.markdown
        if (markdown) {
          /**
           * @type {HTMLDivElement}
           */
          const textContainer = document.getElementById('text-container')
          textContainer.innerHTML = markdown
        }
      }
    }
  })
}

initializeLlamaTree()
