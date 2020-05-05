import { create, event, AttachSink } from "most-subject";
import { runEffects, mergeArray } from "@most/core";
import { newDefaultScheduler, currentTime } from "@most/scheduler";
import { Scheduler, Stream } from "@most/types";
import { useState } from "react";

export interface StreamAction<A> {
  action: A;
}

type StreamStateAction<S, A> = StreamAction<A> & StateObject<S>;
export type SetState<S> = (s: S) => unknown;
export type GetState<S> = () => S;
export type Scenario<S, A> = (
  props: {
    state: {
      getState: GetState<S>;
      setState: SetState<S>;
    };
    source: Stream<StreamStateAction<S, A>>;
  }
) => Stream<unknown>;

export interface StateObject<S> {
  setState: SetState<S>;
  getState: GetState<S>;
}

export function useCreateScenario<S, A>() {
  const store = new ScenarioStore<S, A>(scheduler);

  return store;
}

export function useBootstrapScenario<S, A>(
  store: ScenarioStore<S, A>,
  initialState: () => S,
  actions: Scenario<S, A>[]
) {
  const [state, setState] = useState<S>(initialState);
  store.registerState(state, setState);
  store.registerAndRun(actions);

  return [store.dispatch, () => state] as const;
}

// FIXME pass outside or create new one every time?
const scheduler = newDefaultScheduler();

export class ScenarioStore<S, A> {
  registerState(state: S, setState: SetState<S>) {
    this._stateObject.getState = () => state;
    this._stateObject.setState = setState;
  }
  private readonly _scheduler: Scheduler;
  private readonly _sink: AttachSink<StreamAction<A>>;
  private readonly _stream: Stream<StreamAction<A>>;
  private _isSubscribed = false;
  private _stateObject: StateObject<S>;

  constructor(scheduler: Scheduler) {
    const [sink, stream] = create();

    this._scheduler = scheduler;
    this._sink = sink;
    this._stream = stream;
    // @ts-ignore
    this._stateObject = {};
  }

  dispatch = (action: A) =>
    event(
      currentTime(this._scheduler),
      {
        action
      },
      this._sink
    );

  registerAndRun(actions: Scenario<S, A>[]) {
    if (!this._isSubscribed) {
      const mergeResult = mergeArray(
        actions.map(a => {
          return a({ state: this._stateObject, source: this._stream });
        })
      );

      runEffects(mergeResult, scheduler);
      this._isSubscribed = true;
    }
  }
}
