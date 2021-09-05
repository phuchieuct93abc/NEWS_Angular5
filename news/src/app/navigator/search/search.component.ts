import { Component, OnInit } from '@angular/core';
import { debounce } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';
import { StoryService } from '../../shared/story.service';
import { ConfigService } from '../../shared/config.service';
import { LoadingEventName, LoadingEventType, LoadingService } from '../../shared/loading.service';
import { DestroySubscriber } from './../../shared/destroy-subscriber';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent extends DestroySubscriber implements OnInit {
    public isSearching = false;
    public isLoading = false;
    public isDarkTheme: boolean;

    private keyupSubject = new Subject<string>();

    public constructor(private storyService: StoryService,
        public config: ConfigService,
        private loadingService: LoadingService) {
        super();
    }

    public ngOnInit() {
        this.config.getConfig().pipe(this.getTakeUntilDestroy()).subscribe(({ darkTheme }) => {
            this.isDarkTheme = darkTheme;
        });

        this.keyupSubject.pipe(debounce(() => interval(1000)), this.getTakeUntilDestroy())
        .subscribe((searchTextValue) => {
            if (!searchTextValue || searchTextValue.length === 0) {
                this.isSearching = false;
            }
            this.storyService.onSearch.next(searchTextValue);
        });

        this.loadingService.onLoading.subscribe((event) => {
            if (event.name === LoadingEventName.SEARCHING) {
                this.isLoading = event.type === LoadingEventType.START;
            }
        });
    }

    public onKeyup($event) {
        this.keyupSubject.next($event);
    }

}
