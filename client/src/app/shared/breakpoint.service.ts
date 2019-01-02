import {Injectable} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";

@Injectable({
    providedIn: 'root'
})
export class BreakpointDetectorService {

    public isSmallScreen: boolean;

    constructor(private breakpointObserver: BreakpointObserver) {

        this.isSmallScreen = this.breakpointObserver.isMatched(["(max-width: 575px)"]);

    }

}


