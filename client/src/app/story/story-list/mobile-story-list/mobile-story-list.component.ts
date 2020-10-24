import { ScrollDispatcher } from '@angular/cdk/overlay';
import { Component, OnDestroy, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { StoryService } from "../../../shared/story.service";
import { ActivatedRoute, Router } from "@angular/router";
import { StoryListService } from "../story-list.service";
import { BreakpointDetectorService } from "../../../shared/breakpoint.service";
import { ConfigService } from "../../../shared/config.service";
import { LoadingService } from "../../../shared/loading.service";
import { ArticleService } from "../../../shared/article.service";
import { StoryListComponent } from "../story-list.component";
import RequestAnimationFrame from "../../../requestAnimationFrame.cons";
import { MobileStoryComponent } from '../../story/mobile-story/mobile-story.component';
import { Story } from '../../../../../../model/Story';

@Component({
    selector: 'app-mobile-story-list',
    templateUrl: './mobile-story-list.component.html',
    styleUrls: ['./mobile-story-list.component.scss'],
})
export class MobileStoryListComponent extends StoryListComponent implements OnDestroy {

    @ViewChildren(MobileStoryComponent)
    storyMobiles: QueryList<MobileStoryComponent>

    isLoadingMore: boolean;
    constructor(protected storyService: StoryService,
        protected activatedRoute: ActivatedRoute,
        protected route: ActivatedRoute,
        protected router: Router,
        protected storyListService: StoryListService,
        protected breakpointService: BreakpointDetectorService,
        protected configService: ConfigService,
        protected loadingService: LoadingService,
        protected articleService: ArticleService,
        protected scrollDispatcher: ScrollDispatcher

    ) {
        super(storyService, activatedRoute, route, router, storyListService, breakpointService, configService, 
            loadingService, articleService,scrollDispatcher)

    }


    async ngOnInit(): Promise<void> {
        super.ngOnInit();
    }

    private scrollToStory(story: Story) {
        setTimeout(() => {
            const index = this.stories.findIndex(i => i.id === story.id);
            const el =this.storyMobiles.toArray()[Math.max(0, index)].getElement();
            window.scrollTo({top:el.offsetTop-60,behavior:'smooth'})
        }, 0);         
      
    }
    protected scrollTop(){
        window.scrollTo({top:0,behavior:'smooth'});

    }

   

    ngOnDestroy(): void {
    }

    protected scrollTo(story: Story, animation = 500, offset = -60) {
        this.scrollToStory(story);
    }

    async loadmore(isIntersect: boolean){
        if (this.isLoadingMore || !isIntersect) return;
        this.isLoadingMore = true;
        await this.loadMoreStories();
        setTimeout(() => {
            this.isLoadingMore = false;
        });


    }


}
