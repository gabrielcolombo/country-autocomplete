import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDebouncedValue } from '../../hooks';
import './Autocomplete.css';

interface AutocompleteProps {
  id?: string;
  label?: string;
  initialValue?: string;
}

type Suggestion = {}

const KEYCODES = {
  ENTER: "Enter",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown"
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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [highlightedOption, setHighlightedOption] = useState<number | null>(null);

  const handleKeyboardNavigation = (keyCode: string) => {
    const lastSuggestionIndex = suggestions.length - 1;
    const isLastItemSelected = highlightedOption === lastSuggestionIndex;

    switch(keyCode) {
      case KEYCODES.ARROW_UP:
        setHighlightedOption(!highlightedOption ? lastSuggestionIndex : highlightedOption - 1);
        break;
      case KEYCODES.ARROW_DOWN:
        setHighlightedOption(isLastItemSelected || highlightedOption === null ? 0 : highlightedOption + 1);
        break;
      default:
        break;
    }
  }

  const getSearchResults = useCallback((query: string) => {
    setIsSearching(true);
    
    setTimeout(() => {
      setSuggestions([{}, {}, {}, {}, {}, {}]);
      setIsSearching(false);
    }, 2000)
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (isFocused && searchValue.length > 0) {
      getSearchResults(debouncedSearchValue)
    }
  }, [isFocused, debouncedSearchValue, getSearchResults])

  return (
    <div
      id={id}
      onKeyDown={({ code }) => handleKeyboardNavigation(code)}
    >
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
        onChange={({ target }) => setSearchValue(target.value)}
        onBlur={({ relatedTarget }) => {
          if (!relatedTarget || relatedTarget.tagName !== "LI") {
            setIsFocused(false);
            setSuggestions([]);
          }
        }}
      />

      {isFocused && suggestions.length > 0 && (
        <ul
          id={`${id}__listbox`}
          role="listbox"
          {...(label) ? { "aria-label": label } : {}}
        >
          {isSearching
            ? <li>
                Searching...
              </li>
            : suggestions.map((suggestion, index) => (
              <li
                className={[
                  "suggestions__item",
                  highlightedOption === index ? "suggestions__item--highlighted" : ""
                ].join(" ")}
                role="option"
                aria-posinset={index + 1}
                aria-setsize={suggestions.length}
                aria-selected="true"
                tabIndex={-1}
                key={`${JSON.stringify(suggestion)}__${index}`}
                onMouseEnter={() => setHighlightedOption(index)}
              >
                Option #{index}
              </li>
            ))
          }
        </ul>
      )}
    </div>
  )
}

export default Autocomplete;
