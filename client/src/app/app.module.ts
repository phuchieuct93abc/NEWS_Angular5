import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {StoryListComponent} from "./story/story-list/story-list.component";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./material.module";
import {StoryComponent} from "./story/story/story.component";
import {AppRoutingModule} from "./routing.module";
import {ArticleComponent} from "./article/article.component";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpClientModule, BrowserAnimationsModule, MaterialModule,AppRoutingModule],
    declarations: [AppComponent, StoryListComponent, StoryComponent,ArticleComponent],
    bootstrap: [AppComponent],
    providers:[]

})
export class AppModule {
}
