import {Injectable} from '@angular/core';
import {Subject} from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class NavigatorService {
    public onShowHeader = new Subject();
    public onHideHeader = new Subject();

    constructor() {

    }


}
