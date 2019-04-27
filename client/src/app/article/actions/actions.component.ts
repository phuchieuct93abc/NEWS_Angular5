import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Article from "../../../../../model/Article";
import {FavoriteService} from "../../shared/favorite-story.service";

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

    isFavorite: boolean;
    @Input()
    article: Article;
    @Output()
    onClosed = new EventEmitter<void>();

    constructor(protected favoriteService: FavoriteService) {
    }

    ngOnInit() {
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
