import { Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef, Inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Observable, Subject } from 'rxjs';
import { pairwise, takeUntil, throttle } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import { StoryService } from '../../shared/story.service';
import { Story } from '../../../../../model/Story';
import { Config, ConfigService } from '../../shared/config.service';
import { LoadingEventName, LoadingEventType, LoadingService } from '../../shared/loading.service';
import { ArticleService } from '../../shared/article.service';
import StoryImage from '../../../../../model/StoryImage';
import StoryMeta from '../../../../../model/StoryMeta';
import { StoryComponent } from '../story/story.component';
import { IS_NODE } from './../../shared/const';
import { StoryListService } from './story-list.service';
import { DestroySubscriber } from './../../shared/destroy-subscriber';

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent {

    constructor(      @Inject(IS_NODE) public isNode: boolean,private storyListService: StoryListService
    ){}

    @Input()
    stories: Story[];
    @Input()
    openningStory: Story;

    loadingStories: Story[];

    loadMoreStories(): void {
    }

    onSelectedStory(story: Story): void {

    }
    public trackByFn(item: Story): string {
        return item.id;
    }

    private registerPrevAndNext() {
        this.storyListService.onSelectPrevStory.subscribe(() => {
            const prevIndex = this.stories.indexOf(this.storyListService.currentSelectedStory) - 1;
            if (prevIndex > -1) {
                const prevStoryId = this.stories[prevIndex].id;
                this.selectStory(prevStoryId);
            }
  
        });
  
        this.storyListService.onSelectNextStory.subscribe(() => {
            const nextIndex = this.stories.indexOf(this.storyListService.currentSelectedStory) + 1;
            const nextStoryId = this.stories[nextIndex].id;
            this.selectStory(nextStoryId);
        });
    }
  
    public selectStory(storyId: string) {
        // this.storyComponents?.forEach((story) => {
        //     if (story.story.id === prevStoryId) {
        //         story.onSelectStory();
        //         this.scrollTo(story.story);
        //     }
        // });
    }

   

}
