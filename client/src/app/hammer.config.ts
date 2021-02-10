import {HammerGestureConfig} from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
    public buildHammer(element: HTMLElement) {
        return new Hammer(element, {
            touchAction: 'pan-y',
        });
    }
}
