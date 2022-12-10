import React, { useState } from 'react';
import { Autocomplete } from './components';
import './App.css';

import { SuggestionType } from './components/Autocomplete/Autocomplete.types';

function App() {
  const [selectedValue, setSelectedValue] = useState<SuggestionType | null>(null);

  return (
    <div className="App">
      <Autocomplete
        onSelect={setSelectedValue}
      />

      {selectedValue && (<div>Selected option: {selectedValue?.label}</div>)}
    </div>
  );
}

export default App;
