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
export const changeImageSize = createAction('[CONFIG] Change image size');


export interface AppState{
  config:ConfigState
}
export interface ConfigState {
  darkmode: boolean;
  fontSize: number;
  smallImage: boolean
}
const initState: ConfigState = {
  darkmode: true,
  fontSize: 15,
  smallImage: true
}


const _configReducer = createReducer(
  initState,
  on(changeDarkMode, state => ({ ...state, darkmode: !state.darkmode })),
  on(changeFontSize, (state, {fontSize}) => ({ ...state, fontSize })),
  on(changeImageSize, state => ({ ...state, smallImage:!state.smallImage })),
);

export function configReducer(state: ConfigState, action: Action) {
  return _configReducer(state, action)
}

export const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer];
