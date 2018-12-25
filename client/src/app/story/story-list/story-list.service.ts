import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {Story} from "../../../../../model/Story";

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
    public onScrollUp = new Subject<ScrollEvent>();
    public onScrollDown = new Subject<ScrollEvent>();
    public vsScroll = new Subject();

    private currentScrollEvent: ScrollEvent = {
        scrollStartPosition: 0,
        scrollEndPosition: 0,
        startIndex: 0,
        end: 0,
        endIndex: 0,
        start: 0
    };

    constructor() {
        this.vsScroll.subscribe((event: ScrollEvent) => {
            const isMovingUp = this.currentScrollEvent.scrollStartPosition > event.scrollStartPosition;
            const isOnTopPage = event.startIndex == 0;
            if (isMovingUp || isOnTopPage) {
                this.onScrollUp.next(event);
            } else {
                this.onScrollDown.next(event);

            }
            this.currentScrollEvent = event;

        })
    }


}
