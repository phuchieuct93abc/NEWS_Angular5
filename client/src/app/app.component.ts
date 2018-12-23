import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Config, ConfigService} from "./shared/config.service";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    name = 'Angular';
    config: Config;

    constructor(private router: Router, private configService: ConfigService) {
    }

    ngOnInit(): void {
        this.config = this.configService.getConfig();
        this.router.navigate([`/${this.config.category}`]);
        this.configService.configUpdated.subscribe((config) => {
            this.config = config
        })

    }

}
