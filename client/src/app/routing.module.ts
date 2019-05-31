import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {ArticleComponent} from "./article/article.component";
import {ContentComponent} from "./content/content.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {MainComponent} from "./main/main.component";

const routes: Routes = [
    {
        path: '', component: DashboardComponent
    },
    {

        path: ':category', component: ContentComponent, children: [
            {path: ':title/:id', component: ArticleComponent},
            {path: ':id', component: ArticleComponent},
            {path: '', component: ArticleComponent}
        ]
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
