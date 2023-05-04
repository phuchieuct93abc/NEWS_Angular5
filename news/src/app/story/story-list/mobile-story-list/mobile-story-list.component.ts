import { Component, QueryList, ViewChildren } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { Story } from '../../../../../../model/Story';
import { MobileStoryComponent } from '../../story/mobile-story/mobile-story.component';
import { StoryListComponent } from '../story-list.component';

@Component({
  selector: 'app-mobile-story-list',
  templateUrl: './mobile-story-list.component.html',
  styleUrls: ['./mobile-story-list.component.scss', '../story-list.component.scss'],
})
export class MobileStoryListComponent extends StoryListComponent {
  @ViewChildren(MobileStoryComponent)
  public storyMobiles: QueryList<MobileStoryComponent>;

  debugSkeleton = false;

  protected selectFirstStory(): void {
    if (this.selectedStory != null) {
      return;
    }
    if (this.firstStory != null) {
      this.firstStory.story.pipe(take(1), takeUntil(this.onDestroy$)).subscribe((story) => (this.selectedStory = story));
    }
  }
  protected scrollTop(): void {
    if (this.isNode) {
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected scrollTo(story: Story): void {
    setTimeout(() => {
      const index = this.stories.findIndex((i) => i.id === story.id);
      const el = this.storyMobiles.toArray()[Math.max(0, index)].getElement();
      window.scrollTo({ top: el.offsetTop - 58, behavior: 'smooth' });
    }, 0);
  }
}
