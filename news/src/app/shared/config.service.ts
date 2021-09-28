import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  private config$: BehaviorSubject<Config>;
  private config: Config = {
    category: 'tin-nong',
    darkTheme: true,
    smallImage: true,
    fontSize: 2,
  };

  public constructor(private storage: LocalStorageService) {
    this.config = { ...this.config, ...storage.getItem(id, {}) };
    this.migrateConfig();
    this.config$ = new BehaviorSubject(this.config);
  }

  public updateConfig(config: Config) {
    this.config = { ...this.config, ...config };
    this.storage.setItem(id, this.config);
    this.config$.next(this.config);
  }

  public getConfig(): BehaviorSubject<Config> {
    return this.config$;
  }

  private migrateConfig() {
    this.config.fontSize = Math.min(Math.max(ConfigService.MIN_FONTSIZE, this.config.fontSize), ConfigService.MAX_FONTSIZE);
  }
}
