import {Component, OnInit} from '@angular/core';
import {Categories} from "../../../../model/Categories";
import {StoryListService} from "../shared/story-list.service";
import {NavigatorService} from "./navigator.service";

@Component({
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements OnInit {
    categories: any;
    isHide: boolean = false;
    isHiding: boolean = false;

    constructor(private storyListService: StoryListService, private navigatorService: NavigatorService) {
    }

    ngOnInit() {
        this.categories = Categories;
        setTimeout(() => {


            this.storyListService.onScrollUp.subscribe(() => {
                this.isHide = false
                setTimeout(() => {
                    this.isHiding = false

                }, 300)
            })
            this.storyListService.onScrollDown.subscribe(() => {
                this.isHiding = true;
                setTimeout(() => {

                    this.isHide = true;
                }, 300)
            })

        }, 5000)
        // this.navigatorService.onShowHeader.subscribe(() => {
        //     setTimeout(()=>{
        //
        //         this.isHiding = false;
        //         this.isHide = false;
        //     })
        // })

    }

}
