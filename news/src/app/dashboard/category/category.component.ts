import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';
import { Category } from '../../../../../model/Categories';
import { Story } from '../../../../../model/Story';
import { opacityNgIf } from '../../animation';
import { StoryService } from '../../shared/story.service';

class Queue {
  queue: (() => void)[] = [];
  checkAndRun$ = new Subject();
  running = false;

  constructor(private delay = 0) {
    this.checkAndRun$.subscribe(() => this.checkAndRun());
  }

  scheduler(action: () => void) {
    this.queue.push(action);
    this.checkAndRun();
  }
  dequeue() {
    setTimeout(() => {
      this.running = false;
      this.checkAndRun();
    }, this.delay);
  }
  private checkAndRun() {
    if (!this.running) {
      this.queue.shift()();
      this.running = true;
    }
  }
}

const queue = new Queue(500);
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
    queue.scheduler(() => {
      this.stories$ = this.storyService.getStoryByPage(this.category?.name, 1, null).pipe(
        map(({ story }) => [...story].slice(0, this.maximumStories)),
        take(1),
        finalize(() => queue.dequeue())
      );
    });
  }

  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
}
