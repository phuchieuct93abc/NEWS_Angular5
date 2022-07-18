import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class CheckForUpdateService {
  constructor(private updates: SwUpdate) {
    if (!this.updates.isEnabled) {
      return;
    }
    this.updates.available.subscribe(() => {
      alert('New version is available');
      this.updates.activateUpdate().then(() => document.location.reload());
    });
  }

  checkUpdate(): void {
    if (!this.updates.isEnabled) {
      return;
    }
    console.warn('Checking for update');
    this.updates.checkForUpdate();
  }
}
