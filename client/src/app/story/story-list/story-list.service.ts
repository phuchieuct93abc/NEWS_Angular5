import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Story } from '../../../../../model/Story';


@Injectable({
    providedIn: 'root'
})
export class StoryListService {

    public onSelectNextStory = new Subject<Story>();
    public onSelectPrevStory = new Subject<Story>();


    selectNextStory(): void {
        this.onSelectNextStory.next();
    }

    selectPrevStory(): void {
        this.onSelectPrevStory.next();
    }

}
