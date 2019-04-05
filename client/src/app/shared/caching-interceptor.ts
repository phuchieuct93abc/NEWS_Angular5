import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {delay, tap, timeout} from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class RequestCache {
    cache: Map<string, HttpResponse<any>> = new Map();


    get(req: HttpRequest<any>): HttpResponse<any> | undefined {
        const url = req.urlWithParams;
        const cached = this.cache.get(url);
        if (!cached) {
            return undefined;
        }

        return cached;
    }

    put(req: HttpRequest<any>, response: HttpResponse<any>): void {

        const url = req.urlWithParams;
        this.cache.set(url, response);

    }

}

@Injectable({
    providedIn: 'root'

})
export class CachingInterceptor implements HttpInterceptor {
    readonly noCacheUri: string[] = ['/story'];

    constructor(private cache: RequestCache) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        const isNeedCache = this.noCacheUri.find(noCache => req.url.includes(noCache)) == undefined;
        const cachedResponse = this.cache.get(req);
        return cachedResponse && isNeedCache ? of(cachedResponse).pipe(delay(500)) : this.sendRequest(req, next, this.cache);
    }

    sendRequest(req: HttpRequest<any>, next: HttpHandler, cache: RequestCache): Observable<HttpEvent<any>> {

        if (typeof window === "undefined") {
            if (req.url.indexOf("/article") >= 0) {
                return this.call(next, req, cache);
            } else {
                return of(null);
            }

        } else {
            return this.call(next, req, cache);

        }


    }

    private call(next: HttpHandler, req: HttpRequest<any>, cache: RequestCache) {
        return next.handle(req).pipe(
            timeout(5000),
            tap(event => {
                if (event instanceof HttpResponse) {
                    console.log("CALL API", req.url)
                    cache.put(req, event);
                }
            })
        );
    }
}
