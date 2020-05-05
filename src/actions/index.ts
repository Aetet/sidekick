import { ActionTypes } from "../utils/types";

export interface Action {
  type: unknown;
  payload: unknown;
}

export class ToggleFilterAction implements Action {
  readonly type = ActionTypes.changeFilter;
  readonly payload: boolean;
  constructor(public value: boolean) {
    this.payload = value;
  }
}
