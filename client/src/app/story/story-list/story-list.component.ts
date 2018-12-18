import {Component, OnInit} from '@angular/core';
import {StoryService} from "../../shared/story.service";
import {Story} from '../../../../../model/Story';
import {ActivatedRoute} from "@angular/router";

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

    constructor(private storyService: StoryService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.category = params['category'];
            this.storyService.resetPageNumber();
            this.storyService.getStories(this.category).subscribe(value => {
                this.isLoadingMore = false;
                this.stories = value;
            });
        })
    }

    onLoadMore(event) {
        if (event.end !== this.stories.length - 1) return;

        if (!this.isLoadingMore) {
            this.isLoadingMore = true;
            this.storyService.getStories(this.category).subscribe(value => {
                this.isLoadingMore = false;
                this.stories = value;
            });
        }

    }

    trackByFn(index, value: Story) {
        return value.id;
    }
}
