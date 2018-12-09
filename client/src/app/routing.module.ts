import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import Article from "../../../model/Article";
import {ArticleComponent} from "./article/article.component";

const routes: Routes = [
    {path: '', component: ArticleComponent},
    {path: ':id', component: ArticleComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}