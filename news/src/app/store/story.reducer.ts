import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { createAction, createFeature, createReducer, on, props, Store } from '@ngrx/store';
import { filter, map, mergeMap, switchMap, tap } from 'rxjs';
import { Story } from '../../../../model/Story';
import { StoryService } from '../shared/story.service';

export interface LoadedStories {
  currentPageNumber: number;
  currentPayload: string;
  category: string;
  stories: Story[];
  storyMap: {
    [category: string]: {
      [id: string]: Story;
    };
  };
}

export const addStoriesAction = createAction('[Stories] Add Stories', props<{ story: Story[]; payload: string }>());
export const loadMoreStory = createAction('[Stories] Load more');
export const onChangeCategory = createAction('[Stories] On change category', props<{ category: string }>());
const initialState: LoadedStories = {
  currentPageNumber: 1,
  currentPayload: null,
  category: null,
  stories: [],
  storyMap: {},
};

export const storyFeature = createFeature({
  name: 'StoryFeature',
  reducer: createReducer(
    initialState,
    on(addStoriesAction, (state, { story: newStories, payload }) => {
      const unDuplicatedNewStories = [...newStories].filter((s) => state.storyMap[state.category]?.[s.id] == null);
      const stories = [...state.stories, ...unDuplicatedNewStories];
      const storiesMap = unDuplicatedNewStories.reduce((prev, current) => {
        prev[current.id] = current;
        return prev;
      }, {});
      const storiesMapState = { [state.category]: { ...state.storyMap[state.category], ...storiesMap } };
      return {
        ...state,
        currentPageNumber: state.currentPageNumber + 1,
        currentPayload: payload,
        stories,
        storyMap: { ...storiesMapState },
      };
    }),
    on(onChangeCategory, (_state, { category }) => ({ ...initialState, category }))
  ),
});

@Injectable({
  providedIn: 'root',
})
export class StoryEffect {
  loadMoreStories$ = createEffect(() =>
    this.action.pipe(
      ofType(loadMoreStory),
      concatLatestFrom(() => this.store.select(storyFeature.selectStoryFeatureState)),
      filter(([, { category }]) => !!category),
      switchMap(([, state]) => this.storyService.getStoryByPage(state.category, state.currentPageNumber, state.currentPayload)),
      map(({ story, payload }) => addStoriesAction({ story, payload }))
    )
  );

  constructor(private action: Actions, private storyService: StoryService, private store: Store) {}
}
