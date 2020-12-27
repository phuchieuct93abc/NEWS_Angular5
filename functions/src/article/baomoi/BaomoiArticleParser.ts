import { ArticleParser } from "../ArticleParser";
import Article from "../../../../model/Article";
import Utility from "../../Utility";
import BaomoiStoryParser from "../../story/baomoi/BaomoiStoryParser";

export default class BaomoiArticleParser extends ArticleParser {
    constructor() {
        super();
    }

    private convertHtmlBody(): string {
        let dataHTML = this.data.getElementsByClassName('article__body')[0] as HTMLElement;
        this.sanityLazyImages(dataHTML);
        this.replaceDataAttributes(dataHTML);
        return dataHTML.innerHTML;
    }

    private sanityLazyImages(dataHTML: HTMLElement) {
        let lazyImages = dataHTML.getElementsByClassName("lazy-img");
        for (let i = 0; i < lazyImages.length; i++) {
            lazyImages[i].setAttribute("src", lazyImages[i].getAttribute("data-src"));
        }
        return dataHTML;
    }

    private replaceDataAttributes(dataHTML: HTMLElement){
        dataHTML.innerHTML = dataHTML.innerHTML.replace(/data-/gm,"");

    }

    parserArticle(): Article {
        const header = this.data.getElementsByClassName("article__header")[0].textContent;
        const id = this.data.getElementsByClassName("article")[0].getAttribute("data-aid");
        let sourceUrl = this.data.querySelector(".article__action .plsh").getAttribute("href");
        sourceUrl = `https://m.baomoi.com${sourceUrl}`;
        
        let images: string[] = this.extractImages();
        const description = this.data.getElementsByClassName("article__sapo")[0].textContent;
        
        let likes = parseInt(this.data.querySelector(".like").textContent);
        let time = this.data.querySelector("time.time").getAttribute("datetime");
        
        const meta = this.data.querySelector(".article__meta");
        let sourceName = (meta.querySelector(".source .image") as HTMLImageElement).alt;
        let sourceIconUrl = (meta.querySelector(".source .image") as HTMLImageElement).src;

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
