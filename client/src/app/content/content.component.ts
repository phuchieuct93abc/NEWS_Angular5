import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import CONFIG from '../../environments/environment';
import { BreakpointDetectorService } from '../shared/breakpoint.service';
import { ConfigService } from './../shared/config.service';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {

    public isSmallScreen: boolean;
    public isBrowser: boolean;
    public constructor(
        public breakpointService: BreakpointDetectorService,
        private route: ActivatedRoute,
        private configService: ConfigService) {
    }

    public ngOnInit() {

        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.isBrowser = !CONFIG.isRunningInNode;

        this.route.params.subscribe((param)=>{
            this.configService.updateConfig({category:param.category});
        });
    }

}
