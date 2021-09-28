import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Story } from '../../../../model/Story';
import { LocalStorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  readonly FAVORITE_ID = 'favorite-id';
  private favorites: Story[] = [];

  constructor(private storageService: LocalStorageService) {
    this.favorites = <Story[]>this.storageService.getItem(this.FAVORITE_ID, []);
  }

  findById(id: string): Story {
    return this.favorites.find((favorite) => favorite.id === id);
  }

  getStories(): Observable<any> {
    return of(this.favorites == null ? [] : this.favorites);
  }

  removeFavorite(story: Story) {
    this.favorites = this.favorites.filter((favorite) => favorite.id != story.id);
    this.updateFavorite();
  }

  private updateFavorite() {
    this.storageService.setItem(this.FAVORITE_ID, this.favorites);
  }

  addFavorite(story: Story) {
    if (this.favorites.find((favorite) => favorite.id === story.id) == undefined) {
      this.favorites.push(story);
    }

    this.updateFavorite();
  }
}
