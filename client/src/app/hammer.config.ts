import {HammerGestureConfig} from "@angular/platform-browser";

export class HammerConfig extends HammerGestureConfig {
    buildHammer(element: HTMLElement) {
        return new Hammer(element, {
            touchAction: "pan-y"
        });
    }
}
