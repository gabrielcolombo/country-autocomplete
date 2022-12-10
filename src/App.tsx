import React from 'react';
import { Autocomplete } from './components';
import './App.css';

function App() {
  return (
    <div className="App">
      <Autocomplete initialValue={"123"} />
    </div>
  );
}

export default App;
