import {Component, Input, OnInit} from '@angular/core';
import {ConfigService} from "../../shared/config.service";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

    @Input()
    isSmall: boolean;
    sizeCls: string;

    constructor(public config: ConfigService, public breakpointService: BreakpointDetectorService) {
    }

    ngOnInit() {
        if (this.isSmall != undefined) {
            this.sizeCls = this.isSmall ? 'small' : 'big';
        } else {
            this.sizeCls = this.breakpointService.isSmallScreen ? 'small' : 'big';
        }
    }

}
