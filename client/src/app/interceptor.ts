import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
    constructor(private snackBar: MatSnackBar) { }

    public intercept(req: HttpRequest<unknown>, next: HttpHandler):
        Observable<HttpEvent<unknown>> {

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                this.snackBar.open('! Oop, something went wrong', null, { duration: 2000 });
                return throwError(error);
            }));
    }
}
