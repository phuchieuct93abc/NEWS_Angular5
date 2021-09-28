import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
  animations: [
    trigger('shareSites', [
      transition(':leave', [animate('0.5s', style({ height: 0 }))]),
      transition(':enter', [style({ height: 0 }), animate('0.5s', style({ height: '*' }))]),
    ]),
  ],
})
export class ShareComponent {
  public constructor(private clipboardService: ClipboardService, private snackBar: MatSnackBar) {}

  public copyUrl() {
    this.clipboardService.copyFromContent(window.location.href);
    this.snackBar.open('Copied link successful', null, {
      duration: 2000,
    });
  }
}
