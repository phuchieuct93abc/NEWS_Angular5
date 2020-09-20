import { environment } from './../../environments/environment';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  createAction,
  createReducer,
  MetaReducer,
  on,
  props
} from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';


export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['config'], rehydrate: true })(reducer);
}
export const changeDarkMode = createAction('[CONFIG] Change dark mode');
export const changeFontSize = createAction('[CONFIG] Change font size',  props<{ fontSize: number}>());


export interface AppState{
  config:ConfigState
}
export interface ConfigState {
  darkmode: boolean;
  fontSize: number;
}
const initState: ConfigState = {
  darkmode: true,
  fontSize: 15
}


const _configReducer = createReducer(
  initState,
  on(changeDarkMode, state => ({ ...state, darkmode: !state.darkmode })),
  on(changeFontSize, (state, {fontSize}) => ({ ...state, fontSize })),
);

export function configReducer(state: ConfigState, action: Action) {
  return _configReducer(state, action)
}

export const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer];
