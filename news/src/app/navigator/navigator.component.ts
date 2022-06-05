import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, HostListener, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { asyncScheduler, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, throttleTime } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import CategoryHelper from '../../../../model/Categories';
import { AppComponent } from '../app.component';
import { AppService } from '../app.service';
import { configFeature } from '../store/config.reducer';
import { DestroySubscriber } from './../shared/destroy-subscriber';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
})
export class NavigatorComponent {
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

  onScrollTop$ = typeof window !== 'undefined' && fromEvent(window, 'scroll').pipe(
    map(() => window.scrollY),
    startWith(window.scrollY),
    map(() => window.scrollY === 0),
    distinctUntilChanged(),
    throttleTime(500, asyncScheduler, { leading: true, trailing: true })
  );

  public constructor(@Inject(IS_MOBILE) public isMobile: boolean, private appService: AppService, private store: Store, private ngZone: NgZone) {}

  public toggleSidebar(): void {
    this.appService.toggleSidebar();
  }
}
