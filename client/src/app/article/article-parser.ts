import {DomService} from "./dom.service";
import {VideoComponent} from "./video/video.component";

export default class ArticleContentParser {
    video: HTMLVideoElement;
    source: HTMLSourceElement;

    sourceUrl: string;

    posterUrl: string;

    constructor(private videoBody: Element, private domService: DomService) {

        this.video = <HTMLVideoElement>videoBody.firstElementChild;
        this.source = <HTMLSourceElement>this.video.firstElementChild
        this.sourceUrl = this.source.getAttribute('src');
        this.posterUrl = this.video.getAttribute('poster');

    }

    public parse() {
        this.updateVideoAttributes();
        this.appendOpenVideo();
        this.source.remove();
    }

    private appendOpenVideo() {
        let openVideo: HTMLDivElement = document.createElement('div');
        openVideo.classList.add('text-right');

        let openVideoLink: HTMLAnchorElement = <HTMLAnchorElement>(document.createElement('a'));
        openVideoLink.textContent = 'Mở video';
        openVideoLink.setAttribute('href', this.sourceUrl);
        openVideoLink.setAttribute('target', '_blank');
        openVideoLink.setAttribute('rel', 'noreferrer');

        openVideoLink.classList.add('mat-button', 'mat-primary');

        openVideo.append(openVideoLink)
        this.videoBody.append(openVideo);

        let frame: HTMLElement = document.createElement('app-video')
        frame.setAttribute('referrerpolicy', "no-referrer");
        frame.setAttribute('src', this.sourceUrl);
        this.domService.appendComponent(VideoComponent, this.videoBody, {
            url: this.sourceUrl,
            poster: this.posterUrl,
            width: this.video.getAttribute('width'),
            height: this.video.getAttribute('height')
        });
        // const player = new playerjs.Player(frame);
        //
        // player.on('play', () => console.log('play'));
        this.videoBody.append(frame);
        this.video.remove();

    }

    private updateVideoAttributes() {
        this.video.setAttribute('controls', 'true');
        this.video.setAttribute('data-html5-video', 'true')
        this.video.setAttribute('playsinline', 'true')
    }

    private updateVideoSrc(video: HTMLVideoElement) {
        // let header = new HttpHeaders({
        //     'Referer': "http://a.a",
        //     'tinh': 'te'
        // })
        // this.httpClient.get(video.firstElementChild.getAttribute('src'), {
        //     headers: header
        // }).subscribe(value => {
        //     console.log('value', value)
        // }, value => {
        //     video.setAttribute('src', value.url);
        //
        // })
    }
}