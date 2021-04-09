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
      <div className={`dropdown-menu ${styles.dropdownMenuCustom}`}>
        {filteredSuggestions.slice(0, 3).map((suggestion, index) => (
          <div className={`btn-group ${styles.btnGroupCustom}`}>
            <button
              className={`
                dropdown-item
                ${styles.dropdownItemAutosuggest} 
                ${index === activeIndex ? 'active' : ''}
              `}
              key={suggestion}
              onMouseDown={onMouseDown}
            >
              {suggestion}
            </button>
            <i
              className={`fa fa-times pointer ${styles.closeBtn}`}
              onMouseDown={() => {
                console.log('Locally deleting: ' + suggestion);
                console.log(filteredSuggestions.indexOf(suggestion));
                filteredSuggestions.splice(
                  filteredSuggestions.indexOf(suggestion),
                  1,
                );
              }}
            ></i>
          </div>
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
    console.log(state.filteredSuggestions);
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
      case 46: // delete
        if (
          state.activeIndex < 0 ||
          state.activeIndex >= state.filteredSuggestions.length
        )
          return;
        state.filteredSuggestions.splice(state.activeIndex, 1);
        setState(previous => ({
          ...previous,
          activeIndex: previous.activeIndex - 1,
        }));
        return;

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
        // if (state.activeIndex === state.filteredSuggestions.length)
        if (state.activeIndex === 2) return;
        setState(previous => ({
          ...previous,
          activeIndex: previous.activeIndex + 1,
        }));
        return;
    }
  };

  return (
    <div
      className={`d-flex dropdown 
        ${position === AutosuggestPositionEnum.Up ? 'dropup' : ''}
      `}
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
