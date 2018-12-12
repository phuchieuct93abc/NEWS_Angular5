import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {ArticleComponent} from "./article/article.component";

const routes: Routes = [
    {path: ':category', component: ArticleComponent},
    {path: ':category/:id', component: ArticleComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        initialNavigation: 'enabled',
        paramsInheritanceStrategy: 'always'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}