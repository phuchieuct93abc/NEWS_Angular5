import { filter, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as url from 'speakingurl';
import { IS_MOBILE, IS_NODE } from 'src/app/shared/const';
import { Category } from '../../../../../model/Categories';
import { Story } from '../../../../../model/Story';
import { Config, ConfigService } from '../../shared/config.service';
import { FavoriteService } from '../../shared/favorite-story.service';
import { StoryListService } from '../story-list/story-list.service';
import { ArticleService } from 'src/app/shared/article.service';

@Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryComponent implements OnInit, OnDestroy {

    @Output()
    public onSelectedStory = new EventEmitter<Story>();
    @Input()
    public story: Story;
    @Input()
    public scrollContainer: ElementRef;
    @Input()
    public index: number;
    @Input()
    public category: Category;

    @Input()
    public selected = false;

    public isRead = false;


    public config$: BehaviorSubject<Config>;
    public configListener: Subscription;
    public friendlyUrl: string;
    private onDestroy$ = new Subject<void>();
    public isActive$: Observable<boolean>;


    public constructor(
        @Inject(IS_NODE) public isNode: boolean,
        @Inject(IS_MOBILE) public isMobile: boolean,
        protected configService: ConfigService,
        protected favoriteService: FavoriteService,
        protected route: Router,
        protected activatedRoute: ActivatedRoute,
        protected storyListService: StoryListService,
        protected element: ElementRef<HTMLElement>,
        private crd: ChangeDetectorRef,
        private articleService: ArticleService) {
    }


    public ngOnInit(): void {
        this.isRead = this.story.isRead;
        this.config$ = this.configService.getConfig();

        this.isActive$ = this.route.events.pipe(
            takeUntil(this.onDestroy$),
            filter(event => event instanceof NavigationEnd),
            map(() => this.activatedRoute.firstChild.snapshot.params),
            startWith(this.activatedRoute.firstChild.snapshot.params),
            map(({ id }) => id === this.story.id),
            tap((active) => {
                if (active) {
                    this.afterSelectStory();
                    this.onSelectedStory.emit(this.story);
                }
            })
        )


        this.story.isFavorite = this.favoriteService.findById(this.story.id) != null;
        if (this.story.isOpenning) {
            this.selectStory();
        }
    }
    protected afterSelectStory():void {
        this.isRead = true;

    }

    public onSelectStory(): void {
        this.route.navigate([url(this.story.title), this.story.id], { relativeTo: this.activatedRoute });
    }

    protected selectStory(): void {
        this.story.isRead = true;
        this.selected = true;

    }
    public getElement(): HTMLElement {
        return this.element.nativeElement;
    }


    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
