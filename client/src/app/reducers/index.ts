import {
  ActionReducer,
  ActionReducerMap,
  createAction,
  createReducer,
  MetaReducer,
  on
} from '@ngrx/store';
import CONFIG from 'src/environments/environment';
import { localStorageSync } from 'ngrx-store-localstorage';


export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['config'],rehydrate:true})(reducer);
}



export const changeDarkMode = createAction('[CONFIG] Change dark mode');

export interface ConfigState {
 darkmode:boolean;
}
const initState:ConfigState ={
  darkmode:true
}



 
const _configReducer = createReducer<ConfigState>(
  initState,
  on(changeDarkMode, (state) => ({...state,darkmode:!state.darkmode})),

);

export function configReducer(state, action) {
  return _configReducer(state, action)
}


export const reducers: ActionReducerMap<any> = {
  config:configReducer
};


export const metaReducers: MetaReducer<ConfigState>[] = !CONFIG.production ? [] : [];
