import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ArticleService } from '../shared/article.service';
import { getArticleHistory, loadArticleHistorySuccess } from './actions';

@Injectable({ providedIn: 'root' })
export class ArticleEffect {
  saveReadArticle$ = createEffect(() =>
    this.$action.pipe(
      ofType(getArticleHistory),
      mergeMap(() => of(['123'])),
      map((articleHistory) => loadArticleHistorySuccess({ articleHistory }))
    )
  );
  constructor(private $action: Actions, private articleService: ArticleService) {}
}
