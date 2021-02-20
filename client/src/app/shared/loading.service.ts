import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export enum LoadingEventName {
    MORE_STORY,
    FETCH_ARTICLE,
    SEARCHING
}

export enum LoadingEventType {
    START,
    FINISH
}

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    public onLoading = new Subject<{ name: LoadingEventName; type: LoadingEventType }>();
}
