import { Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Category } from '../../../../../model/Categories';
import { StoryService } from '../../shared/story.service';
import { Story } from '../../../../../model/Story';
import { opacityNgIf } from '../../animation';

@Component({
  selector: 'app-top-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  animations: [
    trigger('expand', [
      state(
        'collapse',
        style({
          height: '350px',
        })
      ),
      state(
        'expand',
        style({
          height: '*',
        })
      ),
      transition('collapse <=> expand', [animate('0.5s')]),
    ]),
    opacityNgIf,
  ],
})
export class TopCategoryComponent implements OnInit {
  @Input()
  public category: Category;
  public stories: Story[] = [];
  public isExpanded = false;
  public maximumStories = 9;

  public constructor(private storyService: StoryService) {}

  public ngOnInit() {
    this.storyService.getStoriesFirstPage(this.category.name).subscribe((stories) => {
      this.stories = stories;
    });
  }

  public toggleExpand() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.maximumStories = Math.max(this.maximumStories, 20);
    }
  }
}
