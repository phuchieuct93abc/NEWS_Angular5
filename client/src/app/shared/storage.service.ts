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
        const item = JSON.parse(localStorage.getItem(id));
        return item?item:fallbackValue;
    }

    setItem(id: string, item: object) {
        localStorage.setItem(id, JSON.stringify(item))

    }

}