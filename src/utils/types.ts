export type Action<T, K> = {
  type: T;
  payload: K;
};

export enum ActionTypes {
  toggleFilter,
  changeFilter,
  resetFilter
}

export type ChangeFilter = Action<
  ActionTypes.changeFilter,
  { filter: { id: number } }
>;
export type ResetFilter = Action<
  ActionTypes.resetFilter,
  { filter: { id: number } }
>;

export type AppActions = ChangeFilter | ResetFilter;
