import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import environment from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckForUpdateService {

  constructor(private updates: SwUpdate) {
    if(!updates.isEnabled){
      return;
    }
    const checkUpdate$ = this.updates.available.subscribe(() => {
      checkUpdate$.unsubscribe();
      alert('New version is available');
      this.updates.activateUpdate().then(() => document.location.reload());
    });
  }

  checkUpdate(): void {
    if(!this.updates.isEnabled){
      return;
    }
    this.updates.checkForUpdate();

    interval(60 * 60 * 1000).subscribe(() => {
      this.updates.checkForUpdate();
    });

  }

}
