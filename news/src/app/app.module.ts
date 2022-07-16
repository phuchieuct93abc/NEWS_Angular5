import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformServer, registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, BrowserTransferStateModule, HammerModule, HAMMER_GESTURE_CONFIG, Meta, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LazyLoadImageModule } from 'ng-lazyload-image'; // <-- include ScrollHooks
import { ClipboardModule } from 'ngx-clipboard';
import CONFIG from 'src/environments/environment';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxSmoothParallaxModule } from 'ngx-smooth-parallax';
import { IsIntersectDirective } from '../directives/is-intersect.directive';
import { NavigationKeyboardDirective } from '../directives/navigation-keyboard.directive';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActionsComponent } from './article/actions/actions.component';
import { ShareComponent } from './article/actions/share/share.component';
import { ImageComponent } from './article/article-content/image/image.component';
import { VideoComponent } from './article/article-content/video/video.component';
import { ArticleThumbnailComponent } from './article/article-thumbnail/article-thumbnail.component';
import { ArticleComponent } from './article/article.component';
import { DisplayComponent } from './article/display/display.component';
import { InlineArticleComponent } from './article/inline-article/inline-article.component';
import { LoadingComponent } from './article/loading/loading.component';
import { SmoothScrollDirective } from './article/smooth-scroll.directive';
import { ContentComponent } from './content/content.component';
import { TopCategoryComponent } from './dashboard/category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HammerConfig } from './hammer.config';
import { NoopInterceptor } from './interceptor';
// import { HammerConfig } from './hammer.config';
import { MainComponent } from './main/main.component';
import { MaterialModule } from './material.module';
import { CategorySelectorComponent } from './navigator/category-selector/category-selector.component';
import { CategoryComponent } from './navigator/category-selector/category/category.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { NotificationModule } from './notification/notification.module';
import { AppShellNoRenderDirective, AppShellRenderDirective } from './shared/appShellRender.directive';
import { CapitalizeFirstPipe } from './shared/capitalizefirst.pipe';
import { IS_MOBILE, IS_NODE } from './shared/const';
import { SanitizeHtmlPipe } from './shared/sanitize.pipe';
import { ToNowPipe } from './shared/toNow.pipe';
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
import { articleHistoryReducer } from './store/reduces';
import { ArticleEffect } from './store/article.effect';
import { IsReadPipe } from './story/is-read.pipe';
import { configFeature } from './store/config.reducer';
import { SourceIframePipe } from './shared/sourceIframe.pipe';
import { ArticleIframeComponent } from './article/article-iframe/article-iframe.component';

registerLocaleData(en);
const isMobileProvider = {
  provide: IS_MOBILE,
  useExisting: true,
  useFactory: (breakpointObserver: BreakpointObserver, injector: Injector): boolean => {
    try {
      return injector.get('IS_MOBILE_SSR') as boolean;
    } catch (error) {
      return breakpointObserver.isMatched(['(max-width: 1000px)']);
    }
  },
  deps: [BreakpointObserver, Injector],
};

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    RouterModule,
    NotificationModule,
    ClipboardModule,
    LazyLoadImageModule,
    HammerModule,
    BrowserTransferStateModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: CONFIG.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
    StoreModule.forRoot({ articleHistory: articleHistoryReducer }),
    StoreModule.forFeature(configFeature),
    EffectsModule.forRoot([ArticleEffect]),
    NgxSmoothParallaxModule,
  ],
  declarations: [
    AppComponent,
    StoryListComponent,
    MobileStoryListComponent,
    StoryComponent,
    ArticleComponent,
    InlineArticleComponent,
    NavigatorComponent,
    MainComponent,
    ImageViewerComponent,
    LoadingComponent,
    ContentComponent,
    CapitalizeFirstPipe,
    TruncatePipe,
    SanitizeHtmlPipe,
    VideoComponent,
    CategorySelectorComponent,
    MobileStoryComponent,
    DisplayComponent,
    CategoryComponent,
    ActionsComponent,
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
    ArticleThumbnailComponent,
    ToNowPipe,
    AppShellNoRenderDirective,
    AppShellRenderDirective,
    SmoothScrollDirective,
    IsReadPipe,
    SourceIframePipe,
    ArticleIframeComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig },
    { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
    { provide: IS_NODE, useFactory: (platformId: unknown) => isPlatformServer(platformId), deps: [PLATFORM_ID] },
    isMobileProvider,
    Title,
    Meta,
    { provide: 'googleTagManagerId', useValue: 'GTM-NJ2C63G' },
  ],
  entryComponents: [VideoComponent, ImageViewerComponent, ImageComponent],
})
export class AppModule {}
