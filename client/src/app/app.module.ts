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
import {MainComponent} from "./main/main.component";
import {MomentModule} from 'ngx-moment';

import {LazyLoadImageModule} from 'ng-lazyload-image';
import {VirtualScrollerModule} from "ngx-virtual-scroller";
import {InlineArticleComponent} from "./article/inline-article/inline-article.component";
import {ImageViewerComponent} from "./story/image-viewer/image-viewer.component";
import {LoadingComponent} from "./article/loading/loading.component";
import {ContentComponent} from "./content/content.component";
import {SearchComponent} from "./navigator/search/search.component";


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
        MainComponent,
        InlineArticleComponent,
        ImageViewerComponent,
        LoadingComponent,
        ContentComponent,
        SearchComponent
    ],
    bootstrap: [AppComponent],
    providers: []

})
export class AppModule {
}
