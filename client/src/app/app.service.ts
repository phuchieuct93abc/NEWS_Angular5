import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AppService {

    public onToogleSidebar = new Subject<void>();

    constructor() {
    }

    public toggleSidebar() {
        this.onToogleSidebar.next();
    }
}
