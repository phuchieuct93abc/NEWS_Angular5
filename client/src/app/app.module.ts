import {NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG, Meta, Title} from '@angular/platform-browser';
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
import {VideoComponent} from "./article/article-content/video/video.component";
import {MobileStoryComponent} from "./story/story/mobile-story/mobile-story.component";
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image'; // <-- include intersectionObserverPreset
import {DisplayComponent} from "./article/display/display.component";
import {CategorySelectorComponent} from "./navigator/category-selector/category-selector.component";
import {CategoryComponent} from "./navigator/category-selector/category/category.component";
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {NotificationModule} from "./notification/notification.module";
import {ActionsComponent} from "./article/actions/actions.component";
import {MobileStoryListComponent} from "./story/story-list/mobile-story-list/mobile-story-list.component";
import {ShareComponent} from "./article/actions/share/share.component";
import {ClipboardModule} from "ngx-clipboard";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TopCategoryComponent} from "./dashboard/category/category.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {EllipsisModule} from "ngx-ellipsis";
import {MatDividerModule} from "@angular/material";
import {StoryMetaComponent} from "./story/story/story-meta/story-meta.component";
import {en_US, NgZorroAntdModule, NZ_I18N} from 'ng-zorro-antd';
import {LoadingStoryComponent} from "./story/story/loading-story/loading-story.component";
import {ServiceWorkerModule} from '@angular/service-worker';
import {ImageComponent} from "./article/article-content/image/image.component";
import { SwipeToCloseDirective } from '../directives/swipe-to-close.directive';
import { IsIntersectDirective } from '../directives/is-intersect.directive';
import { NavigationKeyboardDirective } from '../directives/navigation-keyboard.directive';


@NgModule({
    imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        AppRoutingModule,
        MomentModule,
        RouterModule,
        MatButtonModule,
        NotificationModule,
        ClipboardModule,
        RouterModule,
        MatDividerModule,
        NgZorroAntdModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: true}),
        LazyLoadImageModule,
        

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
        CategorySelectorComponent,
        MobileStoryComponent,
        DisplayComponent,
        CategoryComponent,
        ActionsComponent,
        MobileStoryListComponent,
        ShareComponent,
        DashboardComponent,
        TopCategoryComponent,
        SidebarComponent,
        StoryMetaComponent,
        LoadingComponent,
        LoadingStoryComponent,
        ImageComponent,
         SwipeToCloseDirective,
         IsIntersectDirective,
         NavigationKeyboardDirective

    ],
    bootstrap: [AppComponent],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true},
        {provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig},
        {provide: NZ_I18N, useValue: en_US},
        Title,
        Meta,


    ],
    entryComponents: [
        VideoComponent, ImageViewerComponent, ImageComponent
    ]

})
export class AppModule {
}
