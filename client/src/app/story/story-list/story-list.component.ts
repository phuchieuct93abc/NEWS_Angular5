import { Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef, Inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Observable, Subject } from 'rxjs';
import { pairwise, takeUntil, throttle } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import * as url from 'speakingurl';
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
export class StoryListComponent implements OnInit, OnChanges {
    @ViewChild('scrollingBlock')
    public scrollingBlock: ElementRef<HTMLElement>;


    @ViewChildren(StoryComponent)
    public storyComponents: QueryList<StoryComponent>;

    @Output()
    loadMoreStories = new EventEmitter();
    private _stories: Story[];
    public get stories(): Story[] {
        return this._stories;
    }
    @Input()
    public set stories(value: Story[]) {
        this._stories = value;
    }
    @Input()
    openningStory: Story;

    loadingStories = Array(10).fill('');
    constructor(
        @Inject(IS_NODE) public isNode: boolean,
        private storyListService: StoryListService,
        protected activatedRoute: ActivatedRoute,
        protected route: Router
    ) { }
    
    ngOnInit(): void {
        this.scrollTop();
    }
    ngOnChanges(changes: SimpleChanges): void {
        const currentValue = changes.stories?.currentValue as Story[];
        const previousValue = changes.stories?.previousValue as Story[];
        if (currentValue?.length === 0) {
            this.scrollTop();
        }
 

        if(changes.openningStory?.currentValue != null){
            this.selectStory(changes.openningStory?.currentValue)
        }

        if (previousValue?.length === 0 && currentValue?.length > 0 && this.openningStory == null) {
            this.selectStory(this.stories[0]);

        }
        

    }


    public trackByFn(item: Story): string {
        return item.id;
    }

    public selectStory(story: Story): void {
        this.route.navigate([url(story.title), story.id], { relativeTo: this.activatedRoute })
    }

    protected scrollTo(story: Story): void {
        setTimeout(() => {
            const index = this.stories.findIndex((i) => i.id === story.id);
            const el = this.storyComponents.toArray()[Math.max(0, index)].getElement();
            this.scrollingBlock.nativeElement.scrollTo?.({ top: el.offsetTop, behavior: 'smooth' });
        });
    }

    protected scrollTop(): void {
        if (this.isNode) {
            return;
        }
        setTimeout(() => {
            this.scrollingBlock?.nativeElement?.scrollTo?.({ top: 0, behavior: 'smooth' });
        });

    }


}
