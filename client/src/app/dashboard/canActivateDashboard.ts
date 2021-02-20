import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { IS_MOBILE } from 'src/app/shared/const';
import {ConfigService} from '../shared/config.service';
import CategoryHelper from '../../../../model/Categories';


@Injectable({
    providedIn: 'root',
})
export class CanActivateDashboard implements CanActivate {
    public constructor(
        @Inject(IS_MOBILE) private isMobile: boolean,
        private router: Router,
        private config: ConfigService) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean | UrlTree {
        if (this.isMobile) {
            const config = this.config.getConfig().getValue();
            const firstCategory = CategoryHelper.vietnameseCategories()[0].name;
            let url = config.category == null || config.category === 'null' ? firstCategory : config.category;
            url = CategoryHelper.getCategory(url) == null ? firstCategory : url;
            return this.router.parseUrl(`/${url}`);
        }
        return true;
    }

}
