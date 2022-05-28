import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, createFeature, createReducer, on, props, Store } from '@ngrx/store';
import { tap, switchMap, map } from 'rxjs/operators';
import { LocalStorageService } from '../shared/storage.service';

export interface Config {
  darkTheme: boolean;
  category: string;
  smallImage: boolean;
  fontSize: number;
}

export const updateConfigAction = createAction('[Config] Update Config', props<Partial<Config>>());
export const updateConfigSuccessAction = createAction('[Config] Update Config Success');
const initialState: Config = {
  darkTheme: true,
  category: 'tin-nong',
  smallImage: true,
  fontSize: 2,
};

export const configFeature = createFeature({
  name: 'config',
  reducer: createReducer(
    initialState,
    on(updateConfigAction, (state, action) => ({ ...state, ...action }))
  ),
});

// @Injectable()
// export class ConfigEffect {
//   configState = this.store.select(configFeature.selectConfigState);
//   saveConfigEffect = createEffect(() =>
//     this.$action.pipe(
//       ofType(updateConfigAction),
//       tap((action) => console.log(action)),
//       switchMap(() => this.configState),
//       tap((config: Config) => this.storageService.setItem('config', config)),
//       map(() => updateConfigSuccessAction())
//     )
//   );
//   constructor(private $action: Actions, private store: Store, private storageService: LocalStorageService) {}
// }
