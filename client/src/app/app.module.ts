import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {StoryListComponent} from "./story/story-list/story-list.component";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./material.module";
import {StoryComponent} from "./story/story/story.component";
import {AppRoutingModule} from "./routing.module";
import {ArticleComponent} from "./article/article.component";
import {NavigatorComponent} from "./navigator/navigator.component";
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ArticleHeaderComponent} from "./article/article-header/article-header.component";
import {MainComponent} from "./main/main.component";
import {MomentModule} from 'ngx-moment';

import {LazyLoadImageModule} from 'ng-lazyload-image';
import {VirtualScrollerModule} from "ngx-virtual-scroller";
import {InlineArticleComponent} from "./article/inline-article/inline-article.component";


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        AppRoutingModule,
        InfiniteScrollModule,
        MomentModule,
        LazyLoadImageModule,
        VirtualScrollerModule
    ],
    declarations: [
        AppComponent,
        StoryListComponent,
        StoryComponent,
        ArticleComponent,
        NavigatorComponent,
        ArticleHeaderComponent,
        MainComponent,
        InlineArticleComponent
    ],
    bootstrap: [AppComponent],
    providers: []

})
export class AppModule {
}
