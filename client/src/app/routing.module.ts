import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {ArticleComponent} from "./article/article.component";
import {ContentComponent} from "./content/content.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CanActivateDashboard} from "./dashboard/canActivateDashboard";

const routes: Routes = [
    {
        path: '', component: DashboardComponent,
        canActivate: [CanActivateDashboard]
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
