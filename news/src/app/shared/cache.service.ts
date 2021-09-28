import { Observable, ReplaySubject } from 'rxjs';

const completeObservable = <T>(observable: Observable<T>): Observable<T> =>
  new Observable((observer) => {
    observable.subscribe((data) => {
      observer.next(data);
      observer.complete();
    });
  });

interface CacheConfiguaration {
  id?: string;
  ttl: number;
}
interface CacheItem {
  payload?: any;
  timeToExpired?: number;
}

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
export function Cache(cacheConfiguaration: CacheConfiguaration = { ttl: 1000 * 60 * 10 }) {
  return (target: any, propertyKey: string, descriptor) => {
    if (typeof window === 'undefined') {
      cacheConfiguaration.ttl = 1000;
    }

    const groupCache = cacheConfiguaration?.id ? `${cacheConfiguaration.id}_cached` : `${propertyKey}_cached`;
    const originalFunction = descriptor.value;
    target[groupCache] = {};

    descriptor.value = function (...args) {
      let cacheItem: CacheItem = target[groupCache][JSON.stringify(args)];
      if (cacheItem) {
        const { payload, timeToExpired } = cacheItem;
        if (cacheConfiguaration.ttl !== undefined && new Date().getTime() < timeToExpired) {
          return completeObservable(payload);
        }
        target[groupCache][JSON.stringify(args)] = null;
      }
      cacheItem = target[groupCache][JSON.stringify(args)] = {};
      cacheItem.timeToExpired = new Date().getTime() + cacheConfiguaration.ttl;
      cacheItem.payload = new ReplaySubject(1);
      originalFunction.apply(this, args).subscribe((response) => {
        cacheItem.payload.next(response);
        cacheItem.payload.complete();
      });
      return completeObservable(cacheItem.payload);
    };

    return descriptor;
  };
}

export function ClearCache(groupCache: string) {
  return (target: any, propertyKey: string, descriptor) => {
    const originalFunction = descriptor.value;

    descriptor.value = function (...args) {
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
