
import {HammerGestureConfig} from '@angular/platform-browser';
import { Inject, Injectable } from '@angular/core';
import CONFIG from 'src/environments/environment';
import { IS_NODE } from './shared/const';

// const HammerLoader = () => import('hammerjs')

// async initHammer () {
//       const hammer = await Hammer().then(mod => mod.default || mod)
//       const hammerEl = new hammer.Manager(this.$el)
//       const Swipe = new hammer.Swipe()

//       // Add the recognizer to the manager
//       hammerEl.add(Swipe)
//       hammerEl.on('swipe', (e) => {
//         console.log(e)
//       })
// }
declare const Hammer: any;
@Injectable()
export class HammerConfig extends HammerGestureConfig {
    public constructor(@Inject(IS_NODE) private isNode: boolean){
        super();
    }
    public buildHammer(element: HTMLElement) {
        if(!this.isNode){
            return new Hammer(element, {
                 touchAction: 'pan-y',
            });
        }
        return undefined;
    }
}
