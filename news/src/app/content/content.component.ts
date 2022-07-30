import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { IS_MOBILE } from 'src/app/shared/const';
import { updateConfigAction } from '../store/config.reducer';
import { onChangeCategory } from '../store/story.reducer';
import { IS_NODE } from './../shared/const';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, OnDestroy {
  public isBrowser: boolean;
  private onDestroy$ = new Subject<void>();
  public constructor(
    @Inject(IS_MOBILE) public isSmallScreen: boolean,
    @Inject(IS_NODE) public isNode: boolean,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  public ngOnInit() {
    this.isBrowser = !this.isNode;

    this.route.paramMap.pipe(takeUntil(this.onDestroy$)).subscribe((params) => {
      this.store.dispatch(onChangeCategory({ category: params.get('category') }));
      this.store.dispatch(updateConfigAction({ category: params.get('category') }));
    });
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
