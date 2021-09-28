import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IS_MOBILE } from 'src/app/shared/const';
import { IS_NODE } from './../shared/const';
import { ConfigService } from './../shared/config.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  public isBrowser: boolean;
  public constructor(
    @Inject(IS_MOBILE) public isSmallScreen: boolean,
    @Inject(IS_NODE) public isNode: boolean,
    private route: ActivatedRoute,
    private configService: ConfigService
  ) {}

  public ngOnInit() {
    this.isBrowser = !this.isNode;

    this.route.params.subscribe((param) => {
      this.configService.updateConfig({ category: param.category });
    });
  }
}
