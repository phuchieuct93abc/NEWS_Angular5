import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Story} from "../../../../../model/Story";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

    @Input()
    story: Story;
    @Input()
    scrollContainer: ElementRef;
    scrollTarget: any;

    selected: boolean = false;
    isSmallScreen: boolean;

    constructor(private breakpointService: BreakpointDetectorService, private route: ActivatedRoute, private router: Router) {
    }

    onSelectStory() {
        this.selected = true;
    }

    ngOnInit(): void {
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.scrollTarget = this.scrollContainer.nativeElement;
        console.log(this.scrollTarget)
        // this.router.events.subscribe((event) => {
        //     if (event instanceof NavigationEnd) {
        //         this.selected = this.route.firstChild.snapshot.params['id'] === this.story.id;
        //
        //     }
        // });

    }
}
