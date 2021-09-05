import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Story } from '../../../../../model/Story';


@Injectable({
    providedIn: 'root'
})
export class StoryListService {

    private onSelectNextStory = new Subject<void>();
    private onSelectPrevStory = new Subject<void>();


    selectNextStory(): void {
        this.onSelectNextStory.next();
    }

    selectPrevStory(): void {
        this.onSelectPrevStory.next();
    }

    public onNext(): Observable<void>{
        return this.onSelectNextStory.asObservable();

    }
    public onPrev(): Observable<void>{
        return this.onSelectPrevStory.asObservable();
    }

}
