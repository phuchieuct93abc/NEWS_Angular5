import {Injectable} from '@angular/core';
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Injectable({
    providedIn: 'root'
})
export class BreakpointDetectorService {

    public isSmallScreen: boolean;

    constructor(private breakpointObserver: BreakpointObserver) {
        const breakpointStateObservable = this.breakpointObserver.observe(["(max-width: 575px)"]).subscribe(value => {
            this.isSmallScreen = value.matches;
            breakpointStateObservable.unsubscribe();
        })
    }

}


