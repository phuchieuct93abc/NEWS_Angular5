import { createAction, createFeature, on, props } from '@ngrx/store';
import { createRehydrateReducer } from './reducer';

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
  theme: Theme.PREFERENCE,
  category: 'tin-nong',
  smallImage: true,
  fontSize: 15,
  viewInSource: false,
};

export const configFeature = createFeature({
  name: 'config',
  reducer: createRehydrateReducer(
    'configuration',
    initialConfigState,
    on(updateConfigAction, (state, action) => ({ ...state, ...action }))
  ),
});
