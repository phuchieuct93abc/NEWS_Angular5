/* eslint-disable max-classes-per-file */
import { isPlatformServer } from '@angular/common';
import { Directive, OnInit, ViewContainerRef, TemplateRef, Inject, PLATFORM_ID } from '@angular/core';

@Directive({
    selector: '[appShellRender]',
})
export class AppShellRenderDirective implements OnInit {

    public constructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        @Inject(PLATFORM_ID) private platformId) {}

    public ngOnInit() {
        if (isPlatformServer(this.platformId)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
};


@Directive({
    selector: '[appShellNoRender]',
})
export class AppShellNoRenderDirective implements OnInit {

    public constructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        @Inject(PLATFORM_ID) private platformId) {}

    public ngOnInit() {
        if (isPlatformServer(this.platformId)) {
            this.viewContainer.clear();
        } else {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
