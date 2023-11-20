# Llama Tree API & Chat Widget

## Overview
Llama Tree integrates an assistant powered by OpenAI and iOgpt, with a chat widget on the bottom left part that can be integrated in any site. The assistant is designed to provide information and interact with web applications through an API. Originally developed for translation tasks, it has been expanded to support a wider range of functionalities.

The chat widget, developed as a web component, can be integrated into various frontend environments. This widget is designed to be embedded in different types of web applications, providing users with access to the assistant's capabilities. The integration process involves including a script tag in the frontend application.

## Technical Stack
- Node.js
- React (for the Chat Widget)
- TypeScript
- Docker
- Firebase Firestore (migration to a Dockerized Hasura planned)
- OpenAI & iOgpt
- Express.js

## File Structure
Key directories and files:
- `server/`: Contains server-side application logic.
- `widgets/chat/`: Front-end React application for the chat interface.
- `Dockerfile`, `docker-compose.yaml`: Docker configurations.
- `server/.env.example`: Template for required environment variables.

## Installation and Setup
1. Create a new Firestore instance and a web app in the Firebase console to obtain the client and admin API keys.
2. Populate the `.env` file with these keys and other necessary configurations as per `server/.env.example`.
3. Clone the repository and navigate to the project directory.
4. Build the Docker images: `docker-compose build`.
5. Start the Docker containers: `docker-compose up`.

## Using the Sandbox Environment
The Llama Tree project includes a sandbox environment, which provides a simple and interactive way to test and demonstrate the chat widget's capabilities.

### Sandbox Setup

#### Configure Firebase
1. Create a file named `firebaseConfig.js` in the `widgets/chat/sandbox/vanilla/` directory.
2. Copy the contents of `firebaseConfig.example.js` into this new file.
3. Replace the values in `firebaseConfig.js` with your own Firebase project's configuration.

#### Running the Sandbox
- Ensure the Llama Tree server is running and accessible.
- Open `index.html` in a web browser.
- The sandbox provides a UI for signing in with Google, sending messages, and loading system messages into the chat widget.

#### Features Demonstrated in Sandbox
- **Google Sign-In:** Authenticate users with their Google account.
- **Send Messages:** Interact with the chat widget by sending messages and receiving responses.
- **Load System Messages:** Test loading predefined system messages into the chat.
- **Function Calls:** Simulate function calls to test widget's response to various inputs.

The sandbox environment is an excellent tool for developers to experiment with the chat widget's functionalities in a controlled setting.

## Integrating the Chat Widget Web Component
The Llama Tree project provides a dynamic endpoint `/module`, which serves the necessary JavaScript for integrating the chat widget into various frontend environments.

### Integration Steps
1. **Include the Web Component Script:**
   Insert `<script src="YOUR_HOST_URL/module"></script>` into the HTML header of your frontend application, where `YOUR_HOST_URL` is the URL of the deployed server. This script dynamically creates and appends the `llama-tree-chat-widget` element to the document body and loads the necessary widget script.

2. **Initialization:**
   The script obtained from the `/module` endpoint automatically performs the necessary initialization for the chat widget. It creates a `llama-tree-chat-widget` element, sets the server URL, and loads the widget's JavaScript module.

### Widget Configuration
Upon loading the script from the `/module` endpoint, the chat widget is ready for use. The widget interacts with the server to handle chat functionalities and assistant interactions. Ensure that the server is properly configured and running to enable full functionality of the chat widget.

### Web Component API
These methods provide a comprehensive API for interacting with the chat widget, offering functionalities for managing messages, session parameters, UI state, and event handling.

#### 1. `chatWidget` Instance
The `ChatWidgetElement` class exposes several methods and properties for interacting with the chat widget
```javascript
const chatWidget = document.querySelector('llama-tree-chat-widget');
```

#### 2. `setProps(props: LlamaTreeProps)`
Configure the widget with custom properties and event handlers.
```javascript
chatWidget.setProps({
  user: firebaseUser, // Your authenticated Firebase user
  customCssUrl: 'https://yourserver.com/custom-style.css',
  onLlamaAction: (action) => console.log('Action occurred:', action),
  onFunctionCall: (functionCall) => console.log('Function called:', functionCall)
});
```

#### 3. `loadSystemMessage(systemMessage: LlamaLoadedSystemMessage)`
Load a system message into the chat.
```javascript
chatWidget.loadSystemMessage({
  title: 'System Alert',
  content: 'This is a system-generated message.'
});
```

#### 4. `removeLoadedSystemMessage(id: string)`
Removes a specific loaded system message from the chat by its ID.
```javascript
chatWidget.removeLoadedSystemMessage('messageId123');
```

#### 5. `loadSystemMessages(systemMessages: LlamaLoadedSystemMessage[])`
Loads multiple system messages into the chat.
```javascript
chatWidget.loadSystemMessages([
  { title: 'Welcome', content: 'Hello! How can I assist you?' },
  { title: 'Notice', content: 'System will be under maintenance tonight.' }
]);
```

#### 6. `removeLoadedSystemMessages(ids: string[])`
Removes multiple loaded system messages from the chat using their IDs.
```javascript
chatWidget.removeLoadedSystemMessages(['messageId123', 'messageId456']);
```

#### 7. `emptyLoadedSystemMessages()`
Clears all loaded system messages from the chat.
```javascript
chatWidget.emptyLoadedSystemMessages();
```

#### 8. `sendLlamaMessage(message: string, params?: LlamaChatParams)`
Send a message to the assistant.
```javascript
chatWidget.sendLlamaMessage('Hello there!', { model: 'gpt-3.5-turbo' })
  .then(response => console.log('Assistant response:', response));
```

