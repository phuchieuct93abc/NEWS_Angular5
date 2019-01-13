import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {delay, tap} from "rxjs/operators";

const maxAge = 30000;

@Injectable({
    providedIn: 'root'
})
export class RequestCache {
    cache: Map<string, HttpResponse<any>> = new Map();

    // constructor(private localStorage: LocalStorageService) {
    //     // this.cache = <Map<string, HttpResponse<any>>>this.objToStrMap(localStorage.getItem('cache-http', {}));
    // };


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
        this.update();

    }

    private update() {
   //     this.localStorage.setItem('cache-http', this.strMapToObj(this.cache));
    }

    private strMapToObj(strMap) {
        const obj = {};
        strMap.forEach((v, k) => {
            obj[k] = v
        });
        return obj;
    }

    private objToStrMap(obj) {
        const mp: Map<string, HttpResponse<any>> = new Map;
        Object.keys(obj).forEach(k => {
            mp.set(k, <HttpResponse<any>>obj[k])
        });
        return mp;
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

    sendRequest(
        req: HttpRequest<any>,
        next: HttpHandler,
        cache: RequestCache): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    cache.put(req, event);
                }
            })
        );
    }
}
