import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ConfigService} from "../../shared/config.service";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss'],
    encapsulation:ViewEncapsulation.None
})
export class DisplayComponent implements OnInit {

    isDarkMode: boolean;
    isSmallImage: boolean;
    fontSize: number;

    constructor(private route: ActivatedRoute,
                private configService: ConfigService,
                public breakpointService: BreakpointDetectorService) {
    }

    ngOnInit() {
        this.isDarkMode = this.configService.getConfig().darkTheme
        this.isSmallImage = this.configService.getConfig().smallImage;
        this.fontSize = this.configService.getConfig().fontSize

    }


    toggleDarkMode(value) {
        console.log(this.isDarkMode)
        this.configService.updateConfig({darkTheme: value})
    }

    changeFontSize(value: number) {
        console.log(value)
        this.configService.updateConfig({fontSize: value})
        this.fontSize = value

    }
}
