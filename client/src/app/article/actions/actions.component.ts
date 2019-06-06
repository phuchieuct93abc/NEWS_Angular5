import {Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import Article from "../../../../../model/Article";
import {FavoriteService} from "../../shared/favorite-story.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss'],
    animations: [

        trigger('animate', [

            transition("*=>*", [
                style({transform: 'translateX(100%)', opacity: 0}),
                animate("500ms", style({transform: 'translateX(0)', opacity: 1}))

            ]),
        ])

    ]
})
export class ActionsComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
        this.observerWindow && this.observerWindow.disconnect();
        this.observerWrapper && this.observerWrapper.disconnect();
    }

    isFavorite: boolean;
    @Input()
    article: Article;
    @Output()
    onClosed = new EventEmitter<void>();
    @ViewChild("actionsElement")
    actionsElement: ElementRef;
    @ViewChild("stickyElement")
    stickyElement: ElementRef;


    display = true;
    observerWindow: IntersectionObserver;
    observerWrapper: IntersectionObserver;
    isFixedTop = false;
    @Input()
    wrapperElement: HTMLElement;

    constructor(protected favoriteService: FavoriteService, private route: Router, private snackBar: MatSnackBar,
                private ngZone: NgZone, private breakpointDetector: BreakpointDetectorService) {
    }

    ngOnInit() {
        this.isFavorite = this.favoriteService.findById(this.article.id) != undefined;

        if (this.breakpointDetector.isSmallScreen) {
            this.observerWindow = new IntersectionObserver((data: IntersectionObserverEntry[]) => {

                this.ngZone.run(() => {
                    this.isFixedTop = !data[0].isIntersecting;

                })
            }, {
                rootMargin: '-60px 0px 0px 0px',
                threshold: [0]
            });
            this.observerWrapper = new IntersectionObserver((data: IntersectionObserverEntry[]) => {

                this.ngZone.run(() => {
                    this.isFixedTop = data[0].isIntersecting;

                })
            }, {
                rootMargin: '-100px 0px 0px 0px',
                threshold: [0]
            });
            setTimeout(() => {

                this.observerWindow.observe(this.actionsElement.nativeElement);
                this.observerWrapper.observe(this.wrapperElement)

            }, 2000)
        }


    }

    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
        if (this.article.story != null) {
            if (this.isFavorite) {
                this.favoriteService.addFavorite(this.article.story);
                this.snackBar.open("Add to favorite category successful", null, {
                    duration: 2000,
                });
            } else {
                this.favoriteService.removeFavorite(this.article.story)
            }
            this.article.story.isFavorite = this.isFavorite
        }

    }

    close(event: MouseEvent) {
        event && event.stopPropagation();
        this.onClosed.emit();
    }


}
