import {Injectable} from "@angular/core";

export interface Storage {
    getItem(id: string,fallbackValue:object): object

    setItem(id: string, item: object)
}

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService implements Storage {
    getItem(id: string,fallbackValue:object): object {
     return fallbackValue;
    }

    setItem(id: string, item: object) {
        // localStorage.setItem(id, JSON.stringify(item))

    }

}