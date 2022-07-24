import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Story } from '../../../../../../model/Story';
import environment from '../../../../environments/environment';

@Component({
  selector: 'app-story-meta',
  templateUrl: './story-meta.component.html',
  styleUrls: ['./story-meta.component.scss'],
})
export class StoryMetaComponent implements OnInit {
  @Input()
  story: Story;

  sourceIcon: string;

  ngOnInit(): void {
    if (this.story!.storyMeta!.sourceIcon && this.story!.storyMeta!.sourceIcon.indexOf('http') < 0) {
      this.sourceIcon = `${environment.baseUrl}${this.story!.storyMeta!.sourceIcon}`;
    } else {
      this.sourceIcon = this.story!.storyMeta!.sourceIcon;
    }
  }
  openSource(event: Event): void {
    event.stopPropagation();
  }
}
