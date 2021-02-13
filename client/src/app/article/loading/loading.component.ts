import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../shared/config.service';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

    @Input()
    public isSmall: boolean;
    public sizeCls: string;

    public constructor(public config: ConfigService) {
    }

    public ngOnInit() {
        this.sizeCls = 'small';


    }

}
