import {Component, OnInit} from '@angular/core';
import {StoryService} from "../../shared/story.service";
import {Observable} from "rxjs";
import {Story} from "../../../../../model/Story";

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.css']
})
export class StoryListComponent implements OnInit {

    stories: Observable<Story[]>

    constructor(private storyService: StoryService) {
    }

    ngOnInit() {
        this.stories = this.storyService.getStories() ;
    }

}
