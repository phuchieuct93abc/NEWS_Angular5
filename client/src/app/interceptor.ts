import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { response } from 'express';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {
    constructor(private snackBar: MatSnackBar){}

    public intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        console.time(req.url + '?' + req.params);
        return next.handle(req).pipe(tap((data) => {
            console.log(data)
            if (data instanceof HttpResponse) {
                          console.timeLog(req.url + '?' + req.params);
            }
        }),
        catchError((error: HttpErrorResponse)=>{
            console.log(error)
            this.snackBar.open('!Oop, something went wrong');
            return throwError(error);
        }));
    }
}
