import {Injectable} from '@angular/core';
import * as resizer from "element-resize-detector";

@Injectable({
    providedIn: 'root'
})
export class ChangeDetectorService {

    private erd;

    constructor() {
        this.erd = resizer({
            strategy: "scroll" //<- For ultra performance.
        });
    }

    public getDetector() {
        return this.erd;
    }
}
