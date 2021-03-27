import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as url from 'speakingurl';
import { IS_MOBILE } from 'src/app/shared/const';
import { Category } from '../../../../../model/Categories';
import { Story } from '../../../../../model/Story';
import { Config, ConfigService } from '../../shared/config.service';
import { FavoriteService } from '../../shared/favorite-story.service';
import { StoryListService } from '../story-list/story-list.service';

@Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryComponent implements OnInit, OnDestroy {

    @Output()
    public onSelectedStory = new EventEmitter<number>();
    @Input()
    public story: Story;
    @Input()
    public scrollContainer: ElementRef;
    @Input()
    public index: number;
    @Input()
    public category: Category;

    public selected = false;

    public config: Config;
    public configListener: Subscription;
    public friendlyUrl: string;
    private onDestroy$ = new Subject<void>();


    public constructor(
        @Inject(IS_MOBILE) public isMobile: boolean,
        protected configService: ConfigService,
        protected favoriteService: FavoriteService,
        protected route: Router,
        protected activatedRoute: ActivatedRoute,
        protected storyListService: StoryListService,
        protected element: ElementRef<HTMLElement>) {
    }

    public onSelectStory() {
        this.storyListService.currentSelectedStory = this.story;
        let navigate: Promise<any>;
        if (this.category) {
            navigate = this.route.navigate(['/', this.category.name, this.friendlyUrl, this.story.id]);
        } else {
            navigate = this.route.navigate([this.friendlyUrl, this.story.id], { relativeTo: this.activatedRoute });
        }

        navigate.then(() => {
            this.story.selected = true;
            this.story.isRead = true;
            this.onSelectedStory.emit(this.index);
        });
    }

    public ngOnInit(): void {
        this.getConfig();
        this.friendlyUrl = url(this.story.title) as string;
        this.story.isFavorite = this.favoriteService.findById(this.story.id) != null;
        this.handleAutoOpenStory();
        if(this.story.isOpenning){
            this.onSelectStory();
        }
    }


    public getElement(): HTMLElement {
        return this.element.nativeElement;
    }

    private handleAutoOpenStory() {
        if (this.story.isAutoOpen) {
            this.onSelectStory();
            this.route.navigate([this.friendlyUrl, this.story.id], { relativeTo: this.activatedRoute });
            this.story.isAutoOpen = false;
        }
    }

    private getConfig() {
        this.configService.getConfig().pipe(takeUntil(this.onDestroy$)).subscribe((config) => this.config = config);
    }
    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
