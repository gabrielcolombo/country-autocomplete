import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDebouncedValue } from '../../hooks';
import { CountryRepository } from '../../repositories';
import { Country } from '../../repositories/CountryRepository';
import './Autocomplete.css';
import { SuggestionType } from './Autocomplete.types';
interface AutocompleteProps {
  id?: string;
  label?: string;
  initialValue?: SuggestionType;
  onSelect?: Function;
  onClear?: Function
}

const KEYCODES = {
  ENTER: "Enter",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ESCAPE: "Escape"
}

const Autocomplete = ({ ...props }) => {
  const {
    id = "Autocomplete",
    initialValue = { label: "", value: null },
    label,
    onSelect,
    onClear
  }: AutocompleteProps = props;

  let ongoingRequest = useRef<any>(null);
  const inputRef = useRef<any>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchValue, setSearchValue] = useState<string>(initialValue.label);
  const debouncedSearchValue = useDebouncedValue(searchValue);
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [highlightedOption, setHighlightedOption] = useState<number | null>(null);

  const handleSuggestionSelect = (suggestion: SuggestionType): void => {
    inputRef?.current?.blur();

    setSuggestions([]);
    setSearchValue(suggestion.label);
    setIsFocused(false);
    setHighlightedOption(null);

    onSelect?.(suggestion);
  }

  const handleSelectionClear = () => {
    setSearchValue("");
    setSuggestions([]);
    setHighlightedOption(null);

    if (onClear) {
      onClear()
    }
  }

  const handleKeyboardNavigation = (keyCode: string): void => {
    const lastSuggestionIndex = suggestions.length - 1;
    const isLastItemSelected = highlightedOption === lastSuggestionIndex;
    
    switch(keyCode) {
      case KEYCODES.ENTER:
        if (highlightedOption) {
          handleSuggestionSelect(suggestions[highlightedOption]);
        }
        break;
      case KEYCODES.ESCAPE:
        handleSelectionClear()
        break;
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

  const getSearchResults = useCallback(async (query: string): Promise<void> => {
    try {
      if (ongoingRequest.current) {
        ongoingRequest.current.abort();
      }

      setIsSearching(true);
    
      const request = CountryRepository.fetchCountryByName(query);

      ongoingRequest.current = request;

      const response = await request.response;
      const countries = response.map((country: Country) => ({ label: country.name.common, value: country }))

      setSuggestions(countries);
    } catch(err) {
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect((): void => {
    if (isFocused && searchValue.length > 1) {
      getSearchResults(debouncedSearchValue)
    }
  }, [isFocused, debouncedSearchValue, searchValue.length, getSearchResults])

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

      {isSearching && (
        <div>Searching</div>
      )}

      {isFocused && !isSearching && suggestions.length > 0 && (
        <dl
          id={`${id}__listbox`}
          role="listbox"
          {...(label) ? { "aria-label": label } : {}}
        >
          {suggestions.map((suggestion, index) => (
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
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <b>{suggestion.value.flag} {suggestion.label}</b>
              <small>{suggestion.value.altSpellings.join(", ")}</small>
            </li>)
          )}
        </dl>
      )}
    </div>
  )
}

export default Autocomplete;
