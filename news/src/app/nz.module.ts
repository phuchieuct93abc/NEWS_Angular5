import { NgModule } from '@angular/core';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSliderModule } from 'ng-zorro-antd/slider';

const modules = [NzSwitchModule, NzDividerModule, NzSliderModule];

@NgModule({
  exports: modules,
  imports: modules,
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class NZModule {}
