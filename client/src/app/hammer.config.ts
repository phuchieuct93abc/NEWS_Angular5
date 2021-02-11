
import {HammerGestureConfig} from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import CONFIG from 'src/environments/environment';

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
declare var Hammer: any;

@Injectable()
export class HammerConfig extends HammerGestureConfig {
    public buildHammer(element: HTMLElement) {
        if(!CONFIG.isRunningInNode){
            return new Hammer(element, {
                 touchAction: 'pan-y',
            });
        }
        return undefined;
      
    }
}
