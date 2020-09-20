import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import { ConfigState } from "../reducers";
import {LocalStorageService} from "./storage.service";

export interface Config {
    category?: string,
}


const id = 'config(dedicated)';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    public configUpdated = new Subject<{ old: Config, new: Config }>();
    public static MIN_FONTSIZE = 15;
    public static MAX_FONTSIZE = 25;
    private config: Config = {
        category: 'tin-nong',
    };


    constructor(private storage: LocalStorageService) {
        this.config = {...this.config, ...storage.getItem(id, {})};
        setTimeout(() => this.configUpdated.next({old: this.config, new: this.config}))
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
