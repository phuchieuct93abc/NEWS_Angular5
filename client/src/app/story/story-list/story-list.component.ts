import {Component, OnInit} from '@angular/core';
import {StoryService} from "../../shared/story.service";
import {Observable, of} from "rxjs";
import {Story} from '../../../../../model/Story';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.css']
})
export class StoryListComponent implements OnInit {

    stories: Observable<Story[]>;
    category: string;

    constructor(private storyService: StoryService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.category = params['category'];
            this.storyService.resetPageNumber();
            this.stories = this.storyService.getStories(this.category);
        })
    }

    onLoadMore() {
        this.storyService.getStories(this.category).subscribe(value => this.stories = of(value));
    }
}
