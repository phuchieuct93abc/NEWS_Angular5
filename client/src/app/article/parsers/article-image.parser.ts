import {DomService} from '../dom.service';
import {ImageComponent} from '../article-content/image/image.component';

export default class ArticleImageParser {

    private originalImageElement: HTMLImageElement;

    public constructor(private originalImageWrapperElement: Element, private domService: DomService) {
        this.originalImageElement = this.originalImageWrapperElement.firstElementChild as HTMLImageElement;

    }

    public parse() {
        this.domService.appendComponent(ImageComponent, this.originalImageWrapperElement, {
            src: this.originalImageElement.src,
            width: this.originalImageElement.width,
            height: this.originalImageElement.height,
        });
        this.originalImageElement.remove();

    }

}
