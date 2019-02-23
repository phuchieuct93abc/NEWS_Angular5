import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ConfigService} from "../../shared/config.service";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {MatButtonToggle} from "@angular/material";

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss']
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


    toggleDarkMode() {
        this.configService.updateConfig({darkTheme: this.isDarkMode})
    }

    changeFontSize($event: MatButtonToggle) {
        this.configService.updateConfig({fontSize: $event.value})
        this.fontSize = $event.value

    }
}
