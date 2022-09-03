import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { configFeature } from 'src/app/store/config.reducer';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  public isDarkTheme$: Observable<boolean>;
  public constructor(private store: Store) {}
  ngOnInit(): void {
    this.isDarkTheme$ = this.store.select(configFeature.selectTheme).pipe(map(() => true));
  }
}
