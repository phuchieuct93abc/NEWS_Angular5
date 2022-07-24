import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { IS_MOBILE } from 'src/app/shared/const';
import { updateConfigAction } from '../store/config.reducer';
import { IS_NODE } from './../shared/const';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  public isBrowser: boolean;
  public constructor(
    @Inject(IS_MOBILE) public isSmallScreen: boolean,
    @Inject(IS_NODE) public isNode: boolean,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  public ngOnInit() {
    this.isBrowser = !this.isNode;

    this.route.params.subscribe(({ category }) => {
      this.store.dispatch(updateConfigAction({ category }));
    });
  }
}
