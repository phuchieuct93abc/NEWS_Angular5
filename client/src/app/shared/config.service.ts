import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {LocalStorageService} from "./storage.service";

export interface Config {
    darkTheme?: boolean
    category?: string,
    smallImage?: boolean
}

const id = 'config'

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    public configUpdated = new Subject<{ old: Config, new: Config }>();
    private config: Config = {
        category: 'tin-nong',
        darkTheme: false,
        smallImage: true
    }


    constructor(private storage: LocalStorageService) {
        this.config = {...this.config, ...storage.getItem(id, {})}
    }

    public updateConfig(config: Config) {
        var oldConfig = this.config;
        this.config = {...this.config, ...config};
        this.storage.setItem(id, this.config);
        this.configUpdated.next({old: oldConfig, new: this.config});
    }

    public getConfig() {
        return {...this.config}
    }
}