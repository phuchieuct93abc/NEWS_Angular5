import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {HelloComponent} from './hello.component';
import {HttpClientModule} from "@angular/common/http";
import {MaterialModule} from "./material.module";
import {StoryListComponent} from "./story-list/story-list.component";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpClientModule, MaterialModule, StoryListComponent],
    declarations: [AppComponent, HelloComponent, MaterialModule],
    bootstrap: [AppComponent],

})
export class AppModule {
}
