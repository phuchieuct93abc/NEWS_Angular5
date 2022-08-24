import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';
import { map } from 'rxjs';
import { IS_MOBILE } from '../shared/const';
import { LocalStorageService } from '../shared/storage.service';

export interface Config {
  darkTheme: boolean;
  category: string;
  smallImage: boolean;
  fontSize: number;
  viewInSource: boolean;
}

export const updateConfigAction = createAction('[Config] Update Config', props<Partial<Config>>());
export const updateConfigSuccessAction = createAction('[Config] Update Config Success');
export const initialConfigState: Config = {
  darkTheme: true,
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
  $ = createEffect(
    () =>
      this.$action.pipe(
        ofType(updateConfigAction),
        map((config) => {
          if (!this.isSmallScreen) {
            return { ...config, darkTheme: true };
          }
          return config;
        }),
        map((config) => updateConfigAction(config))
      ),
    { dispatch: false }
  );
  constructor(@Inject(IS_MOBILE) private isSmallScreen: boolean, private $action: Actions) {}
}
