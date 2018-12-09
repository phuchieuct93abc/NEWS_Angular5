import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {StoryListComponent} from "./story-list/story-list.component";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    imports: [BrowserModule, FormsModule, HttpClientModule, BrowserAnimationsModule],
    declarations: [AppComponent, StoryListComponent],
    bootstrap: [AppComponent],


})
export class AppModule {
}
