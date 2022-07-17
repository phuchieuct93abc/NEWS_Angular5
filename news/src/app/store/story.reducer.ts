import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';
import { Story } from '../../../../model/Story';

export interface LoadedStories {
  [category: string]: {
    [id: string]: Story;
  };
}

export const addStoryAction = createAction('[Stories] Add Story', props<{ category: string; story: Story }>());
const initialState: LoadedStories = {};

export const loadedStoriesFeature = createFeature({
  name: 'loadedStories',
  reducer: createReducer(
    initialState,
    on(addStoryAction, (state, { category, story }) => {
      const categoryState = { ...state[category] } ?? {};
      const newState = { ...categoryState, ...{ [story.id + '']: story } };
      return { ...state, ...{ [category]: newState } };
    })
  ),
});
