import { Component, Inject, Input, OnInit } from '@angular/core';
import { IS_MOBILE } from 'src/app/shared/const';
import CategoryHelper, { Category } from '../../../../model/Categories';
import { Config, ConfigService } from '../shared/config.service';
import { opacityNgIf } from '../animation';
import { DestroySubscriber } from './../shared/destroy-subscriber';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { configFeature, updateConfigAction } from '../store/config.reducer';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [opacityNgIf],
})
export class SidebarComponent extends DestroySubscriber implements OnInit {
  @Input()
  public isOpen: boolean;
  public vietnameseCategories: Category[];
  public englishCategories: Category[];
  public isDarkMode: boolean;
  public isSmallImage: boolean;

  public activatedCatagory: string;

  public constructor(@Inject(IS_MOBILE) public isMobile: boolean, private store: Store) {
    super();
  }

  public ngOnInit() {
    this.vietnameseCategories = CategoryHelper.vietnameseCategories();
    this.englishCategories = CategoryHelper.englishCategories();

    this.store.select(configFeature.selectConfigState).subscribe(({ darkTheme, smallImage, category }) => {
      this.isDarkMode = darkTheme!;
      this.isSmallImage = smallImage!;
      this.activatedCatagory = category!;
    });
  }

  public toggleDarkMode(value: boolean) {
    this.store.dispatch(updateConfigAction({ darkTheme: value }));
    // this.configService.updateConfig({ darkTheme: value });
  }

  public toogleDisplay(value: boolean) {
    this.store.dispatch(updateConfigAction({ smallImage: value }));
    // this.configService.updateConfig({ smallImage: value });
  }

  public onSelectCategory(category: string) {
    this.store.dispatch(updateConfigAction({ category }));
    // this.configService.updateConfig({ category });
  }
}
