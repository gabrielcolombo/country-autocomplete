import React, { useState } from 'react';
import { Autocomplete } from './components';
import './App.css';

import { SuggestionType } from './components/Autocomplete/Autocomplete.types';

function App() {
  const [country, setCountry] = useState<SuggestionType | null>(null);

  return (
    <div className="App">
      <header>
        <div className="container">
          <h1>The Country Encyclopedia</h1>
        </div>
      </header>

      <div className="container">
        <hr />
      </div>

      <main>
        <div className="container">
          {!country
            ? (
                <>
                  <h2>Search for a country below to find out more about it</h2>

                  <Autocomplete
                    id="countries"
                    placeholder="Name of the country"
                    onSelect={setCountry}
                    onClear={() => setCountry(null)}
                  />
                </>
              )
            : (
                <div className="card">
                  <h2 className="card__title">
                    {country.value.flag} {country.value.name.common}
                  </h2>

                  <div className="card__content">
                    <p>
                      Also known as <b>{country.value.altSpellings.join(' / ')}</b>, its a country
                      located in <b>{country.value.subregion}</b>.
                    </p>

                    <p>
                      It has a population of <b>{country.value.population.toLocaleString()}</b> people and
                      &nbsp;<b>{Object.values(country.value.languages).length}</b> official language(s)
                      (<b>{Object.values(country.value.languages).join(' / ')}</b>).
                    </p>
                  </div>
                  
                  <button onClick={() => setCountry(null)}>
                    Pick another country
                  </button>
                </div>
              )
          }
        </div>
      </main>
    </div>
  );
}

export default App;
