import {Component, Input, OnInit} from '@angular/core';
import {Category} from "../../../../../model/Categories";
import {StoryService} from "../../shared/story.service";
import {Story} from "../../../../../model/Story";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'app-top-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    animations: [
        trigger("expand", [
            state('collapse', style({
                height: '260px'
            })),
            state('expand', style({
                height: '*'
            })),
            transition('* => *', [
                animate('0.5s')
            ]),
        ])
    ]
})
export class TopCategoryComponent implements OnInit {

    @Input()
    category: Category;
    stories: Story[] = [];
    isExpanded = false;


    constructor(private storyService: StoryService) {
    }

    ngOnInit() {
        this.storyService.getStoriesFirstPage(this.category.name).then(stories => {
            this.stories = stories.splice(0, 20);
        })

    }

}
