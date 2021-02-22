import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../shared/config.service';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit{

    public isDarkTheme = true;
    public constructor(public config: ConfigService) {

    }
    ngOnInit(): void {
        this.isDarkTheme = this.config.getConfig().value.darkTheme;
    }
}
