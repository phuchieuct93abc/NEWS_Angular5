import {Component, OnInit} from '@angular/core';

interface LoadingMessage {
    msg: string,
    icon: string
}

const msgs: LoadingMessage[] = [
    {
        msg: "Đợi tí nhe, tớ đang kéo về",
        icon: 'search'
    },
    {
        msg: "Axon đang tuyển dụng, apply lẹ nào",
        icon: 'donut_large'
    },
    {
        msg: "Hãy thay đổi thế giới",
        icon: 'face'
    },
    {
        msg: "Đọc báo để nâng cao kiến thức",
        icon: 'language'
    },
    {
        msg: "Đọc báo để có gấu",
        icon: 'favorite_border'
    },
    {
        msg: "Tôi sẽ biến mất nhanh thôi",
        icon: 'directions_run'
    },
    {
        msg: "Đừng mong chờ phải nhìn thấy tôi",
        icon: 'fiber_manual_record'
    },  {
        msg: "Tôi yêu bạn",
        icon: 'favorite_border'
    },
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
