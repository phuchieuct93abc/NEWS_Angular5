import {Injectable} from '@angular/core';
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Injectable({
    providedIn: 'root'
})
export class BreakpointDetectorService {

    public isSmallScreen: boolean;

    constructor(private breakpointObserver: BreakpointObserver) {
        const breakpointStateObservable = this.breakpointObserver.observe([Breakpoints.Small,Breakpoints.XSmall]).subscribe(value => {
            this.isSmallScreen = value.matches;
            console.log(this.isSmallScreen)
            breakpointStateObservable.unsubscribe();
        })
    }

}


