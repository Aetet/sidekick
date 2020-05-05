# Sidekick

New concept for redux like store.

## Difference from redux and sagas

- No reducers
- No return action at async flow
- No separation for sync & async actions
- Transaction state change supported by immer
- Update state in the middle of async action

## Why

State update often break async action flow, because you need return action - update state reducer - return to async action. To make this operation in one transaction there's new conception - scenario.

It's async action supported by [most](https://github.com/mostjs/core).

In general case it's a function that accept 2 things:

- Async stream - `source`
- Object `state` with current state and function to update state - `{getState, setState}`

Scenario must return stream to run it with `runEffects`

Source used as basic async primitive. Thanks to most - every situation will be handled in composable way.

State - always contains up to date state and setState function.
It works because of reference passing, that's why **DON'T DESCTRUCTURE STATE**

```ts
export type Scenario<S, A> = (
  props: {
    state: {
      getState: GetState<S>;
      setState: SetState<S>;
    };
    source: Stream<StreamStateAction<S, A>>;
  }
) => Stream<unknown>;
```

Here's a scenario example that toggles state and react to ToggleAction:

```ts
const toggler: Scenario<State, ToggleAction> = ({ source, state }) => {
  return tap(({ action }) => {
    const newValue = action.value;
    state.setState({ value: newValue });
  }, source);
};
```

Other part - `DispatchProvider`. This react component provides `dispatch` and `getState` function. Under hood it optimize useState to prevent double subscription and memory leak.

```tsx
<DispatchProvider actions={[toggler]} initialState={() => ({ value: false })}>
  {(dispatch, getState) => {}}
</DispatchProvider>
```

# Install & run

```
yarn start
```
