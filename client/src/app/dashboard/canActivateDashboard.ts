import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {BreakpointDetectorService} from "../shared/breakpoint.service";
import {Observable} from "rxjs";
import {ConfigService} from "../shared/config.service";
import CategoryHelper from "../../../../model/Categories";


@Injectable({
    providedIn: 'root'
})
export class CanActivateDashboard implements CanActivate {
    constructor(private breakpointDetector: BreakpointDetectorService, private router: Router, private config: ConfigService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.breakpointDetector.isSmallScreen) {
            let config = this.config.getConfig();
            let firstCategory = CategoryHelper.vietnameseCategories()[0].name;
            let url = config.category == null || config.category == 'null' ? firstCategory : config.category;
            url = CategoryHelper.findByName(url) == null ? firstCategory : url;
            return this.router.parseUrl(`/${url}`);
        }
        return true;
    }

}
