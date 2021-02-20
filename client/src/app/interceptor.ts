import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {
    constructor(private snackBar: MatSnackBar){}

    public intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        console.time(req.url + '?' + req.params);
        return next.handle(req).pipe(tap((data) => {
            if (data instanceof HttpResponse) {
                const isError = !(data as HttpResponse<any>).ok;
                if(isError){
                    this.snackBar.open('!Oop, something went wrong');
                }

                console.timeLog(req.url + '?' + req.params);
            }
        }));
    }
}
