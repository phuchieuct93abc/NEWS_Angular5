import {DomService} from '../dom.service';
import {VideoComponent} from '../article-content/video/video.component';

export default class ArticleVideoParser {
    source: HTMLSourceElement;

    sourceUrl: string;

    posterUrl: string;

    constructor(private appVideo: Element, private domService: DomService) {

        this.sourceUrl = this.appVideo.getAttribute('url');
        this.posterUrl = this.appVideo.getAttribute('poster');

    }

    public parse() {
        this.domService.appendComponent(VideoComponent, this.appVideo, {
            url: this.sourceUrl,
            poster: this.posterUrl,
            width: this.appVideo.getAttribute('width'),
            height: this.appVideo.getAttribute('height')
        });

    }

}
