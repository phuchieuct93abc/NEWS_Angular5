import {Component, Input, OnInit} from '@angular/core';
import {Story} from "../../../../../model/Story";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

    @Input()
    story: Story;

    constructor(private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
    }

    navigate(story: Story) {
        this.router.navigate([story.id], {relativeTo: this.route.firstChild);
    }


}
