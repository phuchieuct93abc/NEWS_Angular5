import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import CONFIG from 'src/environments/environment';

@Pipe({
  name: 'sourceIframe',
})
export class SourceIframePipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}

  transform(iframeSource: string): SafeHtml {
    if (iframeSource.includes('tinhte.vn')) {
      return this._sanitizer.bypassSecurityTrustResourceUrl(iframeSource);
    }
    return this._sanitizer.bypassSecurityTrustResourceUrl(CONFIG.baseUrl + 'redirect?url=' + iframeSource);
  }
}
