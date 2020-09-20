import { environment } from './../../environments/environment';
import {
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

export interface ConfigState {
  darkmode: boolean;
  fontSize: number;
}
const initState: ConfigState = {
  darkmode: true,
  fontSize: 15
}


const _configReducer = createReducer<ConfigState>(
  initState,
  on(changeDarkMode, state => ({ ...state, darkmode: !state.darkmode })),
  on(changeFontSize, (state, {fontSize}) => ({ ...state, fontSize })),
);

export function configReducer(state, action) {
  return _configReducer(state, action)
}


export const reducers: ActionReducerMap<any> = {
  config: configReducer
};


export const metaReducers: MetaReducer<ConfigState>[] = [localStorageSyncReducer];
