import React from 'react';
import ReactDOM from 'react-dom';
import App from "../App";

class ChatWidgetElement extends HTMLElement {
  connectedCallback() {
    ReactDOM.render(<App />, this);
  }

  disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this);
  }
}

customElements.define('chat-widget', ChatWidgetElement);
