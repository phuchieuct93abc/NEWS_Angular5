import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoryComponent } from '../story.component';
import { ConfigService } from '../../../shared/config.service';
import { FavoriteService } from '../../../shared/favorite-story.service';
import { StoryListService } from '../../story-list/story-list.service';
import { ImageViewerComponent } from './../../image-viewer/image-viewer.component';
import { IS_MOBILE } from 'src/app/shared/const';

@Component({
    selector: 'app-mobile-story',
    templateUrl: './mobile-story.component.html',
    styleUrls: ['./mobile-story.component.scss'],
})
export class MobileStoryComponent extends StoryComponent {

    @ViewChild('storyElement')
    public storyElement: ElementRef;

    @ViewChild(ImageViewerComponent)
    public imageViewerComponent: ImageViewerComponent;

    public constructor(
        @Inject(IS_MOBILE) public isMobile: boolean,
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
        setTimeout(() => {
            window.scrollTo({ top: this.element.nativeElement.offsetTop - 50, behavior: 'smooth' });
        });
    }
    public onOpenStory() {
        //Open story;
    }

    public close() {
        window.scrollTo({ top: this.element.nativeElement.offsetTop - 50, behavior: 'auto' });
        this.story.selected = false;
    }

}
