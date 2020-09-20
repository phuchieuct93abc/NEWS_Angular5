import { ConfigState, changeDarkMode, changeFontSize } from './../../reducers/index';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../shared/config.service";
import { BreakpointDetectorService } from "../../shared/breakpoint.service";
import { select, Store } from '@ngrx/store';

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DisplayComponent implements OnInit {

    isDarkMode: boolean;
    isSmallImage: boolean;
    fontSize: number;
    minFontSize = ConfigService.MIN_FONTSIZE;
    maxFontSize = ConfigService.MAX_FONTSIZE;


    constructor(private route: ActivatedRoute,
        private configService: ConfigService,
        public breakpointService: BreakpointDetectorService,
        private store:Store<ConfigState> ) {
    }

    ngOnInit() {
        this.store.pipe<ConfigState>(select('config')).subscribe(config=>{
            this.isDarkMode = config.darkmode;
            this.fontSize = config.fontSize;
            this.isSmallImage = config.smallImage

        })

    }


    toggleDarkMode() {
        this.store.dispatch(changeDarkMode())
    }

    changeFontSize(value: number) {
        this.store.dispatch(changeFontSize({fontSize:value}))

    }
    onCickSizeSlider(event:Event) {
        event.stopPropagation()
    }
}
