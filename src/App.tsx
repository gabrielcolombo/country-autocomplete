import React, { useEffect, useState } from 'react';
import { Autocomplete } from './components';
import './App.css';

import { SuggestionType } from './components/Autocomplete/Autocomplete.types';

function App() {
  const [country, setCountry] = useState<SuggestionType | null>(null);

  return (
    <div className="App">
      <header>
        <div className="container">
          The Country Encyclopedia
        </div>
      </header>

      <main>
        <div className="container">
          {!country
            ? (
                <>
                  <h1>Pick a country below to know more about it</h1>
                  <Autocomplete
                    onSelect={setCountry}
                    onClear={() => setCountry(null)}
                  />
                </>
              )
            : (
                <section>
                  <h2>
                    {country.value.name.common} {country.value.flag}
                  </h2>

                  <p>
                    Also known as {country.value.altSpellings.join(' / ')}, its a country
                    located in {country.value.subregion}.
                  </p>

                  <p>
                    It has a population of {country.value.population.toLocaleString()} peopleand
                    {Object.values(country.value.languages).length} official language(s)
                    ({Object.values(country.value.languages).join(' / ')}).
                  </p>
                  
                  <button onClick={() => setCountry(null)}>Pick another country</button>
                </section>
              )
          }
        </div>
      </main>
    </div>
  );
}

export default App;
