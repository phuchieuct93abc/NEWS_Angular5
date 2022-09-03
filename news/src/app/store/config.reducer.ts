import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { createAction, createFeature, createReducer, on, props, Store } from '@ngrx/store';
import { skip, switchMap } from 'rxjs';
import { LocalStorageService } from '../shared/storage.service';

export interface Config {
  theme: Theme;
  category: string;
  smallImage: boolean;
  fontSize: number;
  viewInSource: boolean;
}
export enum Theme {
  PREFERENCE,
  DARK,
  LIGHT,
}

export const updateConfigAction = createAction('[Config] Update Config', props<Partial<Config>>());
export const updateConfigSuccessAction = createAction('[Config] Update Config Success');
export const initialConfigState: Config = {
  theme: null,
  category: 'tin-nong',
  smallImage: true,
  fontSize: 15,
  viewInSource: false,
};

export const configFeature = createFeature({
  name: 'config',
  reducer: createReducer(
    initialConfigState,
    on(updateConfigAction, (state, action) => ({ ...state, ...action }))
  ),
});
@Injectable({
  providedIn: 'root',
})
export class ConfigEffect {
  store$ = createEffect(
    () =>
      this.store.select(configFeature.selectConfigState).pipe(
        skip(1),
        switchMap((config) => this.localStorageService.setItem('config', config))
      ),
    { dispatch: false }
  );

  constructor(private localStorageService: LocalStorageService, private store: Store) {}
}
