import {Component, Input, OnInit} from '@angular/core';
import {Story} from "../../../../../model/Story";

@Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

    @Input()
    story: Story;

    constructor() {
    }

    ngOnInit() {
    }

}
