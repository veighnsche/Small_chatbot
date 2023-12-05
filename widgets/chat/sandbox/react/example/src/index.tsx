import * as React from 'react';
import * as ReactDOM from "react-dom";
import { LlamaTreeProvider } from '../../dist';

const App = () => {
  return (
    <LlamaTreeProvider url={"http://localhost:3001"}>
      <div>hello</div>
    </LlamaTreeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
