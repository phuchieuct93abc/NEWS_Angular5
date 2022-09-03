import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { IS_MOBILE } from 'src/app/shared/const';
import { configFeature, Theme, updateConfigAction } from 'src/app/store/config.reducer';
import { ConfigService } from '../../shared/config.service';
import { Config } from './../../shared/config.service';
import { DestroySubscriber } from './../../shared/destroy-subscriber';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplayComponent extends DestroySubscriber {
  public minFontSize = ConfigService.MIN_FONTSIZE;
  public maxFontSize = ConfigService.MAX_FONTSIZE;
  public config$ = this.store.select(configFeature.selectConfigState);

  public constructor(@Inject(IS_MOBILE) public isMobile: boolean, private store: Store) {
    super();
  }

  public toggleDarkMode(theme: Theme): void {
    this.store.dispatch(updateConfigAction({ theme }));
  }

  public changeFontSize({ value: fontSize }: MatSliderChange): void {
    this.store.dispatch(updateConfigAction({ fontSize }));
  }
}
