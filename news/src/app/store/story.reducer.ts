import { Inject, Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';
import { mergeMap } from 'rxjs';
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
export const addStoriesAction = createAction('[Stories] Add Stories', props<{ category: string; story: Story[] }>());
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
  loadMoreStories$ = this.action.pipe(
    ofType(loadMoreStory),
    mergeMap(() => {
      return this.storyService.getStoryByPage();
    })
  );
  constructor(private action: Actions, private storyService: StoryService) {}
}
