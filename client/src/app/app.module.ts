import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG, Meta, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image'; // <-- include ScrollHooks
// import { en_US, NgZorroAntdModule } from 'ng-zorro-antd';
import { ClipboardModule } from 'ngx-clipboard';
import { MomentModule } from 'ngx-moment';
import { IsIntersectDirective } from '../directives/is-intersect.directive';
import { NavigationKeyboardDirective } from '../directives/navigation-keyboard.directive';
import { NZModule } from './nz.module';
import { ParallaxDirective } from './../directives/parallax.directive';
import { AppComponent } from './app.component';
import { ActionsComponent } from './article/actions/actions.component';
import { ShareComponent } from './article/actions/share/share.component';
import { ImageComponent } from './article/article-content/image/image.component';
import { VideoComponent } from './article/article-content/video/video.component';
import { ArticleThumbnailComponent } from './article/article-thumbnail/article-thumbnail.component';
import { ArticleComponent } from './article/article.component';
import { CommentComponent } from './article/comments/comment/comment.component';
import { CommentsComponent } from './article/comments/comments.component';
import { DisplayComponent } from './article/display/display.component';
import { InlineArticleComponent } from './article/inline-article/inline-article.component';
import { LoadingComponent } from './article/loading/loading.component';
import { ContentComponent } from './content/content.component';
import { TopCategoryComponent } from './dashboard/category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HammerConfig } from './hammer.config';
import { MainComponent } from './main/main.component';
import { MaterialModule } from './material.module';
import { CategorySelectorComponent } from './navigator/category-selector/category-selector.component';
import { CategoryComponent } from './navigator/category-selector/category/category.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { SearchComponent } from './navigator/search/search.component';
import { NotificationModule } from './notification/notification.module';
import { AppRoutingModule } from './routing.module';
import { CachingInterceptor } from './shared/caching-interceptor';
import { CapitalizeFirstPipe } from './shared/capitalizefirst.pipe';
import { SanitizeHtmlPipe } from './shared/sanitize.pipe';
import { TruncatePipe } from './shared/trauncate.pipe';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ImageViewerComponent } from './story/image-viewer/image-viewer.component';
import { StoryListManagementComponent } from './story/story-list-management/story-list-management.component';
import { MobileStoryListComponent } from './story/story-list/mobile-story-list/mobile-story-list.component';
import { StoryListComponent } from './story/story-list/story-list.component';
import { LoadingStoryComponent } from './story/story/loading-story/loading-story.component';
import { MobileStoryComponent } from './story/story/mobile-story/mobile-story.component';
import { StoryMetaComponent } from './story/story/story-meta/story-meta.component';
import { StoryComponent } from './story/story/story.component';

const x = 1;

@NgModule({
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        AppRoutingModule,
        MomentModule,
        RouterModule,
        NotificationModule,
        ClipboardModule,
        NZModule,
        LazyLoadImageModule,
        ScrollingModule,
        HammerModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: true }),
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
        IsIntersectDirective,
        NavigationKeyboardDirective,
        StoryListManagementComponent,
        ParallaxDirective,
        ArticleThumbnailComponent,
    ],
    bootstrap: [AppComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
        { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig },
        // { provide: NZ_I18N, useValue: en_US },
        { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks },
        Title,
        Meta,

    ],
    entryComponents: [
        VideoComponent, ImageViewerComponent, ImageComponent,
    ],
})
export class AppModule {
}
