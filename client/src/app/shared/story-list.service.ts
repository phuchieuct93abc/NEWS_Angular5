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
    public onScrollUp = new Subject();
    public onScrollDown = new Subject();
    public vsScroll = new Subject();

    private currentScrollEvent: ScrollEvent;

    constructor() {
        this.vsScroll.subscribe((event: ScrollEvent) => {
            if (this.currentScrollEvent && this.currentScrollEvent.scrollStartPosition > event.scrollStartPosition) {
                this.onScrollUp.next();
            } else {
                this.onScrollDown.next();
            }
            this.currentScrollEvent = event;

        })
    }


}
