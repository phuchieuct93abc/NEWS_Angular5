import { AfterViewInit, ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { asyncScheduler, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil, throttleTime } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import CategoryHelper from '../../../../model/Categories';
import { AppComponent } from '../app.component';
import { AppService } from '../app.service';
import { configFeature } from '../store/config.reducer';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
})
export class NavigatorComponent implements AfterViewInit, OnDestroy {
  @ViewChild(AppComponent)
  public app: AppComponent;
  public readonly MIN_TOP = -63;
  public readonly MAX_TOP = 0;

  public isDarkMode: boolean;
  public isSmallImage: boolean;

  public selectedCategory$ = this.store.select(configFeature.selectCategory).pipe(
    map((category) => CategoryHelper.getCategory(category)),
    debounceTime(100)
  );
  onScrollTop = true;
  private onDestroy$ = new Subject<void>();

  public constructor(
    @Inject(IS_MOBILE) public isMobile: boolean,
    private appService: AppService,
    private store: Store,
    private ngZone: NgZone,
    private changeDetect: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'scroll')
        .pipe(
          map(() => window.scrollY),
          startWith(window.scrollY),
          map(() => window.scrollY === 0),
          distinctUntilChanged(),
          takeUntil(this.onDestroy$)
        )
        .subscribe((isOnTop) => {
          this.onScrollTop = isOnTop;
          this.changeDetect.detectChanges();
        });
    });
  }

  public toggleSidebar(): void {
    this.appService.toggleSidebar();
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
