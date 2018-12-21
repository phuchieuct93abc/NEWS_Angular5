import {Component, OnInit, ViewChild} from '@angular/core';
import {StoryService} from "../../shared/story.service";
import {Story} from '../../../../../model/Story';
import {ActivatedRoute} from "@angular/router";
import {StoryListService} from "../../shared/story-list.service";
import {VirtualScrollerComponent} from "ngx-virtual-scroller";

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.css']
})
export class StoryListComponent implements OnInit {

    stories: Story[];
    isLoadingMore = false;

    category: string;
    protected buffer: Story[] = [];
    @ViewChild(VirtualScrollerComponent)
    private virtualScroller: VirtualScrollerComponent;


    constructor(private storyService: StoryService, private route: ActivatedRoute, private storyListService: StoryListService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.category = params['category'];
            this.storyService.resetPageNumber();
            this.storyService.getStories(this.category).subscribe(value => {
                this.isLoadingMore = false;
                this.stories = value;
            });
        });
        this.registerScrollTo();
    }

    vsEnd(event) {
        this.onLoadMore(event);
    }

    private registerScrollTo() {
        this.storyListService.scrollTo.subscribe(item => {
            const index = this.stories.findIndex(i => i.id === item.id);
            this.virtualScroller.items = this.stories;
            this.virtualScroller.scrollInto(this.stories[index]);
        })
    }

    private onLoadMore(event) {
        if (event.end !== this.stories.length - 1) return;

        if (!this.isLoadingMore) {
            this.isLoadingMore = true;
            this.storyService.getStories(this.category).subscribe(value => {
                this.isLoadingMore = false;
                this.stories = value;
            });
        }

    }


}
