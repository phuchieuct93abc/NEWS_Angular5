import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Category } from '../../../../../model/Categories';
import { StoryService } from '../../shared/story.service';
import { Story } from '../../../../../model/Story';
import { opacityNgIf } from '../../animation';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

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
  public stories$: Observable<Story[]>;
  public isExpanded = false;
  public maximumStories = 9;

  private onDestroy$ = new Subject<void>();

  public constructor(private storyService: StoryService) {}
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public ngOnInit(): void {
    this.stories$ = this.storyService.getStoryByPage(this.category?.name, 1, null).pipe(map(({ story }) => story));
  }

  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.maximumStories = Math.max(this.maximumStories, 20);
    }
  }
}
