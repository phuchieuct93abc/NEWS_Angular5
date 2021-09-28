import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { IS_MOBILE } from 'src/app/shared/const';
import { ConfigService } from '../../shared/config.service';
import { Config } from './../../shared/config.service';
import { DestroySubscriber } from './../../shared/destroy-subscriber';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplayComponent extends DestroySubscriber implements OnInit {
  public minFontSize = ConfigService.MIN_FONTSIZE;
  public maxFontSize = ConfigService.MAX_FONTSIZE;
  public config: Config;

  public constructor(private configService: ConfigService, @Inject(IS_MOBILE) public isMobile: boolean) {
    super();
  }

  public ngOnInit() {
    this.configService
      .getConfig()
      .pipe(this.getTakeUntilDestroy())
      .subscribe((config) => (this.config = config));
  }

  public toggleDarkMode(value) {
    this.configService.updateConfig({ darkTheme: value });
  }

  public changeFontSize({ value }: MatSliderChange) {
    this.config.fontSize = value;
    this.configService.updateConfig({ fontSize: value });
  }
}
