import {Component, Input, OnInit} from '@angular/core';
import {Category} from "../../../../../model/Categories";
import {StoryService} from "../../shared/story.service";
import {Story} from "../../../../../model/Story";

@Component({
    selector: 'app-top-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class TopCategoryComponent implements OnInit {

    @Input()
    category: Category;
    stories: Story[];

    constructor(private storyService: StoryService) {
    }

    ngOnInit() {
        this.storyService.getStories(this.category.name).subscribe(stories => {
            this.stories = stories.splice(0,20);
        })

    }

}
