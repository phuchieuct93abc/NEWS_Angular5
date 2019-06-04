import {Component, OnInit} from '@angular/core';
import {BreakpointDetectorService} from "../shared/breakpoint.service";
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../shared/category.service";

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

    isSmallScreen: boolean;

    constructor(public breakpointService: BreakpointDetectorService, private route: ActivatedRoute,private categoryService:CategoryService) {
    }

    ngOnInit() {
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.route.params.subscribe((param)=>{
            this.categoryService.setSelectedCategory(param['category']);
        })
    }

}
