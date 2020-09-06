import { Component, OnInit } from '@angular/core';
import { BreakpointDetectorService } from '../../shared/breakpoint.service';

@Component({
  selector: 'app-story-list-management',
  templateUrl: './story-list-management.component.html',
  styleUrls: ['./story-list-management.component.scss']
})
export class StoryListManagementComponent implements OnInit {
  isSmallScreen = false;
  constructor(private breakpointService: BreakpointDetectorService) { }

  ngOnInit() {
    this.isSmallScreen = this.breakpointService.isSmallScreen;

  }



}
