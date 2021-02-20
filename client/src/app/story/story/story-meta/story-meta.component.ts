import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Story } from '../../../../../../model/Story';
import CONFIG from '../../../../environments/environment';

@Component({
    selector: 'app-story-meta',
    templateUrl: './story-meta.component.html',
    styleUrls: ['./story-meta.component.scss'],
})
export class StoryMetaComponent implements OnInit {

    @Input()
    story: Story;

    sourceIcon: string;

    constructor() {
    }

    ngOnInit() {
        if (this.story.storyMeta.sourceIcon && this.story.storyMeta.sourceIcon.indexOf('http') < 0) {
            this.sourceIcon = `${CONFIG.baseUrl}${this.story.storyMeta.sourceIcon}`;
        } else {
            this.sourceIcon = this.story.storyMeta.sourceIcon;
        }
    }

}
