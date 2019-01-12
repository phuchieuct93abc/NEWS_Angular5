import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {LocalStorageService} from "./storage.service";
import {Story} from "../../../../model/Story";

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    readonly FAVORITE_ID = "favorite-id";
    private favorites: Story[] = [];

    constructor(private storageService: LocalStorageService) {
        storageService.getItem(this.FAVORITE_ID, value => {
            this.favorites = value;
        })

    }

    isFavorite(story: Story) {
        return this.favorites.find(favorite => favorite.id === story.id) != null;
    }

    getStories(): Observable<any> {

        return of(this.favorites == null ? [] : this.favorites);
    }

    removeFavorite(story: Story) {
        this.favorites = this.favorites.filter(favorite => favorite.id != story.id);
        this.updateFavorite();

    }

    private updateFavorite() {
        this.storageService.setItem(this.FAVORITE_ID, this.favorites);
    }

    addFavorite(story: Story) {
        if (this.favorites.find(favorite => favorite.id === story.id) == undefined) {
            this.favorites.push(story);
        }

        this.updateFavorite();
    }

}