import {DomService} from "../dom.service";
import {ImageComponent} from "../article-content/image/image.component";

export default class ArticleImageParser {

    private originalImageElement: HTMLImageElement;

    constructor(private originalImageWrapperElement: Element, private domService: DomService) {
        this.originalImageElement = <HTMLImageElement>this.originalImageWrapperElement.firstElementChild

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
