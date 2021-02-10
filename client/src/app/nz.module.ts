import { NgModule } from '@angular/core';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';


const modules = [

];

@NgModule({
    exports: modules,
    imports: modules,
    providers: [
        { provide: NZ_I18N, useValue: en_US },
    ],
})
export class NZModule {
}
