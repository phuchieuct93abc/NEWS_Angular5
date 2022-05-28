import { ChangeDetectionStrategy, Component, OnDestroy, QueryList, ViewChildren } from '@angular/core';
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
