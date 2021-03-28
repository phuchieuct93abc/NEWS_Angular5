import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as url from 'speakingurl';
import { IS_MOBILE, IS_NODE } from 'src/app/shared/const';
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
    public onSelectedStory = new EventEmitter<Story>();
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
    public isActive = false;


    public constructor(
        @Inject(IS_NODE) public isNode: boolean,
        @Inject(IS_MOBILE) public isMobile: boolean,
        protected configService: ConfigService,
        protected favoriteService: FavoriteService,
        protected route: Router,
        protected activatedRoute: ActivatedRoute,
        protected storyListService: StoryListService,
        protected element: ElementRef<HTMLElement>,
        private crd: ChangeDetectorRef) {
    }

    protected onSelectStory() {
        this.isActive = true;
        this.onSelectedStory.emit(this.story);
        this.crd.detectChanges()

    }

    public ngOnInit(): void {

        this.activatedRoute.children[0].params.pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
            if (data.id !== this.story.id) {
                this.isActive = false;
                this.crd.detectChanges()

                return;
            }
            this.onSelectStory();

        });

        this.getConfig();
        this.story.isFavorite = this.favoriteService.findById(this.story.id) != null;
        // this.handleAutoOpenStory();
        if (this.story.isOpenning) {
            this.onSelectStory();
        }
    }


    public getElement(): HTMLElement {
        return this.element.nativeElement;
    }

    // private handleAutoOpenStory() {
    //         this.onSelectStory();
    //         this.route.navigate([this.friendlyUrl, this.story.id], { relativeTo: this.activatedRoute });
    // }

    private getConfig() {
        this.configService.getConfig().pipe(takeUntil(this.onDestroy$)).subscribe((config) => this.config = config);
    }
    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
