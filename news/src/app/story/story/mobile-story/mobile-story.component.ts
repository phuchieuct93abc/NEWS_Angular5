import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { StoryComponent } from '../story.component';
import { ImageViewerComponent } from './../../image-viewer/image-viewer.component';

@Component({
  selector: 'app-mobile-story',
  templateUrl: './mobile-story.component.html',
  styleUrls: ['./mobile-story.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileStoryComponent extends StoryComponent {
  @ViewChild(ImageViewerComponent)
  public imageViewerComponent: ImageViewerComponent;

  public isSelectedBefore = false;

  public afterSelectStory(): void {
    super.afterSelectStory();
    this.selected = true;

    this.isSelectedBefore = true;
    if (!this.isNode) {
      setTimeout(() => {
        window.scrollTo({ top: this.element.nativeElement.offsetTop - 58, behavior: 'smooth' });
      });
    }
  }

  public close(): void {
    this.route.navigate(['/']);
    window.scrollTo({ top: this.element.nativeElement.offsetTop - 58, behavior: 'auto' });
    this.selected = false;
  }
}
