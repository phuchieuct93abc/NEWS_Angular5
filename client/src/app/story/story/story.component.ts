import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit
} from '@angular/core';
import {Story} from "../../../../../model/Story";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";

@Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryComponent implements OnInit, AfterViewInit {

    @Input()
    story: Story;
    @Input()
    scrollContainer: ElementRef;
    scrollTarget: any;

    selected: boolean = false;
    isSmallScreen: boolean;

    constructor(private breakpointService: BreakpointDetectorService, private cdr: ChangeDetectorRef) {
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

    ngAfterViewInit() {
        // Since we know the list is not going to change
        // let's request that this component not undergo change detection at all
        // this.cdr.detach();
    }
}
