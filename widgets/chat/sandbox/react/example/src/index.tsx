import * as React from 'react';
import * as ReactDOM from "react-dom";
import { Thing, LlamaTreeProvider } from '../../dist';

const App = () => {
  return (
    <LlamaTreeProvider url={"http://localhost:3001"}>
      <Thing />
    </LlamaTreeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
