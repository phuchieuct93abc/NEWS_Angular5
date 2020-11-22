import { ArticleParser } from "../ArticleParser";
import Article from "../../../../model/Article";
import Utility from "../../Utility";
import BaomoiStoryParser from "../../story/baomoi/BaomoiStoryParser";

export default class BaomoiArticleParser extends ArticleParser {
    constructor() {
        super();
    }

    private convertHtmlBody(): string {
        let dataHTML = this.sanityLazyImages();
        return dataHTML.innerHTML;
    }

    private sanityLazyImages() {
        let dataHTML = this.data.getElementsByClassName('article__body')[0] as HTMLElement;
        let lazyImages = dataHTML.getElementsByClassName("lazy-img");
        for (let i = 0; i < lazyImages.length; i++) {
            lazyImages[i].setAttribute("src", lazyImages[i].getAttribute("data-src"));
        }
        return dataHTML;
    }

    parserArticle(): Article {
        const header = this.data.getElementsByClassName("article__header")[0].textContent;
        const id = this.data.getElementsByClassName("article")[0].getAttribute("data-aid");
        const sourceName = this.data.getElementsByClassName("source")[0].textContent;
        let sourceUrl = this.data.querySelector(".article__action .plsh").getAttribute("href");
        sourceUrl = `https://m.baomoi.com${sourceUrl}`;

        let images: string[] = this.extractImages();
        const description = this.data.getElementsByClassName("article__sapo")[0].textContent;

        let likes = parseInt(this.data.querySelector(".like").textContent);
        let time = this.data.querySelector("time.time").getAttribute("datetime");

        let sourceIconUrl = BaomoiStoryParser.getSourceIconUrl(this.data.querySelector(".article__meta"));

        return new Article(
            id,
            header,
            null,
            this.convertHtmlBody(),
            null,
            null,
            null,
            sourceUrl,
            sourceName,
            sourceIconUrl,
            images,
            description,
            likes,
            time,
            this.extractRalatedNumber()
        );
    }
    private extractImages(): string[] {
        let images = [];
        const imageElements = this.data.getElementsByTagName("img");
        for (let index = 0; index < imageElements.length; index++) {
            images.push(imageElements[index].getAttribute("src"));
        }

        return images;
    }

    private extractRalatedNumber(): number {
        let articleMeta = this.data.querySelector(".article__meta");
        return articleMeta.childElementCount === 3 ? parseInt(articleMeta.lastElementChild.textContent) : 0;
    }
}
