import { Component, OnDestroy, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { StoryService } from "../../../shared/story.service";
import { ActivatedRoute, Router } from "@angular/router";
import { StoryListService } from "../story-list.service";
import { BreakpointDetectorService } from "../../../shared/breakpoint.service";
import { ConfigService } from "../../../shared/config.service";
import { LoadingService } from "../../../shared/loading.service";
import { ArticleService } from "../../../shared/article.service";
import { StoryListComponent } from "../story-list.component";
import { StorySizechangeDetectorService } from "../../story/mobile-story/story-sizechange-detector.service";
import RequestAnimationFrame from "../../../requestAnimationFrame.cons";
import { MobileStoryComponent } from '../../story/mobile-story/mobile-story.component';

@Component({
    selector: 'app-mobile-story-list',
    templateUrl: './mobile-story-list.component.html',
    styleUrls: ['./mobile-story-list.component.scss'],
})
export class MobileStoryListComponent extends StoryListComponent implements OnDestroy {

    @ViewChild('loadmore',{static:false})
    loadMoreEl:ElementRef;

    @ViewChildren(MobileStoryComponent)
    storyMobiles:QueryList<MobileStoryComponent>

    isLoadingMore:boolean;
    constructor(protected storyService: StoryService,
        protected activatedRoute: ActivatedRoute,
        protected route: ActivatedRoute,
        protected router: Router,
        protected storyListService: StoryListService,
        protected breakpointService: BreakpointDetectorService,
        protected configService: ConfigService,
        protected loadingService: LoadingService,
        protected articleService: ArticleService,
        private changeDetector: StorySizechangeDetectorService
    ) {
        super(storyService, activatedRoute, route, router, storyListService, breakpointService, configService, loadingService, articleService)

    }


    async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.registerShowingMoveToTop();

        /**
         * Remove virtual scroll
         */
        // this.changeDetector.sizeDetector.subscribe(story => {
        //     this.virtualScroller.invalidateCachedMeasurementForItem(story);
        // });
        this.registerScrollTo();


     
    }

    private registerScrollTo() {
        this.storyListService.scrollTo.subscribe(item => {
            const index = this.stories.findIndex(i => i.id === item.id);
console.log(this.storyMobiles)
            this.storyMobiles.toArray()[Math.max(0,index-1)].scrollIntoView();

      // this.virtualScroller.items = this.stories;
      //this.scrollTo(this.stories[index], 0);
        })
    }

    private registerShowingMoveToTop() {
        this.storyListService.onScrollUp.subscribe((value) => {
            if (value.startIndex > 0) {

                this.isShowMoveTop = true;
                clearTimeout(this.hideMoveTopTimeout);
                this.hideMoveTopTimeout = setTimeout(() => {
                    RequestAnimationFrame(() => this.isShowMoveTop = false)
                }, 5000)
            }

        })
    }

    ngOnDestroy(): void {
        this.changeDetector.sizeDetector.unsubscribe();
    }
   afterInitStories(){
        super.afterInitStories();

        setTimeout(() => {
              
              let observer = new IntersectionObserver(async ()=>{
                  if(this.isLoadingMore)return;
                  console.log('loadmore')

                  this.isLoadingMore = true;
                  await this.loadMoreStories();
                  setTimeout(() => {
                    this.isLoadingMore = false;

                  }, 1000);
                  
              },  {                  
                threshold:0.1,
                rootMargin:'200px'
              });
              observer.observe(this.loadMoreEl.nativeElement)
        }, 1000);
       


    }


}
