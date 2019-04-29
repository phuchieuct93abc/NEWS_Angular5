import {DomService} from "../dom.service";
import {VideoComponent} from "../video/video.component";

export default class ArticleVideoParser {
    video: HTMLVideoElement;
    source: HTMLSourceElement;

    sourceUrl: string;

    posterUrl: string;

    constructor(private videoBody: Element, private domService: DomService) {

        this.video = <HTMLVideoElement>videoBody.firstElementChild;
        this.source = <HTMLSourceElement>this.video.firstElementChild
        this.sourceUrl = this.source.getAttribute('data-src');
        this.posterUrl = this.video.getAttribute('poster');

    }

    public parse() {
        this.updateVideoAttributes();
        this.appendOpenVideo();
        this.source.remove();

    }

    private appendOpenVideo() {

        this.domService.appendComponent(VideoComponent, this.videoBody, {
            url: this.sourceUrl,
            poster: this.posterUrl,
            width: this.video.getAttribute('width'),
            height: this.video.getAttribute('height')
        });
        this.videoBody.append(this.createOpenVideoLink());
        this.video.remove();

    }

    private createOpenVideoLink() {
        let openVideo: HTMLDivElement = document.createElement('div');
        openVideo.classList.add('text-right');

        let openVideoLink: HTMLAnchorElement = <HTMLAnchorElement>(document.createElement('a'));
        openVideoLink.textContent = 'Mở video';
        openVideoLink.setAttribute('href', this.sourceUrl);
        openVideoLink.setAttribute('target', '_blank');
        openVideoLink.setAttribute('rel', 'noreferrer');

        openVideoLink.classList.add('mat-button', 'mat-primary');

        openVideo.append(openVideoLink)
        return openVideo;

    }

    private updateVideoAttributes() {
        this.video.setAttribute('controls', 'true');
        this.video.setAttribute('data-html5-video', 'true')
        this.video.setAttribute('playsinline', 'true')
    }

}
