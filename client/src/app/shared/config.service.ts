import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

export interface Config {
    darkTheme?: boolean
    category?: string
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    public configUpdated = new Subject<Config>()
    private config: Config = {
        category: 'tin-nong',
        darkTheme: false
    }

    constructor() {
        this.config = {...this.config,...JSON.parse(localStorage.getItem('config'))}
    }

    public updateConfig(config: Config) {
        this.config = {...this.config, ...config};
        localStorage.setItem('config',JSON.stringify(this.config))
        this.configUpdated.next(this.config)
    }
    public getConfig(){
        return {...this.config}
    }
}