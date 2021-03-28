import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckForUpdateService {

  constructor(private updates: SwUpdate) {
    if(!this.updates.isEnabled){
      return;
    }
    this.updates.available.pipe(take(1)).subscribe(() => {
      alert('New version is available');
      this.updates.activateUpdate().then(() => document.location.reload());
    });
  }

  checkUpdate(): void {
    if(!this.updates.isEnabled){
      return;
    }
    this.updates.checkForUpdate();



  }

}
