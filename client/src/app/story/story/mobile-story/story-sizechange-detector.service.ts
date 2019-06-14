import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {Story} from "../../../../../../model/Story";
import * as resizer from "element-resize-detector";

@Injectable({
    providedIn: 'root'
})
export class StorySizechangeDetectorService {

    public sizeDetector = new Subject<Story>();
    readonly erd;

    constructor() {
        this.erd = resizer({
            strategy: "scroll" //<- For ultra performance.
        });
    }

    public getDetector() {
        return this.erd;
    }

}
