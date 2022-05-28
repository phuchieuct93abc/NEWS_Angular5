import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { configFeature, updateConfigAction, updateConfigSuccessAction } from '../store/config.reducer';
import { LocalStorageService } from './storage.service';

export interface Config {
  darkTheme?: boolean;
  category?: string;
  smallImage?: boolean;
  fontSize?: number;
}

const id = 'config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public static MIN_FONTSIZE = 15;
  public static MAX_FONTSIZE = 25;

  configState = this.store.select(configFeature.selectConfigState);

  public constructor(private storageService: LocalStorageService, private store: Store) {
    this.store.dispatch(updateConfigAction(this.storageService.getItemSync(id, {})));
    this.configState.subscribe((config) => {
      this.storageService.setItemSync(id, config);
    });
  }
}
