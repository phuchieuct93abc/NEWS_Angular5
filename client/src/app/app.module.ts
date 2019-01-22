import {NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {StoryListComponent} from "./story/story-list/story-list.component";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./material.module";
import {StoryComponent} from "./story/story/story.component";
import {AppRoutingModule} from "./routing.module";
import {ArticleComponent} from "./article/article.component";
import {NavigatorComponent} from "./navigator/navigator.component";
import {MainComponent} from "./main/main.component";
import {MomentModule} from 'ngx-moment';

import {VirtualScrollerModule} from "ngx-virtual-scroller";
import {InlineArticleComponent} from "./article/inline-article/inline-article.component";
import {ImageViewerComponent} from "./story/image-viewer/image-viewer.component";
import {LoadingComponent} from "./article/loading/loading.component";
import {ContentComponent} from "./content/content.component";
import {SearchComponent} from "./navigator/search/search.component";
import {CapitalizeFirstPipe} from "./shared/capitalizefirst.pipe";
import {TruncatePipe} from "./shared/trauncate.pipe";
import {SanitizeHtmlPipe} from "./shared/sanitize.pipe";
import {CommentsComponent} from "./article/comments/comments.component";
import {CommentComponent} from "./article/comments/comment/comment.component";
import {CachingInterceptor} from "./shared/caching-interceptor";
import {HammerConfig} from "./hammer.config";
import {VideoComponent} from "./article/video/video.component";
import {CategoryComponent} from "./navigator/category/category.component";
import {MobileStoryComponent} from "./story/story/mobile-story/mobile-story.component";



@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        AppRoutingModule,
        MomentModule,
        VirtualScrollerModule,
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
        SearchComponent,
        CapitalizeFirstPipe,
        TruncatePipe,
        SanitizeHtmlPipe,
        CommentComponent,
        CommentsComponent,
        VideoComponent,
        CategoryComponent,
        MobileStoryComponent


    ],
    bootstrap: [AppComponent],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true},
        {provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig},

    ],
    entryComponents:[
        VideoComponent
    ]

})
export class AppModule {
}
