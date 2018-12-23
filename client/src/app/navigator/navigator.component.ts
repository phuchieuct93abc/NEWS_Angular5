import {Component, OnInit} from '@angular/core';
import {Categories} from "../../../../model/Categories";
import {StoryListService} from "../shared/story-list.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.scss'],
    animations: [
        trigger('openHide', [
            // ...
            state('hide', style({
                height: '0',
                overflow: 'hidden'
            })),
            transition('* => *', [
                animate('0.5s')
            ]),

        ]),
    ]
})
export class NavigatorComponent implements OnInit {
    categories: any;
    isHide: boolean = false;

    constructor(private storyListService: StoryListService) {
    }

    ngOnInit() {
        this.categories = Categories;
        setTimeout(() => {

            this.storyListService.onScrollUp.subscribe(() => {
                this.isHide = false
            })
            this.storyListService.onScrollDown.subscribe(() => {
                this.isHide = true;
            })

        }, 5000)

    }

}
