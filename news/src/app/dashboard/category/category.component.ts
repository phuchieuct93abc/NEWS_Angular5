import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../../../../../model/Categories';
import { Story } from '../../../../../model/Story';
import { opacityNgIf } from '../../animation';
import { StoryService } from '../../shared/story.service';

let queue = 0;
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
  public stories$: Observable<Story[]>;
  public isExpanded = false;
  public loadingStories = Array(10).fill('');
  private readonly maximumStories = 10;

  public constructor(private storyService: StoryService) {}

  public ngOnInit(): void {
    setTimeout(() => {
      this.stories$ = this.storyService
        .getStoryByPage(this.category?.name, 1, null)
        .pipe(map(({ story }) => [...story].slice(0, this.maximumStories)));
    }, queue * 1000);
    queue++;
  }

  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
}
