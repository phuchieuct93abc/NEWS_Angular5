import { ImageViewerComponent } from './../../image-viewer/image-viewer.component';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {StoryComponent} from "../story.component";
import {BreakpointDetectorService} from "../../../shared/breakpoint.service";
import {ConfigService} from "../../../shared/config.service";
import {FavoriteService} from "../../../shared/favorite-story.service";
import {ActivatedRoute, Router} from "@angular/router";
import RequestAnimationFrame from "../../../requestAnimationFrame.cons";
import {StoryListService} from "../../story-list/story-list.service";

@Component({
    selector: 'app-mobile-story',
    templateUrl: './mobile-story.component.html',
    styleUrls: ['./mobile-story.component.scss']
})
export class MobileStoryComponent extends StoryComponent {

    @ViewChild("storyElement", {static: false})
    storyElement: ElementRef;

    @ViewChild(ImageViewerComponent, {static: false}) imageViewerComponent: ImageViewerComponent


    constructor(public breakpointService: BreakpointDetectorService,
                protected configService: ConfigService,
                protected favoriteService: FavoriteService,
                protected route: Router,
                protected activatedRoute: ActivatedRoute,
                protected storyListService: StoryListService,
                protected element: ElementRef
    ) {
        super(breakpointService, configService, favoriteService, route, activatedRoute, storyListService,element)
    }

    onSelectStory(){
        
        this.story.selected = true;
        this.story.isSelectedBefore = true;
        super.onSelectStory();
        setTimeout(() => {

            window.scrollTo({top:this.element.nativeElement.offsetTop-60,behavior:'smooth'})
            this.imageViewerComponent.startParallax();

        });


    }
    onOpenStory() {
   

    }
    close() {
        window.scrollTo({top:this.element.nativeElement.offsetTop-60,behavior:"auto"})

        this.story.selected = false;
    }




}
