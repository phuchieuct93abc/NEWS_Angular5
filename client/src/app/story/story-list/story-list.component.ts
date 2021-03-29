import { Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef, Inject, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import * as url from 'speakingurl';
import { Story } from '../../../../../model/Story';
import { StoryComponent } from '../story/story.component';
import { IS_NODE } from './../../shared/const';
import { StoryListService } from './story-list.service';

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
    @Input()
    public category: string;

    private selectedStory: Story;
    constructor(
        @Inject(IS_NODE) public isNode: boolean,
        private storyListService: StoryListService,
        protected activatedRoute: ActivatedRoute,
        protected route: Router
    ) { }

    ngOnInit(): void {
        this.scrollTop();
        this.registerPrevAndNext();
    }
    ngOnChanges(changes: SimpleChanges): void {
        const currentValue = changes.stories?.currentValue as Story[];
        const previousValue = changes.stories?.previousValue as Story[];
        if (currentValue?.length === 0) {
            this.scrollTop();
        }


        if (changes.openningStory?.currentValue != null) {
            this.selectStory(changes.openningStory?.currentValue);
        }

        if (previousValue?.length === 0 && currentValue?.length > 0 && this.openningStory == null) {
            this.selectStory(this.stories[0]);

        }


    }
    private registerPrevAndNext() {
        merge(
            this.storyListService.onPrev().pipe(mapTo(-1)),
            this.storyListService.onNext().pipe(mapTo(1))
        ).subscribe(adj => {
            if(this.stories.length ===0){
                return;
            }
            const index = Math.max(0, this.stories.indexOf(this.selectedStory) + adj);
            this.selectStory(this.stories[index]);
            this.scrollTo(this.stories[index]);
        });

    }

    public onSelectedStory(story: Story): void {
        this.selectedStory = story;
    }


    public trackByFn(item): any {
        return item.id;
    }

    public selectStory(story: Story): void {
        this.route.navigate([url(story.title), story.id], { relativeTo: this.activatedRoute });
    }

    protected scrollTo(story: Story): void {
        setTimeout(() => {
            const index = this.stories.findIndex((i) => i.id === story.id);
            const el = this.storyComponents.toArray()[Math.max(0, index)].getElement();
            this.scrollingBlock.nativeElement.scrollTo?.({ top: el.offsetTop + 100, behavior: 'smooth' });
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
