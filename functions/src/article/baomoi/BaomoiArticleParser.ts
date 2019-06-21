import {ArticleParser} from "../ArticleParser";
import Article from "../../../../model/Article";
import Utility from "../../Utility";

export default class BaomoiArticleParser extends ArticleParser {

    constructor() {
        super();
    }

    private convertHtmlBody() {

        let body = this.data.getElementsByClassName('article__body')[0].innerHTML;
        return Utility.replaceAll(body, "data-", "");
    }


    parserArticle(): Article {
        const header = this.data.getElementsByClassName('article__header')[0].textContent;
        const id = this.data.getElementsByClassName('article')[0].getAttribute('data-aid');
        const sourceName = this.data.getElementsByClassName('source')[0].textContent;
        let sourceUrl = this.data.querySelector(".article__action .plsh").getAttribute("href");
        sourceUrl = `https://m.baomoi.com${sourceUrl}`;

        let images = this.extractImages();
        const description = this.data.getElementsByClassName('article__sapo')[0].textContent;

        let likes = parseInt(this.data.querySelector(".like").textContent);
        let time = this.data.querySelector("time.time").getAttribute('datetime');
        return new Article(id, header, null, this.convertHtmlBody(), null, null, null, sourceUrl, sourceName, images, description, likes, time, this.extractRalatedNumber());
    }


    private extractImages() {
        let images = [];
        const imageElements = this.data.getElementsByTagName('img');
        for (let index = 0; index < imageElements.length; index++) {
            images.push(imageElements[index].getAttribute('src'))
        }


        return images;
    }

    private extractRalatedNumber(): number {
        let articleMeta = this.data.querySelector(".article__meta");
        return articleMeta.childElementCount === 3 ? parseInt(articleMeta.lastElementChild.textContent) : 0

    }
}
