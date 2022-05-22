import { createReducer } from '@ngrx/store';
export const initialState = [];

const featureReducer = createReducer(
  initialState,
  on(readArticle, (state) => ({ ...state, prop: updatedValue }))
);

export function reducer(state: State | undefined, action: Action) {
  return featureReducer(state, action);
}
