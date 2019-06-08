import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {StoryComponent} from "../story.component";
import {BreakpointDetectorService} from "../../../shared/breakpoint.service";
import {ConfigService} from "../../../shared/config.service";
import {FavoriteService} from "../../../shared/favorite-story.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Story} from "../../../../../../model/Story";
import {Subject} from "rxjs";
import {ChangeDetectorService} from "./change-detector.service";

@Component({
    selector: 'app-mobile-story',
    templateUrl: './mobile-story.component.html',
    styleUrls: ['./mobile-story.component.scss']
})
export class MobileStoryComponent extends StoryComponent implements OnInit {

    @ViewChild("storyElement")
    storyElement: ElementRef;

    @Output()
    invalidCache = new EventEmitter<Story>();
    //
    // minHeight: number;
    //
    // private observerChange = new Subject<HTMLElement>();

    constructor(public breakpointService: BreakpointDetectorService,
                protected configService: ConfigService,
                protected favoriteService: FavoriteService,
                protected route: Router,
                protected activatedRoute: ActivatedRoute,

    ) {
        super(breakpointService, configService, favoriteService, route, activatedRoute)
    }

    onOpenStory() {
        setTimeout(() => {
            this.story.height = 0
        }, 1200)
    }


    ngOnDestroy(): void {
        // this.story.height =
        //     this.changeDetector.getDetector().uninstall((<HTMLDivElement>this.storyElement.nativeElement).getElementsByTagName("mat-card"));
        // this.observerChange.unsubscribe();
        this.story.height = (<HTMLDivElement>this.storyElement.nativeElement).clientHeight

        setTimeout(() => {

            this.invalidCache.emit(this.story);
        })
        super.ngOnDestroy();
    }

    ngOnInit(): void {
        super.ngOnInit();
        // this.observerChange.pipe(throttle(val => interval(200))).subscribe(element => {
        //     this.story.height=0;
        //     // var height = element.offsetHeight;
        //     // console.assert(this.story.title.indexOf("Việt Nam phụ thuộc 'ông già") != 0, "height ", this.story.title, height)
        //     //
        //     // this.story.height = height;
        //     // this.invalidCache.emit(this.story);
        //
        // })
        //
        // this.changeDetector.getDetector().listenTo((<HTMLDivElement>this.storyElement.nativeElement).getElementsByTagName("mat-card"), element => {
        //     this.observerChange.next(<HTMLElement>element);
        // });
    }

}
