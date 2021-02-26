import {ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector} from '@angular/core';


@Injectable(
    {
        providedIn: 'root'
    }
)
export class DomService {

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) {
    }

    appendComponent(component: any, parentElement: Element, options: any = {}) {
        // Create a component reference from the component
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);

        for (const key of Object.keys(options)) {
            const value = options[key];
            componentRef.instance[key] = value;
        }


        // Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(componentRef.hostView);

        // Get DOM element from component
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        if(typeof parentElement.append === 'function' ){
            // Append DOM element to the body
            parentElement.append(domElem);
        }

    }


}
