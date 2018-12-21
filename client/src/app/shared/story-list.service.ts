import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {Story} from "../../../../model/Story";

export interface ScrollEvent {
    startIndex: number,
    endIndex: number,
    end: number,
    start: number,
    scrollStartPosition: number,
    scrollEndPosition: number
}

@Injectable({
    providedIn: 'root'
})
export class StoryListService {
    public onScroll = new Subject<ScrollEvent>();
    public scrollTo = new Subject<Story>();
    public onShowFixedCloseIcon = new Subject<Story>();
    public onFixedCloseClicked = new Subject();

    constructor() {
    }
}
