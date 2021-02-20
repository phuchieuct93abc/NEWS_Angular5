import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import Article from '../../../../model/Article';
import CONFIG from '../../environments/environment';
import { Story } from '../../../../model/Story';
import ArticleComment from '../../../../model/ArticleComment';
import { StoryService } from './story.service';
import { MetaService } from './meta.service';
import { LoadingEventName, LoadingEventType, LoadingService } from './loading.service';
import { Cache } from './cache.service';
import { IS_NODE } from './const';


@Injectable({
    providedIn: 'root',
})
export class ArticleService {

    public onStorySelected = new BehaviorSubject<Article>(null);

    public constructor(private httpClient: HttpClient,
        private storyService: StoryService,
        private meta: MetaService,
        private loadingService: LoadingService,
        @Inject(IS_NODE) private isNode: boolean,
        private transferState: TransferState) {
    }

    @Cache()
    public getById(id: string, category: string): Observable<Article> {
        const COURSE_KEY = makeStateKey<Article>(`article-${id}-${category}`);

        const story: Story = this.storyService.getById(id);
        if (this.transferState.hasKey(COURSE_KEY)) {
            const article = this.transferState.get<Article>(COURSE_KEY, null);

            return of(Object.assign(new Article(), article));
        }

        if (story != null) {
            this.storyService.saveReadStory(story);

        }
        const options = {
            params: {
                url: id,
                category,
            },
        };
        this.loadingService.onLoading.next({ type: LoadingEventType.START, name: LoadingEventName.FETCH_ARTICLE });
        return this.httpClient.get(CONFIG.baseUrl + 'article', options).pipe(
            retry(3),
            map((result) => {

                this.loadingService.onLoading
                    .next({ type: LoadingEventType.FINISH, name: LoadingEventName.FETCH_ARTICLE });

                const article = Object.assign(new Article(), result);
                article.story = story;
                this.meta.updateMeta(article);
                if (this.isNode) {
                    this.transferState.set(COURSE_KEY, article);
                }
                return article;
            }));
    }


    @Cache()
    public getComment(id: string): Observable<ArticleComment[]> {
        return this.httpClient.get(CONFIG.baseUrl + 'comments', {
            params: {
                id,
            },
        }).pipe(retry(3), map((comments) => comments as ArticleComment[]));
    }


}
