import React, { useState } from 'react';
import './Autocomplete.css';

const Autocomplete = ({ ...props }) => {
  const {
    id = "Autocomplete",
    label,
    initialValue = ""
  } = props;

  const [query, setQuery] = useState(initialValue);
  const [options, setOptions] = useState([]);

  return (
    <div id={id}>
      {label && (
        <label htmlFor={`${id}__input`}>
          {label}
        </label>
      )}

      <input
        id={`${id}__input`}
        autoComplete="off"
        role="combobox"
        aria-expanded="false"
        aria-autocomplete="list"
        aria-controls={`${id}__listbox`}
        value={query}
        onChange={({ target }) => setQuery(target.value)}
      />

      {query}

      <ul
        id={`${id}__listbox`}
        role="listbox"
        {...(label) ? { "aria-label": label } : {}}
      >
        {options.map((option, index) => (
          <li
            role="option"
            aria-posinset={index + 1}
            aria-setsize={options.length}
            aria-selected="true"
            tabIndex={-1}
            key={`${JSON.stringify(option)}__${index}`}
          >
            Option #{index}
          </li>
        ))}
        
      </ul>
    </div>
  )
}

export default Autocomplete;
