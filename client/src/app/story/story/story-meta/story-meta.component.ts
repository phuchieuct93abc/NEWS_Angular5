import {Component, Input, OnInit} from '@angular/core';
import {Story} from "../../../../../../model/Story";

@Component({
    selector: 'app-story-meta',
    templateUrl: './story-meta.component.html',
    styleUrls: ['./story-meta.component.scss']
})
export class StoryMetaComponent implements OnInit {

    @Input()
    story: Story




    constructor() {
    }

    ngOnInit() {
    }

}