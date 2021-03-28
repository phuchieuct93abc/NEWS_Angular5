import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IS_MOBILE } from 'src/app/shared/const';
import { StoryComponent } from '../story.component';
import { ConfigService } from '../../../shared/config.service';
import { FavoriteService } from '../../../shared/favorite-story.service';
import { StoryListService } from '../../story-list/story-list.service';
import { ImageViewerComponent } from './../../image-viewer/image-viewer.component';
import { IS_NODE } from './../../../shared/const';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-mobile-story',
    templateUrl: './mobile-story.component.html',
    styleUrls: ['./mobile-story.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileStoryComponent extends StoryComponent {


    @ViewChild(ImageViewerComponent)
    public imageViewerComponent: ImageViewerComponent;


    public isSelectedBefore = false;

    public afterSelectStory() {
        super.afterSelectStory();
        this.selected = true;

        this.isSelectedBefore = true;
        if (!this.isNode) {
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
        this.selected = false;
    }

}
