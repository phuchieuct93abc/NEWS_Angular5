import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    constructor() {
    }

    static isElementInViewport(el: HTMLElement) {


        var rect = el.getBoundingClientRect();


        return (
            rect.bottom > 60 && rect.top < 0

        );
    }
}
