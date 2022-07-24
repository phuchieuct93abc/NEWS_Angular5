import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';

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
