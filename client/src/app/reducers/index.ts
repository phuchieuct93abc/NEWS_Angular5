import { state } from '@angular/animations';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
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



 
const counterReducer = createReducer<ConfigState>(
  initState,
  on(changeDarkMode, (state) => {
    console.log('change')
    return {...state,darkmode:!state.darkmode}}),

);

export const reducers: ActionReducerMap<any> = {
  config:counterReducer
};


export const metaReducers: MetaReducer<ConfigState>[] = !CONFIG.production ? [] : [];
