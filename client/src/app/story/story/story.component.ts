import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Story} from "../../../../../model/Story";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {Config, ConfigService} from "../../shared/config.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit, OnDestroy {

    @Input()
    story: Story;
    @Input()
    scrollContainer: ElementRef;
    @Output()
    onSelectedStory = new EventEmitter<Story>();
    scrollTarget: any;

    selected: boolean = false;
    isSmallScreen: boolean;

    config: Config;
    configListener: Subscription;


    constructor(private breakpointService: BreakpointDetectorService,
                private configService: ConfigService,
    ) {
    }

    onSelectStory() {

        this.selected = true;
        this.onSelectedStory.emit(this.story);
    }

    ngOnInit(): void {
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.scrollTarget = this.scrollContainer;
        this.getConfig();

    }

    private getConfig() {
        this.config = this.configService.getConfig();
        this.configListener = this.configService.configUpdated.subscribe(config => {
            this.config = config.new;
        })
    }

    ngOnDestroy(): void {
        this.configListener.unsubscribe();
    }


}
