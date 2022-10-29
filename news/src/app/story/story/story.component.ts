import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map, startWith, takeUntil, tap } from 'rxjs/operators';
import * as speakingurl from 'speakingurl';
import { IS_MOBILE, IS_NODE } from 'src/app/shared/const';
import { Story } from '../../../../../model/Story';
import { ConfigService } from '../../shared/config.service';
import { StoryListService } from '../story-list/story-list.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryComponent implements OnInit, OnDestroy {
  @Output()
  public onSelectedStory = new EventEmitter<Story>();
  @Input()
  public story: Story;
  @Input()
  public scrollContainer: ElementRef;
  @Input()
  public category: string;

  @Input()
  public selected = false;

  public configListener: Subscription;
  public isActive$: Observable<boolean>;
  private onDestroy$ = new Subject<void>();

  constructor(
    @Inject(IS_NODE) public isNode: boolean,
    @Inject(IS_MOBILE) public isMobile: boolean,
    protected configService: ConfigService,
    protected route: Router,
    protected activatedRoute: ActivatedRoute,
    protected storyListService: StoryListService,
    protected element: ElementRef<HTMLElement>,
    protected store: Store
  ) {}

  public ngOnInit(): void {
    this.isActive$ = this.route.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute.firstChild?.snapshot.params),
      startWith(this.activatedRoute.firstChild?.snapshot.params),
      filter((params) => params != null),
      map((param) => param.id === this.story.id),
      tap((active) => {
        if (active) {
          this.afterSelectStory();

          this.onSelectedStory.emit(this.story);
        }
      }),
      takeUntil(this.onDestroy$)
    );

    if (this.story.isOpenning) {
      this.selectStory();
    }
  }

  url(text: string): string {
    return speakingurl(text);
  }

  public getElement(): HTMLElement {
    return this.element.nativeElement;
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  protected selectStory(): void {
    this.selected = true;
  }
  protected afterSelectStory(): void {}
}
