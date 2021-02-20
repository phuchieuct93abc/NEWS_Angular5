import {DomService} from '../dom.service';
import {VideoComponent} from '../article-content/video/video.component';

export default class ArticleVideoParser {
    video: HTMLVideoElement;
    source: HTMLSourceElement;

    sourceUrl: string;

    posterUrl: string;

    constructor(private videoBody: Element, private domService: DomService) {

        this.video = <HTMLVideoElement>videoBody.firstElementChild;
        this.source = <HTMLSourceElement>this.video.firstElementChild;
        this.sourceUrl = this.source.getAttribute('src');
        this.posterUrl = this.video.getAttribute('poster');

    }

    public parse() {
        this.domService.appendComponent(VideoComponent, this.videoBody, {
            url: this.sourceUrl,
            poster: this.posterUrl,
            width: this.video.getAttribute('width'),
            height: this.video.getAttribute('height'),
        });
        this.video.remove();

    }

}
