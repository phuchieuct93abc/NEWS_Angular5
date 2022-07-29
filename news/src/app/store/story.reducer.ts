import { Inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { createAction, createFeature, createReducer, on, props, Store } from '@ngrx/store';
import { map, mergeMap, switchMap } from 'rxjs';
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

export const addStoryAction = createAction('[Stories] Add Story', props<{ category: string; story: Story }>());
export const addStoriesAction = createAction('[Stories] Add Stories', props<{ story: Story[]; payload: string }>());
export const loadMoreStory = createAction('[Stories] Load more', props<{ category: string; story: Story }>());
const initialState: LoadedStories = {
  currentPageNumber: 1,
  currentPayload: null,
  category: null,
  stories: [],
  storyMap: {},
};

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
@Injectable({
  providedIn: 'root',
})
export class StoreEffect {
  loadMoreStories$ = createEffect(() =>
    this.action.pipe(
      ofType(loadMoreStory),
      concatLatestFrom(() => this.store.select(loadedStoriesFeature.selectLoadedStoriesState)),
      mergeMap(([_, state]) => this.storyService.getStoryByPage(state.category, state.currentPageNumber, state.currentPayload)),
      map(({ story, payload }) => addStoriesAction({ story, payload }))
    )
  );
  constructor(private action: Actions, private storyService: StoryService, private store: Store) {}
}
