import React, { useCallback, useEffect, useState } from 'react';
import { useDebouncedValue } from '../../hooks';
import './Autocomplete.css';

interface AutocompleteProps {
  id?: string;
  label?: string;
  initialValue?: string;
}

const Autocomplete = ({ ...props }) => {
  const {
    id = "Autocomplete",
    label,
    initialValue = ""
  }: AutocompleteProps = props;

  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedSearchValue = useDebouncedValue(searchValue);
  const [options, setOptions] = useState([]);

  const getSearchResults = useCallback((query: string) => {
    console.log(query);
  }, [debouncedSearchValue]);

  useEffect(() => {
    getSearchResults(debouncedSearchValue)
  }, [debouncedSearchValue, getSearchResults])

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
        value={searchValue}
        onChange={({ target }) => setSearchValue(target.value)}
      />

      {searchValue}

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
