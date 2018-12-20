import {Component, ElementRef, Input, OnInit} from '@angular/core';
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
    scrollTarget: any;

    selected: boolean = false;
    isSmallScreen: boolean;

    constructor(private breakpointService: BreakpointDetectorService) {
    }

    onSelectStory() {

        this.selected = true;
    }

    ngOnInit(): void {
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.scrollTarget = this.scrollContainer;

        // this.router.events.subscribe((event) => {
        //     if (event instanceof NavigationEnd) {
        //         this.selected = this.route.firstChild.snapshot.params['id'] === this.story.id;
        //
        //     }
        // });

    }


}
