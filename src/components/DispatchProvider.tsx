import React from "react";
import {
  useCreateScenario,
  ScenarioStore,
  useBootstrapScenario,
  Scenario
} from "../utils/useAction";

interface IDispatchProviderProps<S, A> {
  initialState: () => S;
  actions: Scenario<S, A>[];
  children: (dispatch: (a: A) => void, getState: () => S) => React.ReactElement;
}

interface IStoreProvider<S, A> {
  store: ScenarioStore<S, A>;
}

export function DispatchProvider<S, A>(props: IDispatchProviderProps<S, A>) {
  const store = useCreateScenario<S, A>();
  return <StoreProvider store={store} {...props} />;
}

export function StoreProvider<S, A>(
  props: IStoreProvider<S, A> & IDispatchProviderProps<S, A>
) {
  const { store, initialState, actions } = props;
  const [dispatch, getState] = useBootstrapScenario<S, A>(
    store,
    initialState,
    actions
  );
  return props.children(dispatch, getState);
}
