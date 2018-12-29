import {Component, OnInit} from '@angular/core';

interface LoadingMessage {
    msg: string,
    icon: string
}

const msgs: LoadingMessage[] = [
    {
        msg: "Đợi tí nhe, tớ đang kéo về",
        icon: 'search'
    }
]

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
    msg: LoadingMessage;

    ngOnInit() {
        this.msg = msgs[Math.floor(Math.random() * msgs.length)];
    }

}
