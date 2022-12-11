import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDebouncedValue } from '../../hooks';
import { CountryRepository } from '../../repositories';
import { Country } from '../../repositories/CountryRepository';
import './Autocomplete.css';
import { AutocompleteProps, SuggestionType } from './Autocomplete.types';

const KEYCODES = {
  ENTER: "Enter",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ESCAPE: "Escape"
}

const highlight = (text: string, match: string) => text
  .replace(new RegExp(match, 'gi'), '_')
  .split('')
  .map((char: string) => char === "_" ? <mark key={char}>{match}</mark> : char)

const Autocomplete = ({ ...props }) => {
  const {
    id = "Autocomplete",
    placeholder = "Type at least 2 letters to search",
    initialValue = { label: "", value: null },
    label,
    onSelect,
    onClear
  }: AutocompleteProps = props;

  let ongoingRequest = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const suggestionsRef = useRef<any>([]);

  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchValue, setSearchValue] = useState<string>(initialValue.label);
  const debouncedSearchValue = useDebouncedValue(searchValue);
  const [suggestions, setSuggestions] = useState<SuggestionType[] | null>([]);
  const [highlightedOption, setHighlightedOption] = useState<number | null>(null);

  const handleSuggestionSelect = (suggestion: SuggestionType): void => {
    inputRef?.current?.blur();

    setSuggestions([]);
    setSearchValue(suggestion.label);
    setIsFocused(false);
    setHighlightedOption(null);
    suggestionsRef.current = [];

    onSelect?.(suggestion);
  }

  const handleSelectionClear = () => {
    setSearchValue("");
    setSuggestions([]);
    setHighlightedOption(null);
    suggestionsRef.current = [];

    if (onClear) {
      onClear()
    }
  }

  const handleArrowUpNavigation = (lastSuggestionIndex: number | null, isLastItemSelected: boolean): void => {
    const arrowUpIndex = !highlightedOption ? lastSuggestionIndex : highlightedOption - 1;
    setHighlightedOption(arrowUpIndex);

    if (arrowUpIndex !== null) {
      suggestionsRef.current[arrowUpIndex].scrollIntoViewIfNeeded();
    }
  }

  const handleArrowDownNavigation = (isLastItemSelected: boolean): void => {
    const arrowDownIndex = isLastItemSelected || highlightedOption === null ? 0 : highlightedOption + 1;

    setHighlightedOption(arrowDownIndex);
    suggestionsRef.current[arrowDownIndex].scrollIntoViewIfNeeded();
  }

  const handleKeyboardNavigation = (keyCode: string): void => {
    const lastSuggestionIndex = suggestions ? suggestions.length - 1 : null;
    const isLastItemSelected = highlightedOption === lastSuggestionIndex;
    
    switch(keyCode) {
      case KEYCODES.ENTER:
        if (suggestions && highlightedOption !== null) {
          handleSuggestionSelect(suggestions[highlightedOption]);
        }
        break;
      case KEYCODES.ESCAPE:
        handleSelectionClear();
        break;
      case KEYCODES.ARROW_UP:
        handleArrowUpNavigation(lastSuggestionIndex, isLastItemSelected);
        break;
      case KEYCODES.ARROW_DOWN:
        handleArrowDownNavigation(isLastItemSelected);
        break;
      default:
        break;
    }
  }

  const getSearchResults = useCallback(async (query: string): Promise<void> => {
    try {
      setIsSearching(true);
      setHighlightedOption(null);
      
      if (ongoingRequest.current) {
        ongoingRequest.current.abort();
      }
    
      const request = CountryRepository.fetchCountryByName(query);

      ongoingRequest.current = request;

      const response = await request.response;
      const countries = response.map((country: Country) => ({ label: country.name.common, value: country }))
      
      suggestionsRef.current = [];

      setSuggestions(countries);
      setIsSearching(false);
    } catch(err) {
      setIsSearching(false);
      setSuggestions(null);
    }
  }, []);

  useEffect((): void => {
    if (debouncedSearchValue.length === 0) {
      setSuggestions([])
    } else if (isFocused && debouncedSearchValue.length > 1) {
      getSearchResults(debouncedSearchValue)
    }
  }, [isFocused, debouncedSearchValue, getSearchResults])

  return (
    <div
      id={id}
      onKeyDown={({ code }) => handleKeyboardNavigation(code)}
      className="autocomplete"
    >
      {label && (
        <label
          htmlFor={`${id}__input`}
          className="autocomplete__label"
        >
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        id={`${id}__input`}
        className="autocomplete__input"
        autoComplete="off"
        role="combobox"
        aria-expanded={isFocused && !isSearching && suggestions !== null && suggestions.length > 0}
        aria-autocomplete="list"
        aria-controls={`${id}__listbox`}
        value={searchValue}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onChange={({ target }) => setSearchValue(target.value)}
        onBlur={({ relatedTarget }) => {
          if (!relatedTarget || relatedTarget.tagName !== "LI") {
            setIsFocused(false);
            setSuggestions([]);
            setHighlightedOption(null);

            suggestionsRef.current = [];
          }
        }}
      />

      {suggestions === null && !isSearching && (
        <div className="autocomplete__empty">No countries found for this search. Please, try again.</div>
      )}

      {isFocused && !isSearching && (suggestions && suggestions.length === 0) && searchValue.length === 0 && (
        <div className="autocomplete__validation">Please inform at least two letters to perform a search.</div>
      )}

      {isSearching && (
        <div className="autocomplete__loading">
          <span className="spinner"></span>

          <span>Looking for results, please wait.</span>
        </div>
      )}

      {isFocused && !isSearching && suggestions !== null && suggestions.length > 0 && (
        <ul
          id={`${id}__listbox`}
          role="listbox"
          {...(label) ? { "aria-label": label } : {}}
          className="suggestions"
        >
          {suggestions?.map((suggestion, index) => {
            const match = suggestion.value.name.common.match(new RegExp(searchValue, "gi"))

            return (
              <li
                className={[
                  "suggestion",
                  highlightedOption === index ? "suggestion--highlighted" : ""
                ].join(" ")}
                tabIndex={-1}
                role="option"
                aria-posinset={index + 1}
                aria-setsize={suggestions?.length}
                aria-selected={highlightedOption === index}
                key={`${JSON.stringify(suggestion)}__${index}`}
                onMouseEnter={() => setHighlightedOption(index)}
                onClick={() => handleSuggestionSelect(suggestion)}
                ref={(element) => suggestionsRef.current.push(element)}
              >
                <div className="content">
                  <span className="content__flag">{suggestion.value.flag}</span>
                  <b className="content__text">
                    {highlight(suggestion.value.name.common, match)}
                  </b>
                </div>

                <small className="suggestion__description">
                  {suggestion.value.altSpellings.join(', ')}
                </small>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Autocomplete;
