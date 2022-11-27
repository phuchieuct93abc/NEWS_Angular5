import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { Category } from '../../../../../model/Categories';
import { Story } from '../../../../../model/Story';
import { opacityNgIf } from '../../animation';
import { StoryService } from '../../shared/story.service';

class Queue<T> {
  private queue: { id: string; action: Observable<T> }[] = [];
  private checkAndRun$ = new Subject();
  private running = false;
  private result = new Subject<{ id: string; result: T }>();

  private onDestroy$ = new Subject<void>();

  constructor(private delay = 0) {
    this.checkAndRun$.subscribe(() => this.checkAndRun());
  }

  cancel() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  scheduler(action: Observable<T>): Observable<T> {
    const id = uuid() as string;
    this.queue.push({ id, action });
    this.checkAndRun();
    return this.result.pipe(
      filter(({ id: resultId }) => resultId === id),
      map(({ result }) => result)
    );
  }
  dequeue() {
    setTimeout(() => {
      this.running = false;
      this.checkAndRun();
    }, this.delay);
  }
  private checkAndRun(): void {
    if (!this.running && this.queue.length > 0) {
      const { id, action } = this.queue.shift();
      action.pipe(takeUntil(this.onDestroy$)).subscribe((result) => {
        this.result.next({ id, result });
        this.dequeue();
      });
      this.running = true;
    }
  }
}

const queue = new Queue<Story[]>(0);
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
  public loadingStories = Array(10).fill('');

  private readonly maximumStories = 10;
  private onDestroy$ = new Subject<void>();

  public constructor(private storyService: StoryService) {}

  public ngOnInit(): void {
    this.stories$ = queue.scheduler(
      this.storyService.getStoryByPage(this.category?.name, 1, null).pipe(map(({ story }) => [...story].slice(0, this.maximumStories)))
    );
  }

  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    queue.cancel();
  }
}
