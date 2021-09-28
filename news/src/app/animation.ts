import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('Dashboard => Content', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ left: '100%' })]),

    query(':leave', animateChild()),

    group([query(':leave', [animate('500ms', style({ left: '-100%' }))]), query(':enter', [animate('500ms', style({ left: '0%' }))])]),
    query(':enter', animateChild()),
  ]),
]);
export const opacityNgIf = [
  trigger('opacityNgIf', [
    transition(':enter', [style({ opacity: 0 }), animate('0.5s', style({ opacity: 1 }))]),
    transition(':leave', [style({ opacity: 1 }), animate('0.5s', style({ opacity: 0 }))]),
  ]),
];
