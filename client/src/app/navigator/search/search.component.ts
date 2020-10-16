import {Component, OnInit} from '@angular/core';
import {debounce} from "rxjs/operators";
import {interval, Subject} from "rxjs";
import {StoryService} from "../../shared/story.service";
import {ConfigService} from "../../shared/config.service";
import {LoadingEventName, LoadingEventType, LoadingService} from "../../shared/loading.service";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    isSearching = false;
    isLoading = false;

    private keyupSubject = new Subject<string>();

    constructor(private storyService: StoryService, public config: ConfigService, private loadingService: LoadingService) {
    }

    ngOnInit() {
        this.keyupSubject.pipe(debounce(() => interval(1000))).subscribe(searchTextValue => {
            if (!searchTextValue || searchTextValue.length == 0) {
                this.isSearching = false;
            }
            this.storyService.onSearch.next(searchTextValue);
        });

        this.loadingService.onLoading.subscribe(event => {
            if (event.name == LoadingEventName.SEARCHING) {
                this.isLoading = event.type == LoadingEventType.START;
            }
        })
    }

    onKeyup($event) {
        this.keyupSubject.next($event)
    }

}
