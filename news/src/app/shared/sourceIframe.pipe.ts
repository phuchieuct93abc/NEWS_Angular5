import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import environment from 'src/environments/environment';

@Pipe({
  name: 'sourceIframe',
})
export class SourceIframePipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}

  transform(iframeSource: string): SafeHtml {
    if (iframeSource.includes('tinhte.vn')) {
      // return this._sanitizer.bypassSecurityTrustResourceUrl(iframeSource);
    }
    return this._sanitizer.bypassSecurityTrustResourceUrl(environment.baseUrl + 'redirect?url=' + iframeSource);
  }
}
