import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from '../animation';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [slideInAnimation],
})
export class MainComponent {
  prepareRoute(outlet: RouterOutlet): unknown {
    return outlet?.activatedRouteData?.animation;
  }
}
