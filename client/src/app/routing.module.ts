import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {ArticleComponent} from "./article/article.component";
import {ContentComponent} from "./content/content.component";

const routes: Routes = [
    {
        path: ':category', component: ContentComponent, children: [
            {path: ':title/:id', component: ArticleComponent},
            {path: ':id', component: ArticleComponent},
            {path: '', component: ArticleComponent}
        ]
    },
    {
        path: '', redirectTo: '/tin-nong', pathMatch: 'full'

    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            initialNavigation: 'enabled',
            paramsInheritanceStrategy: 'always'
        })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}