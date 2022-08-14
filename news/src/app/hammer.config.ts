/* eslint-disable */
import { Inject, Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import { IS_NODE } from './shared/const';

declare const Hammer: any;
@Injectable()
export class HammerConfig extends HammerGestureConfig {
  public constructor(@Inject(IS_NODE) private isNode: boolean) {
    super();
  }
  public buildHammer(element: HTMLElement) {
    if (!this.isNode) {
      delete Hammer.defaults.cssProps.userSelect;

      return new Hammer(element, {
        touchAction: 'pan-y',
      });
    }
    return undefined;
  }
}
