import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Category } from '../../../../../model/Categories';
import { StoryService } from '../../shared/story.service';
import { Story } from '../../../../../model/Story';
import { opacityNgIf } from '../../animation';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
export class TopCategoryComponent implements OnInit, OnDestroy {
  @Input()
  public category: Category;
  public stories: Story[] = [];
  public isExpanded = false;
  public maximumStories = 9;

  private onDestroy$ = new Subject<void>();

  public constructor(private storyService: StoryService) {}
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public ngOnInit(): void {
    // this.storyService
    //   .getStoriesFirstPage(this.category.name)
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe((stories) => {
    //     this.stories = stories;
    //   });
  }

  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.maximumStories = Math.max(this.maximumStories, 20);
    }
  }
}
