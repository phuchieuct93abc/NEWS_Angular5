import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IS_MOBILE } from 'src/app/shared/const';
import { StoryComponent } from '../story.component';
import { ConfigService } from '../../../shared/config.service';
import { FavoriteService } from '../../../shared/favorite-story.service';
import { StoryListService } from '../../story-list/story-list.service';
import { ImageViewerComponent } from './../../image-viewer/image-viewer.component';
import { IS_NODE } from './../../../shared/const';

@Component({
    selector: 'app-mobile-story',
    templateUrl: './mobile-story.component.html',
    styleUrls: ['./mobile-story.component.scss'],
})
export class MobileStoryComponent extends StoryComponent {

    @ViewChild(ImageViewerComponent)
    public imageViewerComponent: ImageViewerComponent;

    public constructor(
        @Inject(IS_MOBILE) public isMobile: boolean,
        @Inject(IS_NODE) public isNode: boolean,
        protected configService: ConfigService,
        protected favoriteService: FavoriteService,
        protected route: Router,
        protected activatedRoute: ActivatedRoute,
        protected storyListService: StoryListService,
        protected element: ElementRef,
    ) {
        super(isMobile, configService, favoriteService, route, activatedRoute, storyListService, element);
    }

    public onSelectStory() {
        this.story.selected = true;
        this.story.isSelectedBefore = true;
        super.onSelectStory();
        if(!this.isNode){

            setTimeout(() => {
                window.scrollTo({ top: this.element.nativeElement.offsetTop - 58, behavior: 'smooth' });
            });
        }
    }
    public onOpenStory() {
        //Open story;
    }

    public close() {
        window.scrollTo({ top: this.element.nativeElement.offsetTop - 58, behavior: 'auto' });
        this.story.selected = false;
    }

}
