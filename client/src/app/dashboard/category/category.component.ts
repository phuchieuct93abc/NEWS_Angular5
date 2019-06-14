import {Component, Input, OnInit} from '@angular/core';
import {Category} from "../../../../../model/Categories";
import {StoryService} from "../../shared/story.service";
import {Story} from "../../../../../model/Story";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {opacityNgIf} from "../../animation";

@Component({
    selector: 'app-top-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    animations: [
        trigger("expand", [
            state('collapse', style({
                height: '350px'
            })),
            state('expand', style({
                height: '*'
            })),
            transition('collapse <=> expand', [
                animate('0.5s')
            ]),
        ]),
        opacityNgIf
    ]
})
export class TopCategoryComponent implements OnInit {

    @Input()
    category: Category;
    stories: Story[] = [];
    isExpanded = false;
    maximumStories: number = 9;


    constructor(private storyService: StoryService) {
    }

    ngOnInit() {
        this.storyService.getStoriesFirstPage(this.category.name).then(stories => {
            this.stories = stories;

        })

    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
            this.maximumStories = Math.max(this.maximumStories, 20);
        }
        console.log(this.maximumStories)
    }

}
