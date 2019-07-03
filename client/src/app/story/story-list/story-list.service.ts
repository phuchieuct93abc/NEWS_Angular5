import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {Story} from "../../../../../model/Story";
import {IPageInfo} from "ngx-virtual-scroller";


@Injectable({
    providedIn: 'root'
})
export class StoryListService {

    public onScroll = new Subject<IPageInfo>();
    public scrollTo = new Subject<Story>();
    public onScrollUp = new Subject<IPageInfo>();
    public onScrollDown = new Subject<IPageInfo>();

    public onSelectNextStory = new Subject<Story>();
    public onSelectPrevStory = new Subject<Story>();

    public currentSelectedStory:Story;
    private currentScrollEvent: IPageInfo = {
        scrollStartPosition: 0,
        scrollEndPosition: 0,
        startIndex: 0,
        endIndex: 0,
        endIndexWithBuffer: 0,
        maxScrollPosition: 0,
        startIndexWithBuffer: 0

    };

    constructor() {
        this.onScroll.subscribe(event => {
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

    selectNextStory() {
        this.onSelectNextStory.next();

    }

    selectPrevStory() {
        this.onSelectPrevStory.next();
    }


}
