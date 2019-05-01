import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Article from "../../../../../model/Article";
import {FavoriteService} from "../../shared/favorite-story.service";
import {animate, style, transition, trigger} from "@angular/animations";
import GetSocialMediaSiteLinks_WithShareLinks from "./share/social-share-media";
import {Router} from "@angular/router";

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
export class ActionsComponent implements OnInit {

    isFavorite: boolean;
    @Input()
    article: Article;
    @Output()
    onClosed = new EventEmitter<void>();
    display = true;

    constructor(protected favoriteService: FavoriteService, private route: Router) {
    }

    ngOnInit() {
        this.isFavorite = this.favoriteService.findById(this.article.id) != undefined;

    }

    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
        if (this.article.story != null) {
            if (this.isFavorite) {
                this.favoriteService.addFavorite(this.article.story);
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
