import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { configFeature, updateConfigAction } from '../store/config.reducer';

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


  public constructor(private store: Store) {}
}
