import {Directive, ElementRef} from '@angular/core';

@Directive({
    selector: '[app-video]'
})
export class VideoDirective {

    constructor(private el: ElementRef) {
        console.log(this.el);
    }

}
