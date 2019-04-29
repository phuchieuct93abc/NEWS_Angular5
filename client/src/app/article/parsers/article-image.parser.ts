import {DomService} from "../dom.service";
import {ImageViewerComponent} from "../../story/image-viewer/image-viewer.component";

export default class ArticleImageParser {
    image: HTMLImageElement;


    constructor(private imageWrapper: Element, private domService: DomService) {

        this.image = <HTMLImageElement>imageWrapper.firstElementChild;

    }

    public parse() {
        this.domService.appendComponent(ImageViewerComponent, this.imageWrapper, {
            imagePath: this.image.getAttribute("data-src"),
            width: this.image.getAttribute("width"),
            height: this.image.getAttribute("height"),
            fullSize:true,
            isUseSpinner:true

        });
        this.image.remove();

    }

}
