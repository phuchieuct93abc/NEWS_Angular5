import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Story} from "../../../../../model/Story";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";

@Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit {

    @Input()
    story: Story;
    @Input()
    scrollContainer: ElementRef;
    @Output()
    onSelectedStory = new EventEmitter<Story>();
    scrollTarget: any;

    selected: boolean = false;
    isSmallScreen: boolean;

    constructor(private breakpointService: BreakpointDetectorService) {
    }

    onSelectStory() {

        this.selected = true;
        this.onSelectedStory.emit(this.story);
    }

    ngOnInit(): void {
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.scrollTarget = this.scrollContainer;

    }


}
