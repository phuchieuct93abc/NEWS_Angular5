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
export const changeCategory = createAction('[CONFIG] Change category',props<{category:string}>());

export interface ConfigState {
  darkmode: boolean;
  fontSize: number;
  smallImage: boolean,
  category: string,

}
const initState: ConfigState = {
  darkmode: true,
  fontSize: 15,
  smallImage: true,
  category: 'tin-nong'
}


const _configReducer = createReducer(
  initState,
  on(changeDarkMode, state => ({ ...state, darkmode: !state.darkmode })),
  on(changeFontSize, (state, {fontSize}) => ({ ...state, fontSize })),
  on(changeImageSize, state => ({ ...state, smallImage:!state.smallImage })),
  on(changeCategory, (state,{category}) => ({ ...state, category})),
);

export function configReducer(state: ConfigState, action: Action) {
  return _configReducer(state, action)
}

export const metaReducers: MetaReducer[] = environment.isRunningInNode?[]:[localStorageSyncReducer];
