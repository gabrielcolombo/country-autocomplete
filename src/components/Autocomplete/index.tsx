import React, { useCallback, useEffect, useState, useRef } from 'react';
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

  const inputRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedSearchValue = useDebouncedValue(searchValue);
  const [options, setOptions] = useState([]);

  const getSearchResults = useCallback((query: string) => {
    setIsSearching(true);

    setTimeout(() => setIsSearching(false), 2000)
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (isFocused && searchValue.length > 0) {
      getSearchResults(debouncedSearchValue)
    }
  }, [isFocused, debouncedSearchValue, getSearchResults])

  return (
    <div id={id}>
      {label && (
        <label htmlFor={`${id}__input`}>
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        id={`${id}__input`}
        autoComplete="off"
        role="combobox"
        aria-expanded="false"
        aria-autocomplete="list"
        aria-controls={`${id}__listbox`}
        value={searchValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
        }}
        onChange={({ target }) => setSearchValue(target.value)}
      />

      {isFocused.toString()}

      <ul
        id={`${id}__listbox`}
        role="listbox"
        {...(label) ? { "aria-label": label } : {}}
      >
        {isSearching
          ? <li>
              Searching...
            </li>
          : options.map((option, index) => (
            <li
              className="suggestions__item"
              role="option"
              aria-posinset={index + 1}
              aria-setsize={options.length}
              aria-selected="true"
              tabIndex={-1}
              key={`${JSON.stringify(option)}__${index}`}
            >
              Option #{index}
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Autocomplete;
