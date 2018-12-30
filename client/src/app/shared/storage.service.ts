import {Injectable} from "@angular/core";

export interface Storage {
    getItem(id: string): object

    setItem(id: string, item: object)
}

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService implements Storage {
    getItem(id: string): object {
        return JSON.parse(localStorage.getItem(id))
    }

    setItem(id: string, item: object) {
        localStorage.setItem(id, JSON.stringify(item))

    }

}