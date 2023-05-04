import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-story',
  templateUrl: './loading-story.component.html',
  styleUrls: ['./loading-story.component.scss', '../mobile-story/mobile-story.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStoryComponent {
  @Input()
  mode: 'big' | 'small' = 'small';
}
