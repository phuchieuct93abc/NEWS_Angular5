import { ConfigState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {BreakpointDetectorService} from "../shared/breakpoint.service";
import {Observable} from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class CanActivateDashboard implements CanActivate {
    constructor(private breakpointDetector: BreakpointDetectorService, private router: Router, private store: Store<ConfigState>) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Observable(resolve=>{
            if (!this.breakpointDetector.isSmallScreen) {
                resolve.next(true);
                return;
            }
                this.store.pipe<string>(select('config','category')).subscribe(category=>{

                    return this.router.navigate([category])
                })


        })
    }

}
