import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading-story',
  templateUrl: './loading-story.component.html',
  styleUrls: ['./loading-story.component.scss', '../mobile-story/mobile-story.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStoryComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
