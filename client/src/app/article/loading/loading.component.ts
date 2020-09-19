import { ConfigState } from './../../reducers/index';
import {Component, Input, OnInit} from '@angular/core';
import {ConfigService} from "../../shared/config.service";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

    @Input()
    isSmall: boolean;
    sizeCls: string;

    store$:Observable<ConfigState>

    constructor(public config: ConfigService, public breakpointService: BreakpointDetectorService,private store:Store<ConfigState>) {
    }

    ngOnInit() {
        this.store$ = this.store.pipe(select('config'));
        if (this.isSmall != undefined) {
            this.sizeCls = this.isSmall ? 'small' : 'big';
        } else {
            this.sizeCls = this.breakpointService.isSmallScreen ? 'small' : 'big';
        }
    }

}
