import { Component, Inject, OnInit } from '@angular/core';
import { IS_MOBILE } from 'src/app/shared/const';

@Component({
  selector: 'app-story-list-management',
  templateUrl: './story-list-management.component.html',
  styleUrls: ['./story-list-management.component.scss'],
})
export class StoryListManagementComponent {
  public constructor(@Inject(IS_MOBILE) public isSmallScreen: boolean) {

  }
}
