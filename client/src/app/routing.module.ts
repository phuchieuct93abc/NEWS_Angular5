import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {ArticleComponent} from "./article/article.component";
import {MainComponent} from "./main/main.component";

const routes: Routes = [
    {
        path: ':category', component: MainComponent, children: [
            {path: ':id', component: ArticleComponent}

        ]
    },
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