import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IS_MOBILE } from 'src/app/shared/const';
import { DeferService } from 'src/app/shared/defer.service';
import CONFIG from 'src/environments/environment';
import Article from '../../../../../model/Article';
import { FavoriteService } from '../../shared/favorite-story.service';
import { IS_NODE } from './../../shared/const';

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss'],
    animations: [

        trigger('animate', [

            transition('*=>*', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))

            ])
        ])

    ]
})
export class ActionsComponent implements OnInit, OnDestroy, OnChanges {


    @Input()
    article: Article;
    @Output()
    onClosed = new EventEmitter<void>();
    @ViewChild('actionsElement')
    actionsElement: ElementRef;
    @ViewChild('stickyElement')
    stickyElement: ElementRef;
    @Input()
    wrapperElement: HTMLElement;
    isFavorite: boolean;
    display = true;
    observerWindow: IntersectionObserver;
    observerWrapper: IntersectionObserver;
    isFixedTop = false;
    ttsAudioSource: { title: string, link: string, artist: string, duration: number }[] = [];
    private isDisplayingAction = false;
    private isDisplayingArticle = true;

    constructor(protected favoriteService: FavoriteService, private snackBar: MatSnackBar,
        private ngZone: NgZone, @Inject(IS_MOBILE) private isMobile: boolean, @Inject(IS_NODE) private isNode: boolean,
        private crd: ChangeDetectorRef, private deferService: DeferService
    ) {
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.article.currentValue != null) {
            const { id, category } = changes.article.currentValue as Article;
            this.ttsAudioSource = [{
                title: 'Audio One Title',
                link: `${CONFIG.baseUrl}tts?id=${id}&category=${category}`,
                artist: 'Artist',
                duration: 10
            }];
        }
    }



    ngOnInit(): void {
        this.isFavorite = this.favoriteService.findById(this.article.id) != undefined;

        if (this.isMobile && !this.isNode) {
            this.observerWindow = new IntersectionObserver((data: IntersectionObserverEntry[]) => {

                if (data[0].target === this.actionsElement.nativeElement) {

                    this.ngZone.run(() => {
                        this.isDisplayingAction = data[0].isIntersecting;
                        this.checkPosition();
                    });

                }
            }, {
                rootMargin: '-80px 0px 0px 0px',
                threshold: [0]
            });
            this.observerWrapper = new IntersectionObserver((data: IntersectionObserverEntry[]) => {
                if (data[0].target === this.wrapperElement) {

                    this.ngZone.run(() => {
                        this.isDisplayingArticle = data[0].isIntersecting;
                        this.checkPosition();
                    });
                }
            }, {
                rootMargin: '0px 0px 0px 0px',
                threshold: [0]
            });
            this.deferService.defer(() => {
                this.observerWindow.observe(this.actionsElement.nativeElement);
                this.observerWrapper.observe(this.wrapperElement);
            }, 2000);


        }


    }

    checkPosition(): void {
        this.isFixedTop = !this.isDisplayingAction && this.isDisplayingArticle;
        this.crd.markForCheck();
    }

    toggleFavorite(): void {
        this.isFavorite = !this.isFavorite;
        if (this.article.story != null) {
            if (this.isFavorite) {
                this.favoriteService.addFavorite(this.article.story);
                this.snackBar.open('Add to favorite category successful', null, {
                    duration: 2000
                });
            } else {
                this.favoriteService.removeFavorite(this.article.story);
            }
            this.article.story.isFavorite = this.isFavorite;
        }

    }

    close(event: MouseEvent): void {
        event && event.stopPropagation();
        this.onClosed.emit();
    }

    ngOnDestroy(): void {
        this.observerWindow && this.observerWindow.disconnect();
        this.observerWrapper && this.observerWrapper.disconnect();
    }


}
