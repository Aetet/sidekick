import { create, event, AttachSink } from "most-subject";
import { runEffects, snapshot, mergeArray } from "@most/core";
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
    source: Stream<StreamStateAction<S, A>>;
  }
) => Stream<unknown>;

export type StateObject<S> = {
  setState: SetState<S>;
  getState: GetState<S>;
};

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
  store.dispatchState(state, setState);
  store.registerAndRun(actions);

  return [store.dispatch, () => state] as const;
}

// FIXME pass outside or create new one every time?
const scheduler = newDefaultScheduler();

export class ScenarioStore<S, A> {
  private readonly _scheduler: Scheduler;
  private readonly _sink: AttachSink<StreamAction<A>>;
  private readonly _stream: Stream<StreamAction<A>>;
  private readonly _stateSink: AttachSink<StateObject<S>>;
  private readonly _stateStream: Stream<StateObject<S>>;
  private _state!: S;
  private _setState!: SetState<S>;
  private _isSubscribed = false;

  constructor(scheduler: Scheduler) {
    const [sink, stream] = create();
    const [stateSink, stateStream] = create();

    this._scheduler = scheduler;
    this._sink = sink;
    this._stream = stream;
    this._stateStream = stateStream;
    this._stateSink = stateSink;
  }

  getState = () => this._state;

  dispatch = (action: A) =>
    event(
      currentTime(this._scheduler),
      {
        action
      },
      this._sink
    );

  dispatchState(state: S, setState: SetState<S>) {
    event(
      currentTime(this._scheduler),
      {
        getState: () => state,
        setState
      },
      this._stateSink
    );
  }

  registerAndRun(actions: Scenario<S, A>[]) {
    if (!this._isSubscribed) {
      const result = snapshot(
        (a, b) => {
          return { ...a, ...b };
        },
        this._stateStream,
        this._stream
      );

      const mergeResult = mergeArray(
        actions.map(a => {
          return a({ source: result });
        })
      );

      runEffects(mergeResult, scheduler);
      this._isSubscribed = true;
    }
  }
}
