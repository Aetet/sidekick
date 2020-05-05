import React from "react";
import "./App.css";
import { tap } from "@most/core";
import { DispatchProvider } from "./components/DispatchProvider";
import { Scenario } from "./utils/useAction";

interface State {
  value: boolean;
}

interface ToggleAction {
  value: boolean;
}

const toggler: Scenario<State, ToggleAction> = ({ source }) => {
  return tap(({ action, setState }) => {
    const newValue = action.value;
    setState({ value: newValue });
  }, source);
};

function App() {
  return (
    <DispatchProvider
      actions={[toggler]}
      initialState={() => ({ value: false })}
    >
      {(dispatch, getState) => {
        const handleToggle = (value: boolean) => {
          console.log("value: before", value);
          dispatch({ value: !value });
        };

        return (
          <div onClick={e => handleToggle(getState().value)}>
            Hello {getState().value.toString()}
          </div>
        );
      }}
    </DispatchProvider>
  );
}

export default App;