#### 9. `setChatParams(params: LlamaChatParams)`
Set parameters for the chat session.
```javascript
chatWidget.setChatParams({
  model: 'gpt-4',
  max_tokens: 150
});
```

#### 10. `setChatView(view: Partial<LlamaChatViewSliceState>)`
Configures the chat view's appearance and behavior, such as opening or closing the chat window, showing the history drawer, etc.
```javascript
chatWidget.setChatView({
  isOpen: true,
  isLarge: false,
  isHistoryDrawerOpen: true
});
```

#### 11. `setChatId(chatId: string)`
Sets the current chat session ID, typically used for managing and retrieving specific chat sessions.
```javascript
chatWidget.setChatId('uniqueChatSessionId');
```

#### 12. `onFunctionCall(callback: (functionCall: FunctionCall) => void)`
Sets a callback function to be invoked when a function call is made within the chat.
```javascript
chatWidget.onFunctionCall((functionCall) => {
  console.log('Received function call:', functionCall);
});
```

#### 13. `onLlamaAction(callback: (action: LlamaActions) => void)`
Sets a callback function to be invoked when an action occurs in the chat, allowing for custom event handling.
```javascript
chatWidget.onLlamaAction((action) => {
  console.log('Received action:', action);
});
```

## Tutorial: Function Calling for Page Redirection

### Step 1: Define an Array of Page Names
First, create an array of page names that represents the different pages users can be redirected to.

```javascript
const pages = {
  home: '/',
  about: '/about',
  contact: '/contact'
  // Add more pages as needed
};
```

### Step 2: Set Chat Parameters with `redirectTo` Function
Configure the chat widget to recognize a `redirectTo` function call. This function will be used to redirect users to different pages.

```javascript
chatWidget.setChatParams({
  functions: [
    {
      name: 'redirectTo',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            enum: Object.keys(pages)
          }
        },
        required: ['page']
      },
      description: 'Redirects to a specified page'
    }
  ]
});
```

In this setup, the `redirectTo` function expects a parameter `page` which should be one of the keys in the `pages` object.

### Step 3: Handle Function Calls for Redirection
Implement a handler for the `redirectTo` function call within the `onFunctionCall` method. This function will change the window's location based on the page specified in the function call.

```javascript
chatWidget.onFunctionCall((functionCall) => {
  if (functionCall.name === 'redirectTo') {
    const pageName = functionCall.arguments.page;
    const pageUrl = pages[pageName];

    if (pageUrl) {
      window.location.href = pageUrl; // Redirects the user to the new URL
    } else {
      console.error('Page not found:', pageName);
    }
  }
});
```

This function checks if the `redirectTo` function call is made and then redirects the user to the URL associated with the specified page name. If the page name doesn't exist in the `pages` object, it logs an error.

By following these steps, you'll be able to use function calls within your chat widget to redirect users to different pages of your web application. This tutorial assumes that you have a basic understanding of how the chat widget integrates into your application and that the widget is already set up to handle function calls.

### Simulated Chat Conversation

```plaintext
Message 1: User
"Hello! Can you help me navigate your site?"

Message 2: Assistant
"Of course! I can guide you through our website. Which section would you like to visit?"

Message 3: User
"I'm looking for contact information."

Message 4: Assistant
"You can find our contact information on the Contact page. Would you like me to take you there?"

Message 5: User
"Yes, please take me to the Contact page."

Assistant (Function Call Triggered)
```
At this point, the assistant triggers the `redirectTo` function call with the argument to redirect to the Contact page.

## Configuring Firebase Security Rules

Proper configuration of Firebase security rules is essential for ensuring the security and integrity of your chat data. These rules control who has read and write access to your Firebase database. For the Llama Tree Chat Widget, specific rules need to be set to ensure that chat data can only be accessed and modified by authorized users.

### Setting Up Security Rules

To set up these rules, navigate to the Firebase Console, select your project, go to the Firestore Database section, and then to the 'Rules' tab. Update your security rules as follows:

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Rules for assistant chat
    match /assistantChat/{userId} {
      // Allows creating chat sessions for authenticated users
      allow create: if request.auth.uid != null;

      // Sub-collection 'chats' can only be read and written by the user who owns this assistantChat document
      match /chats/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }

    // Add other rules as necessary for your application
  }
}
```

### Explanation of Rules

- The rule under `/assistantChat/{userId}` allows authenticated users to create a chat session.
- The nested rule within `/assistantChat/{userId}/chats/{document=**}` ensures that the chats sub-collection can only be accessed by the user who owns the parent `assistantChat` document.

### Important Notes

- Always validate and test your security rules in the Firebase Console to ensure they work as expected.
- Regularly review and update your rules to maintain security, especially if you make changes to how your application interacts with Firestore.

Including these security rules ensures that your application's chat data is secure and is accessed appropriately in line with your application's logic and user authentication.

## Current Limitations
- **Fallback Mechanisms**: There are no fallback systems in place yet. This is a proof-of-concept, and while errors are handled and displayed in the widget, the error messaging could be made more user-friendly.
- **Scaling and Performance**: The project has not been fully tested for scaling and performance, particularly with Firestore and SSE. There are known race conditions that need addressing.

## Future Plans
- **Database Migration**: We plan to migrate from Firestore to a dockerized Hasura for better database management.
- **Admin Panel**: Development of an admin panel for more straightforward management of function calls and future features to fine-tune the assistant.

## Contributing
Contributions are welcome. Please follow the guidelines in `CONTRIBUTING.md` (if available).

## License
This project is licensed under the MIT license. See the `LICENSE` file for details.
