import { Observable, ReplaySubject } from 'rxjs';
/**
 * This file is responsible for caching data to avoid fetching the same data many times:
 * How to use: Example:
 * class MemberService {
 *
 *      @Cache()
 *      getCofounderMember(): Observable<MemberContact> {
 *          return this.http.get<MemberContact>(ApiURL.COFOUNDER_CONTACT);
 *      }
 *  }
 *
 * How to clear cache
 * class MemberService {
 *   @Cache('cofounder')
 *   getCofounderMember(id): Observable<MemberContact> {
 *       return this.http.get<MemberContact>(ApiURL.COFOUNDER_CONTACT);
 *   }
 *
 *   @ClearCache('cofounder')
 *    clear(id): Observable<MemberContact> {
 *        return [id];
 *    }
 *    @ClearCache('cofounder')
 *    clearAll(): Observable<MemberContact> {
 *        return null;
 *    }
 *  }
 */
const completeObservable = <T>(observable: Observable<T>): Observable<T> =>
    new Observable((observer) => {
        observable.subscribe((data) => {
            observer.next(data);
            observer.complete();
        });
    });


interface CacheConfiguaration {
    id?: string;
    ttl?: number;
}

export function Cache(cacheConfiguaration?: CacheConfiguaration) {
    return (target: any, propertyKey: string, descriptor) => {
        if (typeof window === 'undefined') {
            return descriptor;
        }
        const groupCache = cacheConfiguaration?.id ? `${cacheConfiguaration.id}_cached` : `${propertyKey}_cached`;
        const originalFunction = descriptor.value;
        target[groupCache] = {};

        descriptor.value = function(...args) {
            if (target[groupCache][JSON.stringify(args)]) {
                return completeObservable(target[groupCache][JSON.stringify(args)]);
            }
            const replaySubject = target[groupCache][JSON.stringify(args)] = target[groupCache][JSON.stringify(args)] ?? new ReplaySubject(1);
            originalFunction.apply(this, args).subscribe((response) => {
                if (cacheConfiguaration?.ttl) {
                    setTimeout(() => {
                        target[groupCache][JSON.stringify(args)] = null;
                    }, cacheConfiguaration.ttl);
                }
                replaySubject.next(response);
                replaySubject.complete();
            });
            return completeObservable(replaySubject);
        };

        return descriptor;
    };
}

export function ClearCache(groupCache: string) {
    return (target: any, propertyKey: string, descriptor) => {
        const originalFunction = descriptor.value;

        descriptor.value = function(...args) {
            const cacheId = originalFunction.apply(this, args);
            if (cacheId) {
                target[`${groupCache}_cached`][JSON.stringify(cacheId)] = null;
            } else {
                target[`${groupCache}_cached`] = {};
            }
            return cacheId;
        };
        return descriptor;
    };
}
