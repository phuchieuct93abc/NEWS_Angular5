import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IS_MOBILE } from 'src/app/shared/const';
import CategoryHelper from '../../../../model/Categories';
import { configFeature } from '../store/config.reducer';

@Injectable({
  providedIn: 'root',
})
export class CanActivateDashboard implements CanActivate {
  public constructor(@Inject(IS_MOBILE) private isMobile: boolean, private router: Router, private store: Store) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<UrlTree> {
    if (this.isMobile) {
      return new Observable((observer) => {
        this.store.select(configFeature.selectCategory).subscribe((category) => {
          const firstCategory = CategoryHelper.vietnameseCategories()[0].name;
          let url = category == null || category === 'null' ? firstCategory : category;
          url = CategoryHelper.getCategory(url) == null ? firstCategory : url;
          observer.next(this.router.parseUrl(`/${url}`));
        });
      });
    }
    return true;
  }
}
