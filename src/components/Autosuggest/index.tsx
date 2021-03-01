import * as React from 'react';
import { useState } from 'react';

import styles from './styles.module.css';

export enum AutosuggestPositionEnum {
  Up = 'Up',
  Down = 'Down',
}

// Inspired by: https://www.digitalocean.com/community/tutorials/react-react-autocomplete

const SuggestionsList = ({
  activeIndex,
  filteredSuggestions,
  onMouseDown,
}: {
  activeIndex: number;
  filteredSuggestions: string[];
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
}) => {
  if (filteredSuggestions.length)
    return (
      <div className="dropdown-menu" style={{ display: 'block' }}>
        {filteredSuggestions.map((suggestion, index) => (
          <button
            className={`dropdown-item ${
              styles.dropdownItemAutosuggest
            } ${index === activeIndex ? 'active' : ''}`}
            key={suggestion}
            onMouseDown={onMouseDown}
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  else return null;
};

const Autosuggest = ({
  type,
  placeholder,
  suggestions,
  userInput,
  setUserInput,
  position = AutosuggestPositionEnum.Down,
  disabled = false,
}: {
  type: string;
  placeholder: string;
  suggestions: string[];
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  position?: AutosuggestPositionEnum;
  disabled?: boolean;
}) => {
  const [state, setState] = useState<{
    activeIndex: number;
    filteredSuggestions: string[];
  }>({
    activeIndex: -1,
    filteredSuggestions: [],
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      activeIndex: -1,
      filteredSuggestions: suggestions.filter(
        suggestion =>
          suggestion
            .toLowerCase()
            .trim()
            .indexOf(e.currentTarget.value.toLowerCase().trim()) > -1,
      ),
    });
    setUserInput(e.currentTarget.value);
  };

  // Use onMouseDown instead of onClick b/c onMouseDown has priority over onBlur. Order of events are:
  // onMouseDown
  // onBlur
  // onClick
  const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    setState({
      activeIndex: -1,
      filteredSuggestions: [],
    });
    setUserInput(e.currentTarget.innerText);
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.trim() === '')
      setState(previous => ({
        ...previous,
        activeIndex: -1,
        filteredSuggestions: suggestions,
      }));
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setState(previous => ({
      ...previous,
      activeIndex: -1,
      filteredSuggestions: [],
    }));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.keyCode) {
      case 13: // enter
        if (state.activeIndex < 0) return;

        e.preventDefault(); // prevent form submission
        setState({
          activeIndex: -1,
          filteredSuggestions: [],
        });
        setUserInput(state.filteredSuggestions[state.activeIndex]);
        return;
      case 38: // up arrow
        if (state.activeIndex === -1) return;

        setState(previous => ({
          ...previous,
          activeIndex: previous.activeIndex - 1,
        }));
        return;
      case 40: // down arrow
        if (
          state.activeIndex ===
          state.filteredSuggestions.length - 1
        )
          return;

        setState(previous => ({
          ...previous,
          activeIndex: previous.activeIndex + 1,
        }));
        return;
    }
  };

  return (
    <div
      className={`d-flex dropdown ${
        position === AutosuggestPositionEnum.Up ? 'dropup' : ''
      }`}
    >
      <input
        type={type}
        className="form-control form-control-sm"
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        value={userInput}
        placeholder={placeholder}
        disabled={disabled}
        required
      />
      <SuggestionsList
        activeIndex={state.activeIndex}
        filteredSuggestions={state.filteredSuggestions}
        onMouseDown={onMouseDown}
      />
    </div>
  );
};

export default Autosuggest;
